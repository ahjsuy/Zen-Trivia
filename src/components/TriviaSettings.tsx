import Checkbox from "../components/Checkbox";
import { useEffect, SetStateAction, Dispatch } from "react";
import { useSocket } from "../SocketContext";
import { useUser } from "../UserContext";

// helper function to save checked categories/difficulties per browser
// session

const saveToSessionStorage = (key: string, value: object) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

interface Props {
  categories: {
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
  };
  difficulties: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
  timerDuration: number;
  setCategories: Dispatch<
    SetStateAction<{
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
    }>
  >;
  setDifficulties: Dispatch<
    SetStateAction<{ easy: boolean; medium: boolean; hard: boolean }>
  >;
  setTimerDuration: (timerDuration: number) => void;
  setShowSettings: (showSettings: boolean) => void;
  pointsToWin?: number;
  setPointsToWin?: (pointsToWin: number) => void;
  roomCode?: string;
}

const TriviaSettings = ({
  categories,
  difficulties,
  setCategories,
  setDifficulties,
  timerDuration,
  setTimerDuration,
  setShowSettings,
  pointsToWin,
  setPointsToWin,
  roomCode,
}: Props) => {
  // everytime the categories/difficulties state is updated, save it to session

  const socket = useSocket();
  const { user, setUser } = useUser();

  useEffect(() => {
    saveToSessionStorage("categories", categories);
  }, [categories]);

  useEffect(() => {
    saveToSessionStorage("difficulties", difficulties);
  }, [difficulties]);

  useEffect(() => {
    saveToSessionStorage("timerDuration", { time: timerDuration });
  }, [timerDuration]);

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
    if (setPointsToWin) {
      const points = Number(event.target.value);
      if (points < 5) {
        setPointsToWin(5);
      } else if (points > 30) {
        setPointsToWin(30);
      } else {
        setPointsToWin(points);
      }
    }
  };

  const handleShowSettings = () => {
    if (pointsToWin) {
      socket?.emit("startGame", user.roomName, timerDuration);
    } else {
      setShowSettings(false);
    }
  };

  // render the categories/difficulties checkboxes
  return (
    <div className="settings flex-column" style={{ textAlign: "left" }}>
      {!pointsToWin && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row-reverse",
            position: "relative",
            top: "15px",
            right: "15px",
          }}
        >
          <button
            style={{ borderStyle: "hidden", backgroundColor: "white" }}
            onClick={handleShowSettings}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "gray", fontSize: "32px" }}
            >
              close
            </span>
          </button>
        </div>
      )}
      <div
        style={{
          maxWidth: "fitContent",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {roomCode && <h2>Room Code: {roomCode}</h2>}
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <div style={{ padding: "20px", paddingTop: "0px", width: "100%" }}>
            <h2>Categories</h2>

            {Object.entries(categories).map((item) => (
              <div>
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
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {item[0]
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </label>
              </div>
            ))}
          </div>
          {pointsToWin && (
            <div>
              <h2>Points to Win</h2>
              <input
                type="number"
                id="pointsToWinInput"
                className="form-control"
                min="10"
                max="300"
                placeholder="100"
                style={{ width: "75px" }}
                onChange={handlePointsToWin}
              />
              <div id="timerDurationInput" className="form-text">
                Please input a number between 10 - 300 points.
              </div>
            </div>
          )}
        </div>
        <div className="flex-column">
          <div style={{ padding: "20px", paddingTop: "0px", width: "100%" }}>
            <h2>Difficulties</h2>
            {Object.entries(difficulties).map((item) => (
              <div>
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
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {item[0].charAt(0).toUpperCase() + item[0].slice(1)}
                </label>
              </div>
            ))}
          </div>
          <div style={{ padding: "20px" }}>
            <h2>Timer Duration</h2>
            <input
              type="number"
              id="timerDurationInput"
              className="form-control"
              min="5"
              max="30"
              placeholder="15"
              style={{ width: "75px" }}
              onChange={handleTimerDuration}
            />
            <div id="timerDurationInput" className="form-text">
              Please input a number between 5 - 30 seconds.
            </div>
            {pointsToWin && (
              <div style={{ paddingTop: "20px" }}>
                <h2>Start the Game</h2>
                <button onClick={handleShowSettings}>GAME START</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriviaSettings;
