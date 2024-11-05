import TriviaGame from "../components/TriviaGame";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSocket } from "../SocketContext";
import { useUser } from "../UserContext";

const SingleClient = () => {
  // const socket = useRef<Socket | null>(null);
  // const [socketLoaded, setSocketLoaded] = useState(false);

  const socket = useSocket();
  const { user, setUser } = useUser();
  const [roomName, setRoomName] = useState(user.roomName);

  useEffect(() => {
    socket?.emit("roomCreate", user.username);
  }, []);

  useEffect(() => {
    setUser((prev) => ({ ...prev, roomName: roomName }));
  }, [roomName]);

  useEffect(() => {
    socket?.on("currentRoom", (room) => {
      setRoomName(room);
    });
  }, [socket]);

  // useEffect(() => {
  //   if (!socket.current) {
  //     socket.current = io("http://localhost:4000");

  //     socket.current.on("connect", () => {
  //       console.log("Connected to single player server!");
  //       setSocketLoaded(true);
  //     });

  //     socket.current.on("disconnect", () => {
  //       console.log("Disconnected from server");
  //       setSocketLoaded(false);
  //     });
  //   }

  //   // Cleanup to close the socket when the component unmounts
  //   return () => {
  //     if (socket.current) {
  //       socket.current.disconnect();
  //       socket.current = null;
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   if (socket.current && socketLoaded) {
  //     socket.current.emit("roomJoin", "single");
  //   }
  // }, [socketLoaded]);

  return (
    <div>
      <TriviaGame socket={socket} room={user.roomName} multiplayer={false} />
    </div>
  );
};

export default SingleClient;
