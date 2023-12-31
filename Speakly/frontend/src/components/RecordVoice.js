import React from "react";
import AudioAnalyser from "./lib/AudioAnalyser";

const MAX_RECORDINGS = 10; // maximální množství nahrávek

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
    status: "",
  };

  // stav pro analyser
  componentDidMount() {}

  componentWillUnmount() {}

  controlAudio(status) {
    this.setState({
      status,
    });
    this.setState({
      audioType: "audio/wav",
    });
  }

  // resetuje danou komponentu resetováním stavů
  resetRecordVoice = () => {
    this.setState({
      isLoading: false,
      isRecording: false,
      recordings: [],
      selectedAudio: 0,
    });
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
    const { status, audioSrc, audioType } = this.state;
    const audioProps = {
      mimeType: "audio/wav",
      audioType: "audio/wav",
      //audioOptions: { sampleRate: 16000 },
      backgroundColor: "rgba(255, 255, 255, 255)",
      strokeColor: "#000000",
      className: "audioConteiner",
      //width: this.state.width,
      width: 400,
      audioBitsPerSecond: 128000,
      status,
      audioSrc,
      timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
      startCallback: (e) => {
        this.props.newRecordIsDone(false);
        this.setState({ isLoading: false, isRecording: true });
        console.log("succ start", e);
      },
      pauseCallback: (e) => {
        console.log("succ pause", e);
      },
      stopCallback: (e) => {
        // uložení stavů nahrávání
        this.setState({
          isLoading: false,
          isRecording: false,
          recorded: true,
          recordings: this.state.recordings.concat(URL.createObjectURL(e)),
        });
        console.log("succ stop", e);
      },
      onRecordCallback: (e) => {
        this.props.newRecordIsDone(false);
        this.setState({
          isLoading: false,
          isRecording: true,
          selectedAudio: 0,
        });
        console.log("recording", e);
      },
      errorCallback: (err) => {
        console.log("error", err);
      },
    };
    return (
      <React.Fragment>
        <AudioAnalyser {...audioProps}>
          <div className="row">
            <div className="col-4" />

            {status !== "recording" && (
              <button
                className="col-4 btn btn-lg shadow-lg btn-primary custom-rounded "
                onClick={() => this.controlAudio("recording")}
                disabled={isLoading || recordings.length >= MAX_RECORDINGS}
              >
                Record
              </button>
            )}
            {status === "recording" && (
              <button
                className="col-4 btn btn-lg shadow-lg btn-danger custom-rounded "
                onClick={() => this.controlAudio("inactive")}
                disabled={isLoading || recordings.length >= MAX_RECORDINGS}
              >
                Stop recording
              </button>
            )}
          </div>
        </AudioAnalyser>

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
