import { useEffect, useState } from "react";
import { useSocket } from "../SocketContext";
import { useUser } from "../UserContext";

interface ranking {
  username: string;
  points: number;
}

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
    const handleUsersList = (users: string[]) => {
      setUsersList(
        users.map((name) => ({ username: name, points: 0 } as ranking))
      );
    };

    const handlePointsUpdate = (username: string, points: number) => {
      setUsersList((prev) =>
        prev?.map((user) =>
          user.username != username ? user : { ...user, points: points }
        )
      );
    };

    socket.on("usersList", handleUsersList);
    socket.on("pointsUpdate", handlePointsUpdate);

    return () => {
      socket.off("usersList", handleUsersList);
      socket.off("pointsUpdate", handlePointsUpdate);
    };

    // if (socket) {
    //   socket.on("usersList", (users: string[]) => {
    //     setUsersList(
    //       users.map((name) => ({ username: name, points: 0 } as ranking))
    //     );
    //   });

    //   socket.on("pointsUpdate", (username, points) => {
    //     setUsersList((prev) =>
    //       prev?.map((user) =>
    //         user.username != username ? user : { ...user, points: points }
    //       )
    //     );
    //   });
    // }
  }, [socket]);

  return (
    <div
      className="flex-column"
      style={{
        backgroundColor: "rgb(255,255,255, .5)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
    >
      <h5>Leaderboard</h5>

      <ul>
        {userList
          ?.sort((a, b) => b.points - a.points)
          .map((user) => (
            <li style={{ listStyle: "none" }} key={user.username}>
              {user.username}: {user.points || 0} points
            </li>
          ))}
        {/* {Object.entries(userList)
          .sort(function (a, b) {
            return b[1] - a[1];
          })
          .map(([username, points]) => (
            <li style={{ listStyle: "none" }} key={username}>
              {username}: {points || 0} points
            </li>
          ))} */}
      </ul>
    </div>
  );
};

export default Leaderboard;
