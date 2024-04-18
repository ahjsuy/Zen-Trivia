import { Link, Route, Routes } from "react-router-dom";
import TriviaGame from "./pages/TriviaGame";
import TriviaSettings from "./pages/TriviaSettings";

function App() {
  return (
    <div>
      This is the home page.
      <Link to="/pages/TriviaGame">
        <button
          type="button"
          className="btn btn-light"
          style={{ position: "fixed", right: "5vh", bottom: "5vh" }}
        >
          Go to game page.
        </button>
      </Link>
      <Link to="/pages/TriviaSettings">
        <button
          type="button"
          className="btn btn-light"
          style={{ position: "fixed", right: "5vh", bottom: "5vh" }}
        >
          Change Quiz Settings
        </button>
      </Link>
      <Routes>
        <Route
          path="/pages/TriviaGame"
          element={<TriviaGame></TriviaGame>}
        ></Route>
        <Route
          path="/pages/TriviaSettings"
          element={<TriviaSettings></TriviaSettings>}
        />
      </Routes>
    </div>
  );
}

export default App;
