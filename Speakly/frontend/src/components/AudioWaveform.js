import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
//import Hover from "https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js";
import Hover from "wavesurfer.js/dist/plugins/hover";

function AudioWaveform({ audioURL }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeEl, setTimeEl] = useState();
  const [durationEl, setDurationEl] = useState();
  const waveformRef = useRef(null);
  const waveform = useRef(null);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.height = 48; // Upravte podle potřeby
  // Výška canvasu
  const canvasHeight = canvas.height;

  // lineární gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, "#6c757d"); // Barva nahoře
  gradient.addColorStop(1, "#4c789e"); // Barva dole
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvasHeight);

  // lineární gradient
  const progressGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  progressGradient.addColorStop(0, "#68a4fd"); // Barva nahoře
  progressGradient.addColorStop(1, "#0d6efd"); // Barva dole
  ctx.fillStyle = progressGradient;
  ctx.fillRect(0, 0, canvas.width, canvasHeight);

  useEffect(() => {
    waveform.current = WaveSurfer.create({
      container: waveformRef.current,
      //waveColor: "#6c757d",
      waveColor: gradient,
      cursorColor: "#0d6efd",
      cursorWidth: 4,
      height: 50,
      width: "100%",
      //progressColor: "#495057",
      progressColor: progressGradient,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      barHeight: 1.2,
      plugins: [
        Hover.create({
          lineColor: "#68a4fd",
          lineWidth: 2,
          labelColor: "#ddd",
          labelSize: "11px",
        }),
      ],
    });

    waveform.current.load(audioURL);

    // Přidání poslechu události "finish" pro WaveSurfer
    waveform.current.on("finish", () => {
      setIsPlaying(false);
    });

    // Current time & duration
    waveform.current.on("ready", () => {
      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemainder = Math.round(seconds) % 60;
        const paddedSeconds = `0${secondsRemainder}`.slice(-2);
        return `${minutes}:${paddedSeconds}`;
      };

      waveform.current.on("audioprocess", (currentTime) => {
        setTimeEl(formatTime(currentTime));
      });

      setTimeEl(formatTime(0));
      setDurationEl(formatTime(waveform.current.getDuration()));
    });

    return () => {
      waveform.current.destroy();
    };
  }, [audioURL]);

  const togglePlay = () => {
    if (isPlaying) {
      waveform.current.pause();
    } else {
      waveform.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="col-9">
      <div className="row ">
        <button
          className="col-1 btn btn-lg shadow btn-primary custom-rounded custom-button ms-2"
          type="button"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-stop-fill"
              viewBox="0 0 20 20"
            >
              <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-play-fill"
              viewBox="0 0 20 20"
            >
              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
            </svg>
          )}
        </button>

        <div
          className="col custom-background custom-rounded shadow-sm ms-2"
          ref={waveformRef}
          id="waveform"
        >
          <div className="time">{timeEl}</div>
          <div className="duration">{durationEl}</div>
        </div>
      </div>
    </div>
  );
}

export default AudioWaveform;
