import { useEffect, useState } from "react";
import { useSocket } from "../SocketContext";
import { useUser } from "../UserContext";

interface ranking {
  username: string;
  points: number;
}

type userInfoType = {
  username: string;
  role: "leader" | "player";
  socketID: string;
};

const Leaderboard = () => {
  // const [userList, setUsersList] = useState<Record<string, number>>({});
  const [userList, setUsersList] = useState<ranking[]>();

  const socket = useSocket();
  const { user } = useUser();

  useEffect(() => {
    if (socket) {
      socket.emit("getUsersInRoom", user.roomName);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUsersList = (users: userInfoType[]) => {
      setUsersList(
        users.map((user) => ({ username: user.username, points: 0 }))
      );
    };

    const handlePointsUpdate = (username: string, points: number) => {
      setUsersList((prev) =>
        prev?.map((user) =>
          user.username != username ? user : { ...user, points: points }
        )
      );
    };

    const handleDisconnect = (username: string) => {
      setUsersList((prev) =>
        prev?.filter((user) => user.username !== username)
      );
    };

    socket.on("usersList", handleUsersList);
    socket.on("pointsUpdate", handlePointsUpdate);
    socket.on("disconnectedUser", handleDisconnect);

    return () => {
      socket.off("usersList", handleUsersList);
      socket.off("pointsUpdate", handlePointsUpdate);
      socket.off("disconnectedUser", handleDisconnect);
    };
  }, [socket]);

  return (
    <div
      className="flex-column"
      style={{
        backgroundColor: "rgb(255,255,255, .5)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        paddingTop: "0.5rem",
        maxHeight: "40%",
        overflowY: "auto",
      }}
    >
      <h5>Leaderboard</h5>
      <hr style={{ margin: "5px" }}></hr>

      <ul style={{ padding: "0" }}>
        {userList
          ?.sort((a, b) => b.points - a.points)
          .map((user, index) => (
            <div>
              <li style={{ listStyle: "none" }} key={user.username}>
                {user.username}: {user.points || 0} points
              </li>
              {index !== userList.length - 1 && (
                <hr style={{ margin: "5px" }}></hr>
              )}
            </div>
          ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
