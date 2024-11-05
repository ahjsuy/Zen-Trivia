import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import socketIO from "@nestjs/platform-socket.io";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client origin
    methods: ["GET", "POST"],
  },
});
const PORT = 4000;
const roomsList = new Map<string, {}>();

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

  socket.on("sendMessage", (message, username, roomName) => {
    console.log(message, username);
    io.to(roomName).emit("message", message, username);
  });

  socket.on("requestNew", async (queryURL, room) => {
    try {
      const response = await fetch(queryURL);
      const responseJSON = await response.json();
      io.to(room).emit("responseQuestion", responseJSON);
      console.log("sent new question to ", room);
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  });

  socket.on("roomCreate", (username) => {
    const rooms = Array.from(io.sockets.adapter.rooms.keys());
    const activeRooms = rooms.filter((room) => !io.sockets.sockets.has(room));
    let newRoom = getRoomName();

    while (io.sockets.adapter.rooms.has(newRoom)) {
      newRoom = getRoomName();
    }

    console.log(`${socket.id} joined `, newRoom);
    socket.join(newRoom);
    roomsList.set(newRoom, { [username]: 0 });
    io.to(socket.id).emit("currentRoom", newRoom);
  });

  socket.on("roomJoin", (room, username) => {
    if (io.sockets.adapter.rooms.has(room)) {
      socket.join(room);
      io.to(socket.id).emit("currentRoom", room);
      roomsList.set(room, { ...roomsList.get(room), [username]: 0 });
    } else {
      io.to(socket.id).emit("currentRoom", "invalid");
    }
  });

  socket.on("getUsersInRoom", (room) => {
    io.to(room).emit("usersList", roomsList.get(room));
    console.log("sent usersList ", roomsList.get(room));
  });

  socket.on("updatePoints", (room, username, points, pointsToWin) => {
    console.log(`${username} now has ${points} points`);
    io.to(room).emit("pointsUpdate", username, points);
    if (points >= pointsToWin) {
      io.to(room).emit("gameWon", username);
      console.log("GAME WON");
    }
  });

  socket.on("startGame", (room, time) => {
    io.to(room).emit("gameStart", time);
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
