import Question from "./Question";
import AnswerList from "./AnswerList";
import MusicButton from "./MusicButton";
import "../App.css";
import { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import TriviaSettings from "./TriviaSettings";
import ReactHowler from "react-howler";
import { Socket } from "socket.io-client";
import { useUser } from "../UserContext";

// helper function to load checked categories/difficulties per browser
// session

interface Props {
  socket: Socket | null;
  room: string;
  multiplayer: boolean;
  points?: number;
  setPoints?: (points: number | ((prev: number) => number)) => void;
  timeSet?: number;
}

const loadFromSessionStorage = (key: string, defaultValue: object) => {
  const storedValues = sessionStorage.getItem(key);
  if (storedValues) {
    return JSON.parse(storedValues);
  }
  return defaultValue;
};

type Problem = {
  category: string;
  id: string;
  tags: string[];
  difficulty: string;
  regions: string[];
  isNiche: boolean;
  question: {
    text: string;
  };
  correctAnswer: string;
  incorrectAnswers: string[];
  type: string;
};

const TriviaGame = ({
  socket,
  room,
  multiplayer,
  points,
  setPoints,
  timeSet,
}: Props) => {
  const [correct, setCorrect] = useState(false);
  const [result, setResult] = useState(false);
  const [newQuestion, setNewQuestion] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [timerDuration, setTimerDuration] = useState(
    () =>
      // categories state
      loadFromSessionStorage("timerDuration", { time: 15 }).time
  );
  const [playMusic, setPlayMusic] = useState(1);
  const [key, setKey] = useState(0);
  const [prev, setPrev] = useState([
    {
      category: "music",
      id: "5f9f1b9b0e1b9c0017a5f1a5",
      tags: ["string"],
      difficulty: "easy",
      regions: ["string"],
      isNiche: true,
      question: { text: "string" },
      correctAnswer: "PLACEHOLDER",
      incorrectAnswers: ["-1", "-1"],
      type: "text_choice",
    },
  ]);

  const [problem, setProblem] = useState<Problem[]>([
    {
      // initial render
      category: "",
      id: "",
      tags: [""],
      difficulty: "",
      regions: [""],
      isNiche: true,
      question: { text: "" },
      correctAnswer: "",
      incorrectAnswers: ["", "", "", ""],
      type: "",
    },
  ]);

  const [categories, setCategories] = useState(() =>
    // categories state
    loadFromSessionStorage("categories", {
      music: true,
      sports_and_leisure: true,
      film_and_tv: true,
      arts_and_literature: true,
      history: true,
      society_and_culture: true,
      science: true,
      geography: true,
      food_and_drink: true,
      general_knowledge: true,
    })
  );

  const [difficulties, setDifficulties] = useState(() =>
    // difficulties state
    loadFromSessionStorage("difficulties", {
      easy: true,
      medium: true,
      hard: true,
    })
  );

  const { user, setUser } = useUser();

  const handleCorrect = (choice: boolean) => {
    setCorrect(choice);
  };

  useEffect(() => {
    if (user.role === "leader" || !multiplayer) {
      // fetch a new problem from the API
      const fetchProblem = async () => {
        // everytime the newQuestion state is updated

        let chosenCategories = Object.keys(categories)
          .filter((key) => categories[key])
          .join(",");
        let chosenDifficulties = Object.keys(difficulties)
          .filter((key) => difficulties[key])
          .join(",");
        let queryURL = "https://the-trivia-api.com/v2/questions?limit=1";
        if (chosenDifficulties) {
          queryURL += "&difficulties=" + chosenDifficulties;
        }
        if (chosenCategories) {
          queryURL += "&categories=" + chosenCategories;
        }

        if (socket) {
          socket.emit("requestNew", queryURL, room);
        }
        console.log("requesting new for ", room);
      };

      fetchProblem();
      setCorrect(false);
    }
  }, [newQuestion, room]);

  useEffect(() => {
    if (socket) {
      const handleMessage = (res: Problem[]) => {
        setProblem(res);
      };

      socket.on("responseQuestion", handleMessage);

      return () => {
        socket.off("responseQuestion", handleMessage);
      };
    }
  }, [socket]);

  return (
    <div
      className="grad"
      style={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <ReactHowler
        src="../../../public/sounds/once-in-paris-168895.mp3"
        playing={playMusic != 0}
        volume={playMusic / 8}
        loop={true}
      />
      <div style={{ position: "fixed", top: "0", left: "0", padding: "15px" }}>
        <MusicButton playMusic={playMusic} setPlayMusic={setPlayMusic} />
      </div>
      <div className="container oswald-default">
        <div style={{ top: "10vh", color: "white", fontSize: "25px" }}>
          {problem[0] &&
            problem[0].question &&
            problem[0].question.text != "" && (
              <CountdownCircleTimer
                key={key}
                isPlaying={showSettings ? false : true}
                duration={timeSet ? timeSet : timerDuration} // FIX
                colors={["#004777", "#F7B801", "#FFA500", "#A30000"]}
                colorsTime={
                  timeSet
                    ? [timeSet, timeSet - timeSet / 4, timeSet / 2]
                    : [
                        timerDuration,
                        timerDuration - timerDuration / 4,
                        timerDuration / 2,
                        0,
                      ]
                }
                size={200}
                strokeWidth={20}
                trailStrokeWidth={19}
                onComplete={() => {
                  if (setPoints) {
                    setPoints((prev) => prev + 10 * Number(correct));
                  }
                  setResult(true);
                  setTimeout(() => {
                    setNewQuestion(newQuestion + 1); // rerender newQuestion state so API fetch
                    setResult(false); // stop showing if the selection is correct
                    setKey((prev) => prev + 1);
                  }, 3000);
                  return { shouldRepeat: true, delay: 3 };
                }}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            )}
        </div>
      </div>
      <div className="container oswald-default" style={{ color: "white" }}>
        {problem[0] &&
          problem[0].question &&
          problem[0].question.text != "" && ( // parse the API json response to get the question
            <Question question={problem[0].question.text} /> // when the json is no longer the placeholder
          )}
      </div>
      <div className="container roboto-slab-default">
        {problem != prev && // when the json renders, pass the props to answer
          problem[0].correctAnswer && // list component
          problem[0].incorrectAnswers && (
            <AnswerList
              newQuestion={newQuestion}
              correct={problem[0].correctAnswer}
              answers={[
                problem[0].correctAnswer,
                ...problem[0].incorrectAnswers,
              ].sort(() => (problem[0].question.text.length % 5) / 5 - 0.5)}
              result={result}
              onSelect={handleCorrect}
            ></AnswerList>
          )}
        {!multiplayer && showSettings && (
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: "998",
              display: "flex", // Use flexbox
              justifyContent: "center", // Center horizontally
              alignItems: "center", // Center vertically
            }}
          >
            <TriviaSettings
              categories={categories}
              difficulties={difficulties}
              timerDuration={timerDuration}
              setCategories={setCategories}
              setDifficulties={setDifficulties}
              setTimerDuration={setTimerDuration}
              setShowSettings={setShowSettings}
            />
          </div>
        )}
      </div>
      {!multiplayer && (
        <button
          type="button"
          className="btn btn-light roboto-slab-default"
          onClick={() => {
            setShowSettings(!showSettings);
          }}
        >
          Change Quiz Settings
        </button>
      )}
    </div>
  );
};

export default TriviaGame;
