import React, { useState, useEffect, useRef } from "react";

import "./App.css";
import beep from "./static/beep.mp3";
import { formatTime } from "./utils";

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [timeLeft, setTimeLeft] = useState(1500);
  const [pause, setPause] = useState(true);
  const [totalSession, setTotalSession] = useState(0);
  const [totalBreak, setTotalBreak] = useState(0);

  const audioElement = useRef(null);

  useEffect(() => {
    if (!pause && timeLeft >= 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timeLeft <= 0) {
      audioElement.current.play();
      audioElement.current.currentTime = 0;
      if (timerLabel === "Session") {
        setTimeLeft(breakLength * 60);
        setTotalSession(prevTotal => prevTotal + sessionLength);
        setTimerLabel("Break");
      }
      if (timerLabel === "Break") {
        setTimeLeft(sessionLength * 60);
        setTotalBreak(prevTotal => prevTotal + breakLength);
        setTimerLabel("Session");
      }
    }
  }, [pause, breakLength, sessionLength, timerLabel, timeLeft]);

  const handlePauseToggle = () => {
    setPause(!pause);
  };

  const handleReset = () => {
    setPause(true);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(1500);
    audioElement.current.load();
  };

  const handleChange = (delta, type) => {
    let newTime = 0;
    if (type === "Session") {
      newTime = sessionLength + delta;
    } else {
      newTime = breakLength + delta;
    }

    if (newTime > 0 && newTime <= 60 && pause) {
      if (type === "Session") {
        setSessionLength(newTime);
        setTimeLeft(newTime * 60);
      } else {
        setBreakLength(newTime);
      }
    }
  };

  return (
    <div className="App">
      <div className="flex-container">
        <div className="flex-item">
          <span id="break-label">Break Length</span>
          <br />
          <button
            id="break-decrement"
            onClick={() => handleChange(-1, "Break")}
          >
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => handleChange(1, "Break")}>
            +
          </button>
        </div>
        <div className="flex-item">
          <span id="session-label">Session Length</span>
          <br />
          <button
            id="session-decrement"
            onClick={() => handleChange(-1, "Session")}
          >
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button
            id="session-increment"
            onClick={() => handleChange(1, "Session")}
          >
            +
          </button>
        </div>
      </div>
      <div>
        <span id="timer-label">{timerLabel}</span>
        <br />
        <span id="time-left">{formatTime(timeLeft)}</span>
        <br />
        <button id="start_stop" onClick={() => handlePauseToggle()}>
          Start/Stop
        </button>
        <button id="reset" onClick={() => handleReset()}>
          Reset
        </button>
      </div>
      <audio id="beep" ref={audioElement} src={beep}></audio>
      <div>
        #sessions = {totalSession}
      </div>
      <div>
        #breaks = {totalBreak}
      </div>
    </div>
  );
}

export default App;
