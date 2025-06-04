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

  // useEffect(() => {
  //   socket?.emit(
  //     "updatePoints",
  //     user.roomName,
  //     user.username,
  //     points,
  //     pointsToWin
  //   );
  // }, [points]);

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
      setShowSettings(false);
      setPointsToWin(points);
      setTimerDuration(timer);
      setQueryUrl(url);
    };
    const handleGameOver = (username: string) => {
      console.log(username + " won!");
      setShowWinner(username);
    };

    socket.on("gameStart", handleGameStart);
    socket.on("gameOver", handleGameOver);

    return () => {
      socket.off("gameStart", handleGameStart);
      socket.off("gameOver", handleGameOver);
    };

    // socket?.on("gameStart", () => {
    //   setShowSettings(false);
    // });
    // socket?.on("gameWon", (username) => {
    //   setShowWinner(username);
    // });
  }, [socket]);

  return (
    <div className="grad flex-column">
      <Navbar />
      <div className="flex-row" style={{ flex: 1, overflow: "auto" }}>
        <div style={{ flex: 5, alignContent: "center" }}>
          {showSettings && user.role === "leader" && (
            <TriviaSettingsMultiplayer roomCode={user.roomName} />
          )}
          {showSettings && user.role !== "leader" && (
            <div>Waiting for room leader to start game</div>
          )}
          {!showSettings && showWinner === "" && (
            <MultiPlayer
              timerDuration={timerDuration}
              queryURL={queryURL}
              pointsToWin={pointsToWin}
            />
          )}
          {showWinner !== "" && (
            <div style={{ height: "100%" }}>
              <h1>TEST</h1>
              <h1>{showWinner} won the game!</h1>
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Chat user={user} />
        </div>
      </div>
    </div>
  );
}

export default Client;

// const Client = () => {};
// export default Client;
