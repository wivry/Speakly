import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";

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

  const [isRecording, setIsRecording] = useState(false);
  //const [durationEl, setDurationEl] = useState();
  const [recordedUrl, setRecordedUrl] = useState();
  const containerRef = useRef();
  const [wavesurfer, setWavesurfer] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

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

    // Initialize the Record plugin
    const record = ws.registerPlugin(
      RecordPlugin.create({ mimeType: MediaRecorderOptions["mimeType"] })
    );
    setRecorder(record);

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [containerRef]);

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return;

    setCurrentTime(0);

    const subscriptions = [
      wavesurfer.on("timeupdate", (currentTime) => setCurrentTime(currentTime)),
      recorder.on("record-end", (blob) => {
        setRecordedUrl(URL.createObjectURL(blob));
      }),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  const recordButton = () => {
    // Record button
    if (recorder.isRecording()) {
      recorder.stopRecording();
      setIsRecording(false);
    } else {
      //const deviceId = micSelect.value;
      recorder.startRecording({ mimeType: "audio/wav" }).then(() => {
        setIsRecording(true);
      });
    }
  };

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
              ? "col-4 btn btn-lg shadow-lg btn-danger custom-rounded"
              : "col-4 btn btn-lg shadow-lg btn-primary custom-rounded"
          }
          type="button"
          onClick={recordButton}
        >
          {isRecording ? "Stop recording" : "Record"}
        </button>
      </div>
      <div className="row">
        {recordedUrl ? <audio controls src={recordedUrl}></audio> : null}
      </div>
    </div>
  );
}

export default SurferRecorder;
