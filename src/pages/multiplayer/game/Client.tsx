import { useEffect, useState, useRef } from "react";
import Chat from "../../../components/Chat";
import TriviaGame from "../../../components/TriviaGame";
import TriviaSettings from "../../../components/TriviaSettings";
import Leaderboard from "../../../components/Leaderboard";
import { useUser } from "../../../UserContext";
import { useSocket } from "../../../SocketContext";

function Client() {
  const isFirstRender = useRef(true);
  const socket = useSocket();
  const { user, setUser } = useUser();
  const [points, setPoints] = useState(0);
  const [gameSetUp, setGameSetUp] = useState(true);
  const [gameWon, setGameWon] = useState("");
  const [timerDuration, setTimerDuration] = useState(15);
  const [pointsToWin, setPointsToWin] = useState(100);
  const [categories, setCategories] = useState({
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

  const [difficulties, setDifficulties] = useState({
    easy: true,
    medium: true,
    hard: true,
  });

  useEffect(() => {
    socket?.emit(
      "updatePoints",
      user.roomName,
      user.username,
      points,
      pointsToWin
    );
  }, [points]);

  useEffect(() => {
    socket?.on("gameStart", (time) => {
      if (gameSetUp) {
        setGameSetUp(false);
      }
      setTimerDuration(time);
    });
    socket?.on("gameWon", (username) => {
      setGameSetUp(true);
      setGameWon(username);
    });
  }, [socket]);

  return (
    <div className="grad flex-row">
      <div>
        {gameWon && (
          <div
            style={{
              display: "flex",
              position: "absolute",
              background: "white",
              minHeight: "100%",
              minWidth: "100%",
              zIndex: "999",
            }}
          >
            {" "}
            <h1>the game was won by {gameWon}</h1>
          </div>
        )}
      </div>
      <div style={{ flexGrow: "1" }}>
        {user.role === "leader" &&
          (gameSetUp ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                top: "20%",
              }}
            >
              <TriviaSettings
                categories={categories}
                difficulties={difficulties}
                timerDuration={timerDuration}
                setCategories={setCategories}
                setDifficulties={setDifficulties}
                setTimerDuration={setTimerDuration}
                setShowSettings={setGameSetUp}
                pointsToWin={pointsToWin}
                setPointsToWin={setPointsToWin}
                roomCode={user.roomName}
              />
            </div>
          ) : (
            <TriviaGame
              socket={socket}
              room={user.roomName}
              multiplayer={true}
              points={points}
              setPoints={setPoints}
              timeSet={timerDuration}
            />
          ))}
        {user.role === "player" &&
          (gameSetUp ? (
            <div>
              <h1>Waiting for the leader to start the game</h1>
            </div>
          ) : (
            <div>
              <TriviaGame
                socket={socket}
                room={user.roomName}
                multiplayer={true}
                points={points}
                setPoints={setPoints}
                timeSet={timerDuration}
              />
            </div>
          ))}
      </div>
      <div className="flex-column">
        <div>
          <Leaderboard />
        </div>
        <Chat user={user} />
      </div>
    </div>
  );
}

export default Client;
