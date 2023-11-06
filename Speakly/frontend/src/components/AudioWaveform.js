import React, { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

function AudioWaveform({ audioURL }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const waveformRef = useRef(null);
  const waveform = useRef(null);

  useEffect(() => {
    waveform.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#6c757d",
      cursorColor: "#0d6efd",
      cursorWidth: 4,
      height: 48,
      width: "100%",
      progressColor: "#495057",
    });

    waveform.current.load(audioURL);

    // Přidání poslechu události "finish" pro WaveSurfer
    waveform.current.on("finish", () => {
      setIsPlaying(false);
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
        ></div>
      </div>
    </div>
  );
}

export default AudioWaveform;
