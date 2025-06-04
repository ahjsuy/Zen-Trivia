import "./App.css";
import GamemodeCard from "./components/GamemodeCard";

function App() {
  return (
    <div className="grad flex-column" style={{ gap: "15vh" }}>
      <div
        className="container oswald-default text-shadow "
        style={{
          fontSize: "15vh",
          color: "white",
          display: "flex",
          flexDirection: "row",
          gap: "1%",
        }}
      >
        <i className="material-symbols-outlined" style={{ fontSize: "18vh" }}>
          spa
        </i>
        ZEN TRIVIA
      </div>
      <div
        className="flex-column"
        style={{
          alignItems: "center",
          gap: "1em",
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
              description="Under revision. Come back soon!"
              link="/multiplayer/game/Login"
            />{" "}
            {/* <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(128, 128, 128, 0.7)", // semi-transparent gray
                zIndex: 2,
                borderRadius: "2vw",
              }}
            /> */}
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
