import Question from "../components/Question";
import AnswerList from "../components/AnswerList";
import "../App.css";
import { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Alert from "../components/Alert";
import { Link, Route, Routes } from "react-router-dom";
import TriviaSettings from "../pages/TriviaSettings";

function TriviaGame() {
  const [correct, setCorrect] = useState(false);
  const [result, setResult] = useState(false);
  const [newQuestion, setNewQuestion] = useState(0);
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

  const handleCorrect = (choice: boolean) => {
    setCorrect(choice);
  };

  useEffect(() => {
    const fetchProblem = async () => {
      console.log("IN RENDER");
      try {
        const response = await fetch(
          "https://the-trivia-api.com/v2/questions?limit=1"
        );
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
          isPlaying
          duration={15}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[15, 10, 5, 0]}
          size={100}
          onComplete={() => {
            setResult(true);
            setTimeout(() => {
              setNewQuestion(newQuestion + 1);
              setResult(false);
            }, 3000);
            console.log("COMPLETED");
            return { shouldRepeat: true, delay: 3 };
          }}
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
      </div>
      <div className="container">
        {problem[0].question.text != "string" && (
          <Question question={problem[0].question.text} />
        )}
      </div>
      <div className="container">
        {problem != prev &&
          problem[0].correctAnswer &&
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
      </div>
      <Link to="/pages/TriviaSettings">
        <button
          type="button"
          className="btn btn-light"
          style={{ position: "fixed", right: "5vh", bottom: "5vh" }}
        >
          Change Quiz Settings
        </button>
      </Link>
    </div>
  );
}

export default TriviaGame;
