import { useEffect, useState, useRef, ReactEventHandler } from "react";
import IconButton from "../../../components/IconButton";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../SocketContext";
import { useUser } from "../../../UserContext";
import Alert from "../../../components/Alert";
import Navbar from "../../../components/navbar";
const saveToSessionStorage = (key: string, value: object) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const Login = () => {
  const socket = useSocket();
  const { user, setUser } = useUser();
  const [username, setUsername] = useState<string>(user.username ?? "");
  const [selectedIcon, setSelectedIcon] = useState<string>(user.icon ?? "");
  const [roomName, setRoomName] = useState<string>(user.roomName);
  const [alertStatus, setAlertStatus] = useState<boolean>(false);
  const [missingUsername, setMissingUsername] = useState<boolean>(false);
  const [missingRoomName, setMissingRoomName] = useState<boolean>(false);
  const [missingIcon, setMissingIcon] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    setUser((prev) => ({ ...prev, username: username }));
  }, [username]);

  useEffect(() => {
    setUser((prev) => ({ ...prev, icon: selectedIcon }));
  }, [selectedIcon]);

  useEffect(() => {
    setUser((prev) => ({ ...prev, roomName: roomName }));
    if (roomName) {
      navigate(`/multiplayer/game/Client/${roomName}`);
    }
  }, [roomName]);

  useEffect(() => {
    if (!socket) return;

    const handleCurrentRoom = (roomName: string) => {
      if (roomName != "invalid") {
        setRoomName(roomName);
      } else {
        setMissingRoomName(true);
      }
    };

    socket.on("currentRoom", handleCurrentRoom);

    return () => {
      socket.off("currentRoom", handleCurrentRoom);
    };
  }, [socket]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleCreateRoom = (e: React.FormEvent<HTMLButtonElement>) => {
    if (username === "") {
      setMissingUsername(true);
    } else {
      setMissingUsername(false);
    }
    if (selectedIcon === "") {
      setMissingIcon(true);
    } else {
      setMissingIcon(false);
    }
    if (username !== "" && selectedIcon !== "" && socket) {
      setUser((prev) => ({ ...prev, role: "leader" }));
      socket.emit("roomCreate", username);
    }
  };

  const handleJoinRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (username === "") {
      setMissingUsername(true);
    }
    if (socket) {
      socket.emit("roomJoin", user.roomName, user.username);
      setUser((prev) => ({ ...prev, role: "player" }));
    }
  };

  return (
    <div className="grad flex-column">
      <Navbar />
      {/* {alertStatus && (
        <Alert text="The room you tried to join does not exist!"></Alert>
      )} */}
      <div
        className="center"
        style={{
          backgroundColor: "rgb(255,255,255, .5)",
          borderRadius: "10px",
          margin: "auto",
          placeContent: "center",
          padding: "5rem",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <form
          style={{ textAlign: "center", width: "100%" }}
          onSubmit={handleFormSubmit}
        >
          <div className="form-group center">
            <label htmlFor="username" style={{ marginBottom: "1rem" }}>
              Enter your username
            </label>
            <input
              style={{ width: "75%" }}
              type="text"
              className="form-control"
              id="username"
              aria-describedby="username"
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
            />
            {missingUsername && (
              <div style={{ color: "red" }}>Please enter a username!</div>
            )}
          </div>
        </form>
        <div className="flex-column" style={{ padding: "1rem 0 1rem 0" }}>
          <label htmlFor="icon" style={{ marginBottom: "1rem" }}>
            Choose your icon
          </label>
          <div className="flex-row" style={{ flexWrap: "wrap", gap: "1rem" }}>
            {[
              "favorite",
              "grade",
              "cruelty_free",
              "owl",
              "sound_detection_dog_barking",
              "nightlight",
            ].map((icon) => (
              <IconButton
                name={icon}
                fontSize={"3.5rem"}
                selected={selectedIcon}
                setSelected={setSelectedIcon}
              />
            ))}
          </div>
          {missingIcon && (
            <div style={{ color: "red" }}>Please choose an icon!</div>
          )}
        </div>
        <div className="flex-row" style={{ width: "95%" }}>
          <div
            style={{
              width: "50%",
              borderRight: "solid",
              borderColor: "lightGray",
              borderWidth: "2px",
              padding: "0.5rem",
            }}
          >
            <form
              className="center"
              style={{ textAlign: "left", width: "100%", placeContent: "left" }}
              onSubmit={handleFormSubmit}
            >
              <div className="form-group center">
                <label htmlFor="roomName" style={{ marginBottom: "5px" }}>
                  Join a room
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="roomName"
                  aria-describedby="roomName"
                  placeholder="ABCD"
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, roomName: e.target.value }))
                  }
                  value={user.roomName}
                  maxLength={4}
                  style={{ maxWidth: "50%" }}
                />
                <small id="roomCodeHelp" className="form-text text-muted">
                  Enter the four letter room code
                </small>
                {missingRoomName && (
                  <div style={{ color: "red" }}>
                    {" "}
                    Please enter a valid room code!
                  </div>
                )}
              </div>
              <button
                onClick={handleJoinRoom}
                style={{
                  display: "flex",
                  width: "90%",
                  padding: "0.75rem",
                  backgroundColor: "rgb(0, 119, 182, 1)",
                  color: "white",
                  borderRadius: ".75rem",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  placeContent: "center",
                  margin: "0.5rem",
                }}
              >
                Join
              </button>
            </form>
          </div>
          <div
            className="flex-column center"
            style={{
              width: "50%",
              gap: "1rem",
              padding: "0.5rem",
              placeContent: "end",
            }}
          >
            <div style={{ width: "100%" }}>
              <label htmlFor="createButton" style={{ marginBottom: "5px" }}>
                Create a room
              </label>{" "}
              <button
                id="createButton"
                style={{
                  display: "flex",
                  width: "90%",
                  padding: "0.75rem",
                  backgroundColor: "rgb(0, 119, 182, 1)",
                  color: "white",
                  borderRadius: ".75rem",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(5px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  placeContent: "center",
                  margin: "0.5rem",
                }}
                onClick={handleCreateRoom}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
