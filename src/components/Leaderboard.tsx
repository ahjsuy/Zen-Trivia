import { useEffect, useState } from "react";
import { useSocket } from "../SocketContext";
import { useUser } from "../UserContext";

const Leaderboard = () => {
  const [userList, setUsersList] = useState<Record<string, number>>({});
  const socket = useSocket();
  const { user, setUser } = useUser();

  useEffect(() => {
    if (socket) {
      socket.emit("getUsersInRoom", user.roomName);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("usersList", (usersList) => {
        setUsersList(usersList);
        console.log("new user joined");
      });

      socket.on("pointsUpdate", (username, points) => {
        setUsersList((prev) => ({ ...prev, [username]: points }));
      });
    }
  }, [socket]);

  return (
    <div className="flex-column" style={{ backgroundColor: "white" }}>
      Leaderboard
      <ul>
        {Object.entries(userList)
          .sort(function (a, b) {
            return b[1] - a[1];
          })
          .map(([username, points]) => (
            <li style={{ listStyle: "none" }} key={username}>
              {username}: {points} points
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
