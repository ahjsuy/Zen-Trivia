import { useEffect, useState } from "react";
import IconButton from "../../../components/IconButton";

const saveToSessionStorage = (key: string, value: object) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const Login = () => {
  const [user, setUser] = useState({ username: "", icon: "", roomName: "" });
  const [selectedIcon, setSelectedIcon] = useState("placeholder");

  useEffect(() => {
    saveToSessionStorage("user", user);
  }, [user]);

  useEffect(() => {
    setUser((prev) => ({ ...prev, icon: selectedIcon }));
  }, [selectedIcon]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleCreateRoom = () => {
    setUser((prev) => ({ ...prev, roomName: "NEW" }));
  };

  return (
    <div className="grad flex-column">
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
              onChange={(e) =>
                setUser((prev) => ({ ...prev, username: e.target.value }))
              }
              value={user.username}
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
              <button>Join</button>
            </form>
          </div>
          <div className="flex-column">
            <div>Create a room</div>
            <button
              onClick={() => {
                setUser((prev) => ({ ...prev, roomName: "NEW" }));
              }}
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
