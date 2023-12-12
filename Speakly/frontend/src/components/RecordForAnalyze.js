import React from "react";
import AudioAnalyser from "./lib/AudioAnalyser";
import AudioWaveform from "./AudioWaveform";
import SurferRecorder from "./SurferRecorder";
import Sentence from "./Sentence";

const MAX_RECORDINGS = 3; // maximální množství nahrávek

// vlastní třída pro nahrávání
class RecordForAnalyze extends React.Component {
  constructor(props) {
    super(props);
  }

  // výchozí stavy dané komponenty
  state = {
    isLoading: false,
    isRecording: false,
    recordings: [], // zde jsou uložené nahrávky
    sentenceRecorded: [], // věty
    currentSentence: "",
    selectedList: [],
    status: "",
  };

  // stav pro analyser
  componentDidMount() {
    //this.props.newRecordIsDone(false);
  }

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
    const updatedList = [];
    for (let i; i < MAX_RECORDINGS; i++) {
      updatedList.push(0); // vytvoření listu obsahující nuly
    }
    this.setState({
      isLoading: false,
      isRecording: false,
      recordings: [],
      currentSentence: "",
      sentenceRecorded: [],
      selectedList: updatedList,
    });
  };

  // Funkce pro odstranění nahrávky z pole a aktualizaci stavu komponenty
  deleteAudio = (index) => {
    if (!this.state.isLoading || !this.state.isRecording) {
      // pouze pokud recorder neběží
      //update listu s nahrávkamai
      const updatedRecordings = [...this.state.recordings];
      updatedRecordings.splice(index, 1);
      this.setState({ recordings: updatedRecordings });
      //update listu s nahranými větami
      const updatedSentences = [...this.state.sentenceRecorded];
      updatedSentences.splice(index, 1);
      this.setState({ sentenceRecorded: updatedSentences });
      const updatedSelectedList = [...this.state.selectedList];
      updatedSelectedList.splice(index, 1);
      updatedSelectedList.push(0);
      this.setState({ selectedList: updatedSelectedList });
    }
  };

  // předá index zvolené nahravky do vyšší komponenty
  analyzeAudio = (index) => {
    if (!this.state.isLoading || !this.state.isRecording) {
      // pouze pokud recorder neběží
      const updatedList = this.state.selectedList.slice(); // Vytvoření kopie seznamu
      updatedList[index] = 1;

      this.setState({ selectedList: updatedList });

      this.props.newRecordIsDone(index, this.state.recordings[index]); // zde předá vyšší komponentě
    }
  };

  recordButtonPressed = (state) => {
    if (state) {
      this.controlAudio("recording");
    } else {
      this.controlAudio("inactive");
      this.setState({
        sentenceRecorded: this.state.sentenceRecorded.concat(
          this.state.currentSentence
        ),
      });
    }
  };

  handleSentence = (sentence) => {
    this.setState({ currentSentence: sentence });
  };

  // vykreslení komponenty
  render() {
    // naplnění listu vybraných nahrávek nulami (jednička na daném indexu indikuje výběr dané nahrávky)
    if (this.state.selectedList.length === 0) {
      for (let i = 0; i < MAX_RECORDINGS; i++) {
        this.state.selectedList.push(0);
      }
    }

    const { isLoading, isRecording, recordings } = this.state;
    const { status, audioSrc, audioType } = this.state;
    const audioProps = {
      mimeType: "audio/wav",
      audioType: "audio/wav",
      audioOptions: { sampleRate: 16000 }, // musí být fs nastaveno, jinak to nefunguje
      backgroundColor: "rgba(255, 255, 255, 255)",
      strokeColor: "#00000000",
      className: "audioConteiner",
      //width: this.state.width,
      width: 1,
      height: 1,
      audioBitsPerSecond: 256000, // 16000 * 16 - pro jistotu
      status,
      audioSrc,
      timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
      startCallback: (e) => {
        //this.props.newRecordIsDone(false);
        this.setState({
          isLoading: false,
          isRecording: true,
        });
        console.log("succ start", e);
        // nastavení časovače pro automatické vypnutí nahrávání po  MAX_RECORD_TIME s
      },
      pauseCallback: (e) => {
        console.log("succ pause", e);
      },
      stopCallback: (e) => {
        //this.props.newRecordIsDone(this.state.selectedList,this.state.recordings,this.state.sentenceRecorded); // zde předá vyšší komponentě
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
        //this.props.newRecordIsDone(false);
        this.setState({
          isLoading: false,
          isRecording: true,
        });
        console.log("recording", e);
      },
      errorCallback: (err) => {
        console.log("error", err);
      },
    };
    return (
      <React.Fragment>
        <Sentence
          info={"Say anything you want, or read the following sentence:"}
          currentSentence={this.handleSentence}
        />
        <SurferRecorder
          disabled={isLoading || recordings.length >= MAX_RECORDINGS}
          recordButtonPressed={this.recordButtonPressed}
        />
        <AudioAnalyser {...audioProps}></AudioAnalyser>

        <div className="row mb-1">
          <ul
            className="col"
            style={{ listStyle: "none", padding: 0, margin: 0 }}
          >
            {recordings.map((url, index) => (
              <li key={url} className="ms-2" style={{ marginRight: 15 }}>
                <div className="row mt-2 mb-2">
                  <div
                    className="col-1 custom-background shadow-sm custom-rounded d-flex align-items-center justify-content-center ms-2"
                    style={{ width: "60px" }}
                  >
                    <h5 className="mt-1 mb-1">{index + 1}</h5>
                  </div>

                  <AudioWaveform audioURL={url} className="ms-1" />

                  <button
                    className="col-1 btn shadow-sm btn-danger custom-rounded ms-2"
                    style={{ width: "70px" }}
                    type="button"
                    disabled={isLoading || isRecording}
                    onClick={() => this.deleteAudio(index)}
                  >
                    {" "}
                    <i className="bi bi-trash3"></i>
                  </button>

                  <button
                    className={
                      this.state.selectedList[index]
                        ? "col-1 btn ms-2 mr-2 shadow-sm btn-warning custom-rounded custom-button"
                        : "col-1 btn ms-2 mr-2 shadow-sm btn-primary custom-rounded custom-button"
                    }
                    style={{ width: "90px" }}
                    type="button"
                    data-toggle="button"
                    aria-pressed="false"
                    disabled={
                      isLoading || isRecording || this.state.selectedList[index]
                    }
                    onClick={() => this.analyzeAudio(index)}
                  >
                    Analyze
                  </button>
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

export default RecordForAnalyze;
