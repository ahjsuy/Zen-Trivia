import { useState, useEffect, useRef } from "react";
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
  const [points, setPoints] = useState<number>(10);
  const [test, setTest] = useState<boolean>(false);
  const { user } = useUser();
  const socket = useSocket();
  const [remainingTime, setRemainingTime] = useState<number>(timerDuration);
  const correctIsSelectedRef = useRef(correctIsSelected);
  const pointsRef = useRef(points);

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
    correctIsSelectedRef.current = correctIsSelected;
  }, [correctIsSelected]);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    if (!socket) return;

    const handleResponseQuestion = (res: triviaQuestion[]) => {
      setQuestionBank((prev) => [...prev, ...res]);
      console.log("New questions fetched");
    };

    const handleRoundStart = () => {
      console.log("round started");
      setQuestionBank((prev) => prev.slice(1));
      setRoundComplete(false);
      setCorrectIsSelected(false);
      setTest(true);
    };

    const handleRoundEnd = () => {
      setRoundComplete(true);
      handleScores();
      setTest(false);
    };

    const handleTimerTick = (time: number) => {
      setRemainingTime(time);
      // console.log("Timer Tick ", time);
    };

    socket.on("responseQuestion", handleResponseQuestion);
    socket.on("timerTick", handleTimerTick);
    socket.on("timerStart", handleRoundStart);
    socket.on("timerEnd", handleRoundEnd);

    return () => {
      socket.off("responseQuestion", handleResponseQuestion);
      socket.off("timerTick", handleTimerTick);
      socket.off("timerStart", handleRoundStart);
      socket.off("timerEnd", handleRoundEnd);
    };
  }, [socket]);

  const handleScores = () => {
    console.log("handlescores activated " + correctIsSelectedRef.current);
    if (correctIsSelectedRef.current) {
      setPoints((prev) => prev + 10);
      console.log(
        "updating points: ",
        pointsRef.current,
        " compared to points to win ",
        pointsToWin
      );

      socket?.emit("updatePoints", {
        room: user.roomName,
        username: user.username,
        points: pointsRef.current,
        pointsToWin: pointsToWin,
      });
    }
  };

  return (
    <div
      className=""
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{ position: "absolute", top: "0", left: "0", padding: "15px" }}
      >
        <ReactHowler
          src="/sounds/once-in-paris-168895.mp3"
          playing={playMusic != 0}
          volume={playMusic / 8}
          loop={true}
        />
        <MusicButton playMusic={playMusic} setPlayMusic={setPlayMusic} />
      </div>

      <div className="container">
        <div
          className="oswald-default"
          style={{ fontSize: "3rem", color: "white" }}
        >
          {remainingTime}
        </div>
        <div
          className="oswald-default"
          style={{
            fontSize: "2.5rem",
            padding: "0.5rem",
            paddingTop: "2rem",
            paddingBottom: "3rem",
            textAlign: "center",
            color: "white",
            minHeight: "8rem",
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
