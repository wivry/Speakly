import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";

const MAX_RECORD_TIME = 60; // maximální čas jedné nahrávky v sekundách

function SurferRecorder(props) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.height = 100; // Upravte podle potřeby
  // Výška canvasu
  const canvasHeight = canvas.height;

  // lineární gradient
  const progressGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  progressGradient.addColorStop(0, "#68a4fd"); // Barva nahoře
  progressGradient.addColorStop(1, "#0d6efd"); // Barva dole
  ctx.fillStyle = progressGradient;
  ctx.fillRect(0, 0, canvas.width, canvasHeight);

  const [isRecording, setIsRecording] = useState();
  //const [durationEl, setDurationEl] = useState();
  const containerRef = useRef();
  const [wavesurfer, setWavesurfer] = useState(null);
  const [recorderWS, setRecorderWS] = useState(null);
  const [timer, setTimer] = useState(null);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      backend: "WebAudio",
      waveColor: progressGradient,
      cursorColor: "#0d6efd",
      cursorWidth: 6,
      height: 100,
      width: "100%",
      progressColor: progressGradient,
      barWidth: 3,
      barGap: 2,
      barRadius: 6,
      barHeight: 1,
      container: containerRef.current,
    });

    //const MediaRecorderOptions = { mimeType: "audio/wav" };

    // Initialize the Record plugin
    const record = ws.registerPlugin(RecordPlugin.create());
    setRecorderWS(record);

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [containerRef]);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return;

    const subscriptions = [
      //recorder.on("record-end", (blob) => {
      //  setRecordedUrl(URL.createObjectURL(blob));
      //}),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  function recordButton() {
    // Record button
    if (isRecording) {
      clearTimeout(timer);
      recorderWS.stopMic();
      setIsRecording(false);
      if (props.recordButtonPressed) {
        props.recordButtonPressed(false);
      }
    } else {
      recorderWS.startMic().then(() => {
        setIsRecording(true);
        if (props.recordButtonPressed) {
          props.recordButtonPressed(true);
        }

        const timeout = setTimeout(() => {
          console.log("timer stops");
          recorderWS.stopMic();
          setIsRecording(false);
          if (props.recordButtonPressed) {
            props.recordButtonPressed(false);
          }
        }, 1000 * MAX_RECORD_TIME);
        setTimer(timeout);
      });
    }
  }

  return (
    <div>
      <div
        className="custom-rounded shadow-sm ms-2"
        ref={containerRef}
        id="waveform-record"
      ></div>
      <div className="row">
        <div className="col-4" />
        <button
          className={
            isRecording
              ? "col-4 btn btn-lg shadow-lg btn-danger custom-rounded mt-2"
              : "col-4 btn btn-lg shadow-lg btn-primary custom-rounded mt-2"
          }
          onClick={recordButton}
          disabled={props.disabled}
        >
          {isRecording ? "Stop recording" : "Record"}
        </button>
      </div>
    </div>
  );
}

export default SurferRecorder;
