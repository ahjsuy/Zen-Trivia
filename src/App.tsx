import Question from "./components/Question";
import AnswerList from "./components/AnswerList";
import "./App.css";
import { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Alert from "./components/Alert";
import TriviaSettings from "./pages/TriviaSettings";
import TriviaGame from "./pages/TriviaGame";
import Body from "./components/Body";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  return (
    <div>
      <div className="navigation-menu">
        <ol>
          <li>
            <Link to={"/blog"}>Blogs</Link>
          </li>
          <li>
            <Link to={"/triviagame"}>TriviaGame</Link>
          </li>
          <li>
            <Link to={"/home"}>Home</Link>
          </li>
        </ol>
      </div>
      <h1> THIS IS PROOF OF RENDERING </h1>
    </div>
  );
}

export default App;
