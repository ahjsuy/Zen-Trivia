import Question from "./components/Question";
import AnswerList from "./components/AnswerList";
import "./App.css";
import { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Alert from "./components/Alert";
import TriviaGame from "./components/TriviaGame";
import Body from "./components/Body";
import { Link } from "react-router-dom";
import GamemodeCard from "./components/GamemodeCard";

function App() {
  return (
    <div className="grad" style={{ gap: "15vh" }}>
      <div
        className="container oswald-default"
        style={{
          fontSize: "15vh",
          color: "white",
          display: "flex",
          flexDirection: "row",
          gap: "1%",
        }}
      >
        <i className="material-symbols-outlined" style={{ fontSize: "18vh" }}>
          spa
        </i>
        ZEN TRIVIA
      </div>
      <div
        className="flex-column"
        style={{
          alignItems: "center",
          gap: "1em",
        }}
      >
        <div className="flex-row" style={{ gap: "1em", maxWidth: "75vh" }}>
          <GamemodeCard
            picture="person"
            title="Classic"
            description="an endless singleplayer experience"
            link="/SingleClient"
          />{" "}
          <GamemodeCard
            picture="groups"
            title="Coming Soon"
            description="compete against your friends"
            link="/multiplayer/game/Client"
          />{" "}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "5px",
          fontSize: "12px",
          color: "gray",
        }}
      >
        developed by Angelina Suy |{" "}
        <a href="https://github.com/ahjsuy/practice">github</a>
      </div>
    </div>
  );
}

export default App;
