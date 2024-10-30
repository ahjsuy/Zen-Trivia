import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client"; // Make sure this is installed: npm install socket.io-client
import Chat from "../../../components/Chat";
import TriviaGame from "../../../components/TriviaGame";

const loadFromSessionStorage = (key: string, defaultValue: object) => {
  const storedValues = sessionStorage.getItem(key);
  if (storedValues) {
    return JSON.parse(storedValues);
  }
  return defaultValue;
};

function Client() {
  const socket = useRef<Socket | null>(null);
  const [socketLoaded, setSocketLoaded] = useState(false);
  const [user, setUser] = useState(() =>
    loadFromSessionStorage("username", { username: "placeholder" })
  );

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://localhost:4000");

      // Handle connection event
      socket.current.on("connect", () => {
        console.log("Connected to server");
        setSocketLoaded(true);
      });

      // Handle disconnection
      socket.current.on("disconnect", () => {
        console.log("Disconnected from server");
        setSocketLoaded(false);
      });
    }

    // Cleanup to close the socket when the component unmounts
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (socket.current && socketLoaded) {
      socket.current.emit("roomJoin", "multiplayer");
    }
  }, [socketLoaded]);

  return (
    <div className="grad flex-row">
      <div style={{ flexGrow: "1" }}>
        {socketLoaded && (
          <TriviaGame socket={socket.current} room={"multiplayer"} />
        )}
      </div>
      <div>{socketLoaded && <Chat socket={socket.current} user={user} />}</div>
    </div>
  );
}

export default Client;
