import { useState, useEffect } from "react";
import { useSocket } from "../SocketContext";
import { useUser } from "../UserContext";
import { time } from "console";

interface Props {
  roomCode: string;
}

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

const TriviaSettingsMultiplayer = ({ roomCode }: Props) => {
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

  const [timerDuration, setTimerDuration] = useState<number>(15);
  const [pointsToWin, setPointsToWin] = useState<number>(100);
  const [start, setStart] = useState<boolean>(false);

  const socket = useSocket();
  const { user } = useUser();

  useEffect(() => {
    if (start) {
      let queryURL = "https://the-trivia-api.com/v2/questions?limit=10";
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
      console.log("starting game\n");
      socket?.emit("startGame", {
        room: user.roomName,
        url: queryURL,
        timer: timerDuration,
        points: pointsToWin,
      });
    }
  }, [start]);

  const handleTimerDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const duration = Number(event.target.value);
    if (duration < 5) {
      setTimerDuration(5);
    } else if (duration > 30) {
      setTimerDuration(30);
    } else {
      setTimerDuration(duration);
    }
  };

  const handlePointsToWin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const points = Number(event.target.value);
    if (points < 10) {
      setPointsToWin(10);
    } else if (points > 100) {
      setPointsToWin(100);
    } else {
      setPointsToWin(points);
    }
  };

  return (
    <div
      className="settings flex-column roboto-slab-default box-shadow"
      style={{
        margin: "auto",
        padding: "3rem",
        textAlign: "left",
        maxWidth: "60%",
        overflow: "auto",
      }}
    >
      <div style={{ margin: "auto" }}>
        <h1>Room Code: {roomCode}</h1>
      </div>
      <div className="flex-row" style={{}}>
        <div className="flex-column" style={{ minWidth: "40%" }}>
          <div style={{ padding: "1rem" }}>
            <h2 style={{}}>
              <b>Categories</b>
            </h2>
            {Object.entries(categories).map((item) => (
              <div className="flex-row" style={{}}>
                <div style={{ marginRight: ".5rem" }}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    onChange={() => {
                      setCategories((prev) => ({
                        ...prev,
                        [item[0]]: !item[1],
                      }));
                    }}
                    checked={item[1]}
                  />
                </div>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {item[0]
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </label>
              </div>
            ))}
          </div>
          <div style={{ padding: "1rem" }}>
            <h2>
              <b>Difficulties</b>
            </h2>
            {Object.entries(difficulties).map((item) => (
              <div className="flex-row">
                <div style={{ marginRight: "0.5rem" }}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    onChange={() => {
                      setDifficulties((prev) => ({
                        ...prev,
                        [item[0]]: !item[1],
                      }));
                    }}
                    checked={item[1]}
                  />
                </div>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {item[0].charAt(0).toUpperCase() + item[0].slice(1)}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-column">
          <div style={{ padding: "1rem" }}>
            <h2>Timer Duration</h2>
            <input
              type="number"
              id="timerDurationInput"
              className="form-control"
              min="5"
              max="30"
              placeholder="15"
              style={{ width: "15%" }}
              onChange={handleTimerDuration}
            />
            <div id="timerDurationInput" className="form-text">
              Please input a number between 5 - 30 seconds.
            </div>
          </div>
          <div style={{ padding: "1rem" }}>
            <h2>Points to Win</h2>
            <input
              type="number"
              id="pointsToWin"
              className="form-control"
              min="10"
              max="100"
              placeholder="100"
              style={{ width: "15%" }}
              onChange={handlePointsToWin}
            />
            <div id="pointsToWinInput" className="form-text">
              Please input a number between 10 - 100 points.
            </div>
          </div>
          <div
            style={{
              margin: "auto",
              placeItems: "center",
            }}
          >
            <button
              style={{
                margin: "0.5rem",
                padding: "1rem 1.25rem 1rem 1.25rem",
                backgroundColor: "rgb(0, 119, 182, 1)",
                color: "white",
                borderRadius: ".75rem",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
              onClick={() => {
                setStart(true);
              }}
            >
              {" "}
              START GAME
            </button>
            <div id="startButtonLabel" className="form-text">
              Please note that you will not be able to change these settings
              again until the game is over!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriviaSettingsMultiplayer;
