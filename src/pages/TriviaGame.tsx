import Question from "../components/Question";
import AnswerList from "../components/AnswerList";
import MusicButton from "../components/MusicButton";
import "../App.css";
import { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Link, Route, Routes } from "react-router-dom";
import TriviaSettings from "./TriviaSettings";
import ReactHowler from "react-howler";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaJVvLOoBIaASs2_YviKvSuGY0CeR5RR8",
  authDomain: "trivia-game-zen.firebaseapp.com",
  projectId: "trivia-game-zen",
  storageBucket: "trivia-game-zen.appspot.com",
  messagingSenderId: "1073472332976",
  appId: "1:1073472332976:web:87e00145e323f5ebdf4775",
  measurementId: "G-19YJEC7808",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// helper function to load checked categories/difficulties per browser
// session

const loadFromSessionStorage = (key: string, defaultValue: object) => {
  const storedValues = sessionStorage.getItem(key);
  if (storedValues) {
    return JSON.parse(storedValues);
  }
  return defaultValue;
};

function App() {
  const [correct, setCorrect] = useState(false);
  const [result, setResult] = useState(false);
  const [newQuestion, setNewQuestion] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [timerDuration, setTimerDuration] = useState(15);
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

  const [problem, setProblem] = useState([
    // default placeholder problem for
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

  const handleCorrect = (choice: boolean) => {
    setCorrect(choice);
  };

  useEffect(() => {
    // fetch a new problem from the API
    const fetchProblem = async () => {
      // everytime the newQuestion state is updated
      console.log("IN RENDER");

      try {
        let chosenCategories = Object.keys(categories)
          .filter((key) => categories[key])
          .join(",");
        let chosenDifficulties = Object.keys(difficulties)
          .filter((key) => difficulties[key])
          .join(",");
        console.log(chosenCategories);
        console.log(chosenDifficulties);
        let queryURL = "https://the-trivia-api.com/v2/questions?limit=1";
        if (chosenDifficulties) {
          queryURL += "&difficulties=" + chosenDifficulties;
        }
        if (chosenCategories) {
          queryURL += "&categories=" + chosenCategories;
        }
        const response = await fetch(queryURL);
        console.log(response);
        const triviaResponse = await response.json();
        setPrev(problem);
        setProblem(triviaResponse);
        console.log(triviaResponse);
        console.log(problem);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
    setCorrect(false);
  }, [newQuestion]);

  return (
    <div className="page">
      <ReactHowler
        src="sounds\once-in-paris-168895.mp3"
        playing={playMusic != 0}
        volume={playMusic / 8}
        loop={true}
      />
      <div style={{ position: "fixed", top: "0", left: "0", padding: "15px" }}>
        <MusicButton playMusic={playMusic} setPlayMusic={setPlayMusic} />
      </div>
      <div className="container oswald-default">
        <div style={{ top: "10vh", color: "white", fontSize: "25px" }}>
          {problem[0].question.text != "" && (
            <CountdownCircleTimer
              key={key}
              isPlaying={showSettings ? false : true}
              duration={timerDuration}
              colors={["#004777", "#F7B801", "#FFA500", "#A30000"]}
              colorsTime={[
                timerDuration,
                timerDuration - timerDuration / 4,
                timerDuration / 2,
                0,
              ]}
              size={200}
              strokeWidth={20}
              trailStrokeWidth={19}
              onComplete={() => {
                setResult(true);
                setTimeout(() => {
                  setNewQuestion(newQuestion + 1); // rerender newQuestion state so API fetch
                  setResult(false); // stop showing if the selection is correct
                  setKey((prev) => prev + 1);
                }, 3000);
                console.log("COMPLETED");
                return { shouldRepeat: true, delay: 3 };
              }}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>
          )}
        </div>
      </div>
      <div className="container oswald-default" style={{ color: "white" }}>
        {problem[0].question.text != "" && ( // parse the API json response to get the question
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
        {showSettings && (
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex", // Use flexbox
              justifyContent: "center", // Center horizontally
              alignItems: "center", // Center vertically
            }}
          >
            <div className="overlay">
              <TriviaSettings
                categories={categories}
                difficulties={difficulties}
                timerDuration={timerDuration}
                setCategories={setCategories}
                setDifficulties={setDifficulties}
                setTimerDuration={setTimerDuration}
              />
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        className="btn btn-light roboto-slab-default"
        style={{ position: "fixed", right: "5vh", bottom: "5vh" }}
        onClick={() => {
          setShowSettings(!showSettings);
        }}
      >
        Change Quiz Settings
      </button>
    </div>
  );
}

export default App;
