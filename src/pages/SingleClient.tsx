// import TriviaGame from "../components/TriviaGame";
import { useEffect, useState } from "react";
import { useSocket } from "../SocketContext";
import { useUser } from "../UserContext";

const SingleClient = () => {
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

    return () => {
      console.log("reseting roomName");
      setUser((prev) => ({ ...prev, roomName: "" }));
    };
  }, [socket]);

  return (
    <div>
      {/* <TriviaGame socket={socket} room={user.roomName} multiplayer={false} /> */}
    </div>
  );
};

export default SingleClient;
