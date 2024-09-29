import Question from "./components/Question";
import AnswerList from "./components/AnswerList";
import "./App.css";
import { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Alert from "./components/Alert";
import { Link, Route, Routes } from "react-router-dom";
import TriviaSettings from "./pages/TriviaSettings";
import TriviaGame from "./pages/TriviaGame";
// import Body from "./components/Body";

function App() {
  return (
    <div className="page">
      <TriviaGame />
    </div>
  );
}

export default App;
