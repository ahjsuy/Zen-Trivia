import Question from "../components/Question";
import AnswerList from "../components/AnswerList";
import "../App.css";
import { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Alert from "../components/Alert";
import { Link, Route, Routes } from "react-router-dom";
import TriviaSettings from "./TriviaSettings";

// todo: add points system, share ?, make correct answer show when the time is up,
// fix hover over color change, add music? choice to change the time
// fix the css omg

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
      {result && <Alert text={correct ? "Correct!" : "Incorrect!"}></Alert>}
      <div style={{ position: "fixed", top: "10vh" }}>
        <CountdownCircleTimer
          isPlaying={showSettings ? false : true}
          duration={15}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[15, 10, 5, 0]}
          size={200}
          onComplete={() => {
            setResult(true);
            setTimeout(() => {
              setNewQuestion(newQuestion + 1); // rerender newQuestion state so API fetch
              setResult(false); // stop showing if the selection is correct
            }, 3000);
            console.log("COMPLETED");
            return { shouldRepeat: true, delay: 3 };
          }}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </div>
      <div className="container">
        {problem[0].question.text != "string" && ( // parse the API json response to get the question
          <Question question={problem[0].question.text} /> // when the json is no longer the placeholder
        )}
      </div>
      <div className="container">
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
        className="btn btn-light"
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
