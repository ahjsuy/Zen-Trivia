import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

type userInfoType = {
  username: string;
  role: "leader" | "player";
  socketID: string;
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client origin
    methods: ["GET", "POST"],
  },
});
const PORT = 4000;
const roomsList = new Map<string, userInfoType[]>();
const roomTimers = new Map<
  string,
  {
    interval: NodeJS.Timeout;
    startTime: number;
    duration: number;
  }
>();

let queryURL = "https://the-trivia-api.com/v2/questions?limit=1";

const getRoomName = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let roomName = "";
  for (let i = 0; i < 4; i++) {
    roomName += alphabet[Math.floor(Math.random() * 26)];
  }
  return roomName;
};

io.on("connection", (socket) => {
  console.log(`a user ${socket.id} connected`);

  socket.on(
    "sendMessage",
    ({
      message,
      username,
      roomName,
      icon,
    }: {
      message: string;
      username: string;
      roomName: string;
      icon: string;
    }) => {
      console.log(message, username);
      io.to(roomName).emit("message", message, username, icon);
    }
  );

  socket.on(
    "requestNew",
    async ({ queryURL, room }: { queryURL: string; room: string }) => {
      console.log("Requesting new questions with url: ", queryURL);
      try {
        const response = await fetch(queryURL);
        const responseJSON = await response.json();
        io.to(room).emit("responseQuestion", responseJSON);
        console.log("sent new question to ", room);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    }
  );

  socket.on("roomCreate", (username) => {
    const rooms = Array.from(io.sockets.adapter.rooms.keys());
    const activeRooms = rooms.filter((room) => !io.sockets.sockets.has(room));
    let newRoom = getRoomName();

    while (io.sockets.adapter.rooms.has(newRoom)) {
      newRoom = getRoomName();
    }

    console.log(`${socket.id} joined `, newRoom);
    socket.join(newRoom);
    roomsList.set(newRoom, [
      {
        username: username,
        role: "leader",
        socketID: socket.id,
      } as userInfoType,
    ]);
    io.to(socket.id).emit("currentRoom", newRoom);
  });

  socket.on("roomJoin", (room, username) => {
    if (io.sockets.adapter.rooms.has(room)) {
      socket.join(room);
      io.to(socket.id).emit("currentRoom", room);
      roomsList.set(room, [
        ...(roomsList.get(room) ?? []),
        {
          username: username,
          role: "player",
          socketID: socket.id,
        } as userInfoType,
      ]);
    } else {
      io.to(socket.id).emit("currentRoom", "invalid");
    }
  });

  socket.on("getUsersInRoom", (room) => {
    io.to(room).emit("usersList", roomsList.get(room));
    console.log("sent usersList ", roomsList.get(room));
  });

  socket.on(
    "updatePoints",
    ({
      room,
      username,
      points,
      pointsToWin,
    }: {
      room: string;
      username: string;
      points: number;
      pointsToWin: number;
    }) => {
      console.log(`${username} now has ${points} points`);
      io.to(room).emit("pointsUpdate", username, points);
      if (points >= pointsToWin) {
        io.to(room).emit("gameOver", username);
        console.log("GAME WON");
      }
    }
  );

  socket.on(
    "startGame",
    ({
      room,
      url,
      timer,
      points,
    }: {
      room: string;
      url: string;
      timer: number;
      points: number;
    }) => {
      console.log(
        `${room} requested to start timer with duration ${timer} and points ${points} with url ${url}`
      );
      io.to(room).emit("gameStart", { timer: timer, points: points, url: url });
      const duration = timer * 1000;

      function startRound() {
        const startTime = Date.now() + 2000;
        if (roomTimers.has(room)) clearInterval(roomTimers.get(room)!.interval);

        const interval = setInterval(() => {
          const now = Date.now();
          const elapsed = now - startTime;
          const remaining = Math.max(
            0,
            Math.floor((duration - elapsed) / 1000)
          );

          io.to(room).emit("timerTick", remaining);

          if (remaining <= 0) {
            io.to(room).emit("timerEnd");
            clearInterval(interval);
            setTimeout(() => {
              io.to(room).emit("timerStart", startTime, timer);
              startRound();
            }, 3000);
          }
        }, 1000);
        roomTimers.set(room, {
          interval: interval,
          startTime: startTime,
          duration: duration,
        });
      }
      startRound();
    }
  );

  socket.on("disconnect", () => {
    for (const [roomName, room] of roomsList) {
      for (const user of room) {
        if (user.socketID == socket.id) {
          // remove the user from the room
          // if the leader disconnected, choose a new leader
          const disconnectedUser: userInfoType = room.splice(
            room.indexOf(user),
            1
          )[0];

          if (disconnectedUser.role === "leader" && room.length > 0) {
            io.to(roomName).emit("newLeader", { socketID: room[0].socketID });
            console.log("choosing ", room[0].socketID, " as leader");
          } else if (room.length <= 0) {
            roomsList.delete(roomName);
          }
          io.to(roomName).emit("disconnectedUser", user.username);
          return;
        }
      }
    }
    console.log("a user disconnected");
  });
});

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "I changed the message!" });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
