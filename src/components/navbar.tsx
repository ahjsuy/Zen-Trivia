import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import IconButton from "./IconButton";

const Navbar = () => {
  const { user } = useUser();
  const nav = useNavigate();
  return (
    <div
      className="flex-row"
      style={{
        width: "100%",
        height: "3.75rem",
        justifyContent: "space-between",
        backgroundColor: "rgb(255,255,255, .5)",
        padding: "0 3rem 0 3rem",
        boxSizing: "border-box",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
    >
      <button
        style={{ background: "none", border: "none" }}
        onClick={() => {
          nav("/");
        }}
      >
        <div
          className="flex-row center oswald-default"
          style={{ fontSize: "2rem" }}
        >
          <img src="/spa.png" style={{ width: "3rem", height: "3rem" }} />
          <div>Zen Trivia</div>
        </div>
      </button>
      <div className="flex-row center">
        <div>{user.username}</div>

        <div style={{ margin: "1rem" }}>
          {user.icon && (
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "2.5rem",
                backgroundColor: "white",
                borderStyle: "hidden",
                borderRadius: "2rem",
                padding: "0.35rem",
                height: "3.25rem",
                width: "3.25rem",
                margin: "auto",
                alignContent: "center",
              }}
            >
              {user.icon}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
