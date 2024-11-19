import { useEffect, useState, useRef } from "react";
import IconButton from "../../../components/IconButton";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../SocketContext";
import { useUser } from "../../../UserContext";
import Alert from "../../../components/Alert";

const saveToSessionStorage = (key: string, value: object) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const Login = () => {
  const socket = useSocket();
  const { user, setUser } = useUser();
  const [username, setUsername] = useState(user.username);
  const [selectedIcon, setSelectedIcon] = useState("user.icon");
  const [roomName, setRoomName] = useState(user.roomName);
  const [alertStatus, setAlertStatus] = useState(false);

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
    if (socket) {
      socket.on("currentRoom", (roomName) => {
        if (roomName != "invalid") {
          setRoomName(roomName);
        } else {
          setAlertStatus(true);
        }
      });
    }
  }, [socket]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleCreateRoom = () => {
    if (socket) {
      setUser((prev) => ({ ...prev, role: "leader" }));
      socket.emit("roomCreate", username);
    }
  };

  const handleJoinRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (socket) {
      socket.emit("roomJoin", user.roomName, user.username);
      setUser((prev) => ({ ...prev, role: "player" }));
    }
  };

  return (
    <div className="grad flex-column">
      {alertStatus && (
        <Alert text="The room you tried to join does not exist!"></Alert>
      )}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          position: "absolute",
          top: "25%",
          left: "37.5%",
          width: "25%",
          padding: "50px",
        }}
      >
        <form
          style={{ textAlign: "center", width: "100%" }}
          onSubmit={handleFormSubmit}
        >
          <div className="form-group">
            <label htmlFor="username" style={{ marginBottom: "5px" }}>
              Enter your username
            </label>
            <input
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
          </div>
        </form>
        <div className="flex-column">
          <div>Choose your icon</div>
          <div className="flex-row" style={{ flexWrap: "wrap" }}>
            <IconButton
              name="favorite"
              fontSize={32}
              selected={selectedIcon}
              setSelected={setSelectedIcon}
            />
            <IconButton
              name="grade"
              fontSize={32}
              selected={selectedIcon}
              setSelected={setSelectedIcon}
            />
            <IconButton
              name="cruelty_free"
              fontSize={32}
              selected={selectedIcon}
              setSelected={setSelectedIcon}
            />
            <IconButton
              name="owl"
              fontSize={32}
              selected={selectedIcon}
              setSelected={setSelectedIcon}
            />
            <IconButton
              name="sound_detection_dog_barking"
              fontSize={32}
              selected={selectedIcon}
              setSelected={setSelectedIcon}
            />
            <IconButton
              name="nightlight"
              fontSize={32}
              selected={selectedIcon}
              setSelected={setSelectedIcon}
            />
          </div>
        </div>
        <div className="flex-row" style={{ gap: "10px" }}>
          <div
            style={{
              width: "50%",
              placeContent: "left",
              textAlign: "left",
              borderRight: "solid",
              borderColor: "lightGray",
              borderWidth: "2px",
              padding: "5px",
            }}
          >
            <form
              style={{ textAlign: "left", width: "100%", placeContent: "left" }}
              onSubmit={handleFormSubmit}
            >
              <div className="form-group">
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
                />
                <small id="roomCodeHelp" className="form-text text-muted">
                  Enter the four letter room code
                </small>
              </div>
              <button
                onClick={handleJoinRoom}
                style={{
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  marginTop: "10px",
                }}
              >
                Join
              </button>
            </form>
          </div>
          <div className="flex-column">
            <div>Create a room</div>
            <button
              style={{
                paddingRight: "10px",
                paddingLeft: "10px",
                marginTop: "10px",
              }}
              onClick={handleCreateRoom}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
