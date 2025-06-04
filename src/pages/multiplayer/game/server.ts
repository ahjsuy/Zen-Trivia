import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { categoriesList, difficultiesList } from "../../../types";
import { LargeNumberLike } from "crypto";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client origin
    methods: ["GET", "POST"],
  },
});
const PORT = 4000;
// roomname, list of users

const roomsList = new Map<string, string[]>();

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

  socket.on("sendMessage", ({ message, username, roomName, icon }) => {
    console.log(message, username, icon);
    io.to(roomName).emit("message", message, username, icon);
  });

  socket.on(
    "requestNew",
    async ({ queryURL, room }: { queryURL: string; room: string }) => {
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

  socket.on("roomCreate", (username: string) => {
    const rooms = Array.from(io.sockets.adapter.rooms.keys());
    const activeRooms = rooms.filter((room) => !io.sockets.sockets.has(room));
    let newRoom = getRoomName();

    while (io.sockets.adapter.rooms.has(newRoom)) {
      newRoom = getRoomName();
    }

    console.log(`${socket.id} joined `, newRoom);
    socket.join(newRoom);
    roomsList.set(newRoom, [username]);
    io.to(socket.id).emit("currentRoom", newRoom);
  });

  socket.on("roomJoin", (room, username) => {
    if (io.sockets.adapter.rooms.has(room)) {
      socket.join(room);
      io.to(socket.id).emit("currentRoom", room);
      roomsList.set(room, [...(roomsList.get(room) || []), username]);
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
    }: {
      room: string;
      username: string;
      points: number;
    }) => {
      console.log(`${username} now has ${points} points`);
      io.to(room).emit("pointsUpdate", username, points);
    }
  );

  socket.on(
    "gameWon",
    ({ room, username }: { room: string; username: string }) => {
      io.to(room).emit("gameOver", username);
      console.log("game over");
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
      console.log("Room " + room + " has started with query url " + url);
      console.log(
        "Max points is " + points + " and timer duration is " + timer
      );
      io.to(room).emit("gameStart", {
        timer: timer,
        points: points,
        url: url,
      });
    }
  );

  socket.on("resetTimer", (room) => {
    io.to(room).emit("timer");
    console.log(room + " timer reset");
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "I changed the message!" });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
