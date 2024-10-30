import { Link, Route, Routes } from "react-router-dom";
import TriviaGame from "./TriviaGame";
import TriviaSettings from "./TriviaSettings";
import Home from "../pages/Home";

function Body() {
  return (
    <div>
      {/* <Routes>
        <Route path="/" Component={Home}></Route>
        <Route path="/pages/TriviaGame" Component={TriviaGame}></Route>
        <Route path="/pages/TriviaSettings" Component={TriviaSettings}></Route>
      </Routes> */}
    </div>
  );
}

export default Body;
