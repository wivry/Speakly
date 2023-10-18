import React from "react";
import vmsg from "vmsg";

const MAX_RECORDINGS = 10; // maximální množství nahrávek

// odkaz na VMSG recorder nahrávek
const recorder = new vmsg.Recorder({
  wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm",
});

// vlastní třída pro nahrávání
class RecordVoice extends React.Component {
  constructor(props) {
    super(props);
    this.props.newRecordIsDone(false);
  }

  // výchozí stavy dané komponenty
  state = {
    isLoading: false,
    isRecording: false,
    recordings: [], // zde jsou uložené nahrávky
    selectedAudio: 0, // index nahrávky, kterou uživatel zvolil (0 = žádná nahrávka)
  };

  // resetuje danou komponentu resetováním stavů
  resetRecordVoice = () => {
    this.setState({
      isLoading: false,
      isRecording: false,
      recordings: [],
      selectedAudio: 0,
    });
  };

  // Funkce pro nahrávání audia z mikrofonu
  record = async () => {
    this.setState({ isLoading: true });
    this.setState({ selectedAudio: 0 });

    if (this.state.isRecording) {
      // pokud již nahrávání běží, zastav ho
      const blob = await recorder.stopRecording();
      // uložení stavů nahrávání
      this.setState({
        isLoading: false,
        isRecording: false,
        recorded: true,
        recordings: this.state.recordings.concat(URL.createObjectURL(blob)),
      });
    } else {
      // pokud ještě recorder neběží, začni nahrávat
      try {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        this.props.newRecordIsDone(false);
        this.setState({ isLoading: false, isRecording: true });
      } catch (e) {
        console.error(e);
        this.props.newRecordIsDone(false);
        this.setState({ isLoading: false });
      }
    }
  };

  // Funkce pro odstranění nahrávky z pole a aktualizaci stavu komponenty
  deleteAudio = (index) => {
    if (!this.state.isLoading || !this.state.isRecording) {
      // pouze pokud recorder neběží
      const updatedRecordings = [...this.state.recordings];
      updatedRecordings.splice(index, 1);
      this.setState({ recordings: updatedRecordings });
    }
  };

  // předá index zvolené nahravky do vyšší komponenty
  sendAudio = (index) => {
    if (!this.state.isLoading || !this.state.isRecording) {
      // pouze pokud recorder neběží
      this.props.newRecordIsDone(index + 1, this.state.recordings[index]); // zde předá vyšší komponentě
      this.setState({ selectedAudio: index + 1 });
    }
  };

  // vykreslení komponenty
  render() {
    const { isLoading, isRecording, recordings } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-4" />
          <button
            className={
              isRecording
                ? "col-4 btn btn-lg shadow-lg btn-danger custom-rounded"
                : "col-4 btn btn-lg shadow-lg btn-primary custom-rounded "
            }
            disabled={isLoading || recordings.length >= MAX_RECORDINGS}
            onClick={this.record}
          >
            {isRecording ? "Stop recording" : "Record"}
          </button>
        </div>
        <div className="row g-3">
          <div className="col-1"></div>
          <ul className="col mt-4" style={{ listStyle: "none", padding: 0 }}>
            {recordings.map((url, index) => (
              <li key={url}>
                <div className="row mt-2 mb-2">
                  <div
                    className="col-1 bg-light custom-rounded d-flex align-items-center justify-content-center"
                    style={{ width: "60px", height: "54px" }}
                  >
                    <h5 className="">{index + 1}</h5>
                  </div>

                  <audio className="col-7" src={url} controls />

                  <div className="col-md-2 offset-md-1 text-end">
                    <div className="d-inline-flex h-100">
                      <button
                        className="btn shadow-sm btn-danger custom-rounded custom-button"
                        type="button"
                        disabled={isLoading || isRecording}
                        onClick={() => this.deleteAudio(index)}
                      >
                        Delete
                      </button>

                      <button
                        className="btn ms-2 shadow-sm btn-warning custom-rounded custom-button"
                        type="button"
                        data-toggle="button"
                        aria-pressed="false"
                        disabled={
                          isLoading ||
                          isRecording ||
                          this.state.selectedAudio === index + 1
                        }
                        onClick={() => this.sendAudio(index)}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {recordings.length >= MAX_RECORDINGS && (
          <div
            className="alert alert-warning text-center custom-rounded mt-5"
            role="alert"
          >
            You have reached the maximum number of recordings.
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default RecordVoice;
