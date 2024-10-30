import TriviaGame from "../components/TriviaGame";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SingleClient = () => {
  const socket = useRef<Socket | null>(null);
  const [socketLoaded, setSocketLoaded] = useState(false);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://localhost:4000");

      socket.current.on("connect", () => {
        console.log("Connected to single player server!");
        setSocketLoaded(true);
      });

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
      socket.current.emit("roomJoin", "single");
    }
  }, [socketLoaded]);

  return (
    <div>
      {socketLoaded && <TriviaGame socket={socket.current} room={"single"} />}
    </div>
  );
};

export default SingleClient;
