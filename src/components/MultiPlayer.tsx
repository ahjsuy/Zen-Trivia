import { useState, useEffect } from "react";
import ReactHowler from "react-howler";
import MusicButton from "./MusicButton";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import AnswerList from "./AnswerList";
import { useUser } from "../UserContext";
import { useSocket } from "../SocketContext";
import { triviaQuestion, categoriesList, difficultiesList } from "../types";

interface Props {
  timerDuration: number;
  queryURL: string;
  pointsToWin: number;
}

const MultiPlayer = ({ timerDuration, queryURL, pointsToWin }: Props) => {
  const [questionBank, setQuestionBank] = useState<triviaQuestion[]>([]);
  const [playMusic, setPlayMusic] = useState<number>(1);
  const [correctIsSelected, setCorrectIsSelected] = useState<boolean>(false);
  const [roundComplete, setRoundComplete] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);
  // const [timerDuration, setTimerDuration] = useState<number>(15);
  const [points, setPoints] = useState<number>(0);
  const { user } = useUser();
  const socket = useSocket();
  // let timerDuration: number = 15;
  // let points = 0;

  // let queryURL = "https://the-trivia-api.com/v2/questions?limit=10";

  useEffect(() => {
    if (questionBank.length < 3 && user.role == "leader") {
      socket?.emit("requestNew", {
        queryURL: queryURL,
        room: user.roomName,
      });
    }
  }, [questionBank]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("clientReady");
    console.log(user.roomName);
    socket.onAny((event, ...args) => {
      console.log(`🔔 Received event: ${event}`, args);
    });

    const handleResponseQuestion = (res: triviaQuestion[]) => {
      setQuestionBank((prev) => [...prev, ...res]);
      console.log("New questions fetched");
    };

    const handleTimerReset = (key: number) => {
      setTimerKey((prev) => prev + 1);
    };

    socket.on("responseQuestion", handleResponseQuestion);
    socket.on("timer", handleTimerReset);

    return () => {
      socket.off("responseQuestion", handleResponseQuestion);
    };
  }, [socket]);

  const handleScores = () => {
    if (correctIsSelected) {
      console.log(
        "updating points: ",
        points + 10,
        " compared to points to win ",
        pointsToWin
      );
      setPoints((prev) => prev + 10);
      socket?.emit("updatePoints", {
        room: user.roomName,
        username: user.username,
        points: points,
      });
      if (points + 10 >= pointsToWin) {
        socket?.emit("gameWon", {
          room: user.roomName,
          username: user.username,
        });
      }
    }
  };

  return (
    <div className="" style={{ height: "100%" }}>
      <ReactHowler
        src="/sounds/once-in-paris-168895.mp3"
        playing={playMusic != 0}
        volume={playMusic / 8}
        loop={true}
      />
      <div
        style={{ position: "relative", top: "0", left: "0", padding: "15px" }}
      >
        <MusicButton playMusic={playMusic} setPlayMusic={setPlayMusic} />
      </div>
      <div
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          padding: "15px",
          color: "white",
          fontSize: "1.5rem",
        }}
      ></div>
      <div className="container">
        <div
          className="oswald-default"
          style={{ fontSize: "3rem", color: "white" }}
        >
          <CountdownCircleTimer
            isPlaying={true}
            key={timerKey}
            duration={timerDuration}
            colors={["#004777", "#F7B801", "#FFA500", "#A30000"]}
            colorsTime={[
              timerDuration,
              timerDuration - timerDuration / 4,
              timerDuration / 2,
              0,
            ]}
            strokeWidth={20}
            trailStrokeWidth={19}
            onComplete={() => {
              setRoundComplete(true);
              handleScores();
              setTimeout(() => {
                setQuestionBank((prev) => prev.slice(1));
                setRoundComplete(false);
                setCorrectIsSelected(false);
                if (user.role === "leader")
                  socket?.emit("resetTimer", user.roomName);
              }, 2750);

              return { shouldRepeat: false, delay: 3 };
            }}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </div>
        <div
          className="oswald-default"
          style={{
            fontSize: "5rem",
            padding: "0.5rem",
            paddingTop: "3rem",
            paddingBottom: "3rem",
            textAlign: "center",
            color: "white",
          }}
        >
          {questionBank[0]?.question.text ?? ""}
        </div>
        <div className="roboto-slab-default">
          {" "}
          {questionBank[0] ? (
            <AnswerList
              key={JSON.stringify(questionBank[0])}
              choices={[
                questionBank[0]?.correctAnswer,
                ...questionBank[0]?.incorrectAnswers,
              ]}
              correctIsSelected={correctIsSelected}
              setCorrectIsSelected={setCorrectIsSelected}
              roundComplete={roundComplete}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MultiPlayer;
