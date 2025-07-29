import { useEffect, useState, useRef } from "react";
import Chat from "../../../components/Chat";
import Leaderboard from "../../../components/Leaderboard";
import Navbar from "../../../components/navbar";
import { useUser } from "../../../UserContext";
import { useSocket } from "../../../SocketContext";
import MultiPlayer from "../../../components/MultiPlayer";
import TriviaSettingsMultiplayer from "../../../components/TriviaSettingsMultiplayer";

function Client() {
  const isFirstRender = useRef(true);
  const socket = useSocket();

  const { user, setUser } = useUser();
  const [showSettings, setShowSettings] = useState(true);
  const [showWinner, setShowWinner] = useState<string>("");
  const [timerDuration, setTimerDuration] = useState<number>(15);
  const [pointsToWin, setPointsToWin] = useState<number>(100);

  const [queryURL, setQueryUrl] = useState<string>(
    "https://the-trivia-api.com/v2/questions?limit=10"
  );

  useEffect(() => {
    if (!socket) return;
    const handleGameStart = ({
      timer,
      points,
      url,
    }: {
      timer: number;
      points: number;
      url: string;
    }) => {
      console.log("starting game with: ", timer, " + ", points, " + ", url);
      setShowSettings(false);
      setPointsToWin(points);
      setTimerDuration(timer);
      setQueryUrl(url);
    };
    const handleGameOver = (username: string) => {
      console.log(username + " won!");
      setShowWinner(username);
    };

    const handleRoleChange = ({ socketID }: { socketID: string }) => {
      if (socketID == socket.id) {
        setUser((prev) => ({ ...prev, role: "leader" }));
        console.log("I am now leader");
      } else {
        console.log(
          "someone else was chosen as leader ",
          socket.id,
          " vs ",
          socketID
        );
      }
    };

    socket.on("gameStart", handleGameStart);
    socket.on("gameOver", handleGameOver);
    socket.on("newLeader", handleRoleChange);

    return () => {
      socket.off("gameStart", handleGameStart);
      socket.off("gameOver", handleGameOver);
      socket.off("newLeader", handleRoleChange);
    };
  }, [socket]);

  return (
    <div className="grad flex-column">
      <Navbar />
      <div className="flex-row" style={{ flex: 1 }}>
        <div style={{ flex: 5, alignContent: "center" }}>
          {showSettings && user.role === "leader" && (
            <TriviaSettingsMultiplayer roomCode={user.roomName} />
          )}
          {showSettings && user.role !== "leader" && (
            <div
              className="settings flex-column roboto-slab-default box-shadow"
              style={{
                margin: "auto",
                padding: "3rem",
                textAlign: "center",
                maxWidth: "40%",
              }}
            >
              <h2>Waiting for room leader to start the game!</h2>
            </div>
          )}
          {!showSettings && showWinner === "" && (
            <MultiPlayer
              timerDuration={timerDuration}
              queryURL={queryURL}
              pointsToWin={pointsToWin}
            />
          )}
          {showWinner !== "" && (
            <div
              className="settings flex-column roboto-slab-default box-shadow"
              style={{
                margin: "auto",
                padding: "3rem",
                textAlign: "center",
                maxWidth: "40%",
              }}
            >
              <h1>GAME OVER</h1>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "13rem", color: "gold" }}
              >
                trophy
              </span>
              <h2>{showWinner} won!</h2>

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
                  setShowSettings(true);
                  setShowWinner("");
                  socket?.emit("getUsersInRoom", user.roomName);
                }}
              >
                Play again?
              </button>
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Chat user={user} showSettings={false} />
        </div>
      </div>
    </div>
  );
}

export default Client;
