import { useState, useEffect } from "react";
import ReactHowler from "react-howler";
import MusicButton from "./MusicButton";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import AnswerList from "./AnswerList";
import TriviaSettingsSinglePlayer from "./TriviaSettingsSinglePlayer";
import Navbar from "./navbar";

interface triviaQuestion {
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
}

interface categoriesList {
  music: boolean;
  sports_and_leisure: boolean;
  film_and_tv: boolean;
  arts_and_literature: boolean;
  history: boolean;
  society_and_culture: boolean;
  science: boolean;
  geography: boolean;
  food_and_drink: boolean;
  general_knowledge: boolean;
}

interface difficultiesList {
  easy: boolean;
  medium: boolean;
  hard: boolean;
}

const SinglePlayer = () => {
  const [questionBank, setQuestionBank] = useState<triviaQuestion[]>([]);
  const [categories, setCategories] = useState<categoriesList>({
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
  });
  const [difficulties, setDifficulties] = useState<difficultiesList>({
    easy: true,
    medium: true,
    hard: true,
  });
  const [playMusic, setPlayMusic] = useState<number>(1);
  const [timerDuration, setTimerDuration] = useState<number>(15);
  const [correctIsSelected, setCorrectIsSelected] = useState<boolean>(false);
  const [roundComplete, setRoundComplete] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showPoints, setShowPoints] = useState<number[]>([0, 0]);

  let queryURL = "https://the-trivia-api.com/v2/questions?limit=10";

  const fetchProblem = async (queryURL: string, refresh = false) => {
    try {
      const newProblemsRes = await fetch(queryURL);
      if (newProblemsRes.status == 200) {
        const newProblemsJSON =
          (await newProblemsRes.json()) as triviaQuestion[];
        console.log(queryURL + " fetched new problems: ", newProblemsJSON);
        if (refresh) {
          console.log("Refreshed question bank with new settings");
          setQuestionBank((prev) => [prev[0], ...newProblemsJSON]);
        } else {
          setQuestionBank((prev) => [...prev, ...newProblemsJSON]);
        }
      } else {
        throw new Error(`${newProblemsRes.status}`);
      }
    } catch (e) {
      console.log("Error fetching new questions: ", e);
    }
  };

  // on start up, request 10 questions
  useEffect(() => {
    fetchProblem(queryURL);
  }, []);

  // when the question bank runs on its last two questions, request more
  useEffect(() => {
    if (questionBank.length <= 2) {
      fetchProblem(queryURL);
    }
  }, [questionBank]);

  // refresh the question bank when difficulties/categories change
  useEffect(() => {
    let diff: triviaQuestion[] = questionBank.filter((item) => {
      if (
        categories[item.category as keyof categoriesList] &&
        difficulties[item.difficulty as keyof difficultiesList]
      ) {
        return false;
      } else {
        return true;
      }
    });
    console.log("Questions that do not fit current settings: ", diff);
    if (!showSettings && diff.length != 0) {
      queryURL = "https://the-trivia-api.com/v2/questions?limit=10";

      const categoryUrl: string[] = [];
      for (const [key, value] of Object.entries(categories)) {
        if (value) categoryUrl.push(key);
      }
      if (categoryUrl.length != 0) {
        queryURL += "&categories=";
        queryURL += categoryUrl.join(",");
      }
      const difficultiesUrl: string[] = [];
      for (const [key, value] of Object.entries(difficulties)) {
        if (value) difficultiesUrl.push(key);
      }
      if (difficultiesUrl.length != 0) {
        queryURL += "&difficulties=";
        queryURL += difficultiesUrl.join(",");
      }

      fetchProblem(queryURL, true);
    }
  }, [showSettings]);

  return (
    <div className="grad flex-column" style={{ position: "relative" }}>
      <Navbar />
      <ReactHowler
        src="/sounds/once-in-paris-168895.mp3"
        playing={playMusic != 0}
        volume={playMusic / 8}
        loop={true}
      />
      <div
        style={{ position: "fixed", top: "3.5rem", left: "0", padding: "15px" }}
      >
        <MusicButton playMusic={playMusic} setPlayMusic={setPlayMusic} />
      </div>
      <div
        style={{
          position: "fixed",
          top: "3.5rem",
          right: "0",
          padding: "15px",
          color: "white",
          fontSize: "1.5rem",
        }}
      >
        <div> {`${showPoints[0]} / ${showPoints[1]} correct`}</div>
      </div>
      <div className="container">
        <div
          className="oswald-default"
          style={{ fontSize: "3rem", color: "white", margin: "0" }}
        >
          <CountdownCircleTimer
            key={timerDuration}
            isPlaying={!showSettings}
            duration={timerDuration}
            colors={["#004777", "#F7B801", "#FFA500", "#A30000"]}
            colorsTime={[
              timerDuration,
              timerDuration - timerDuration / 4,
              timerDuration / 2,
              0,
            ]}
            size={150}
            strokeWidth={18}
            trailStrokeWidth={18}
            onComplete={() => {
              setRoundComplete(true);

              setTimeout(() => {
                setQuestionBank((prev) => prev.slice(1));
                setShowPoints((prev) => [
                  correctIsSelected ? prev[0] + 1 : prev[0],
                  prev[1] + 1,
                ]);
                setRoundComplete(false);
                setCorrectIsSelected(false);
              }, 2750);

              return { shouldRepeat: true, delay: 3 };
            }}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </div>
        <div
          className="oswald-default"
          style={{
            fontSize: "2.5rem",
            padding: "0.5rem",
            textAlign: "center",
            color: "white",
            margin: "8vh",
            maxHeight: "10vh",
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

        {showSettings && (
          <div
            style={{
              position: "absolute",

              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: "998",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TriviaSettingsSinglePlayer
              categories={categories}
              difficulties={difficulties}
              timerDuration={timerDuration}
              setCategories={setCategories}
              setDifficulties={setDifficulties}
              setShowSettings={setShowSettings}
              setTimerDuration={setTimerDuration}
            />
          </div>
        )}

        <button
          style={{ margin: "2rem" }}
          type="button"
          className="btn btn-light roboto-slab-default box-shadow"
          onClick={() => {
            setShowSettings(!showSettings);
          }}
        >
          Change Quiz Settings
        </button>
      </div>
    </div>
  );
};

export default SinglePlayer;
