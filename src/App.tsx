import "./App.css";
import GamemodeCard from "./components/GamemodeCard";

function App() {
  return (
    <div className="grad flex-column" style={{}}>
      <div
        className="oswald-default text-shadow "
        style={{
          fontSize: "9rem",
          color: "white",
          display: "flex",
          flexDirection: "row",
          gap: "1%",
          margin: "auto",
          minWidth: "90%",
        }}
      >
        <div className="" style={{ margin: "auto" }}>
          <i className="material-symbols-outlined" style={{ fontSize: "18vh" }}>
            spa
          </i>
          ZEN TRIVIA
        </div>
      </div>
      <div
        className="flex-column"
        style={{
          alignItems: "center",
          gap: "1em",
          margin: "auto",
          marginTop: "5vh",
        }}
      >
        <div className="flex-row" style={{ gap: "1em", maxWidth: "75vw" }}>
          <GamemodeCard
            picture="person"
            title="Classic"
            description="an endless singleplayer experience"
            link="/SingleClient"
          />{" "}
          <div
            style={{
              borderRadius: "2vw",
              position: "relative",
              width: "fit-content",
            }}
          >
            <GamemodeCard
              picture="groups"
              title="Multiplayer"
              description="Play with your friends!"
              link="/multiplayer/game/Login"
            />{" "}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "5px",
          fontSize: "12px",
          color: "gray",
        }}
      >
        developed by Angelina Suy |{" "}
        <a href="https://github.com/ahjsuy/practice">github</a>
      </div>
    </div>
  );
}

export default App;
