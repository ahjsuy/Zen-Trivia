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

let queryURL = "https://the-trivia-api.com/v2/questions?limit=1";

io.on("connection", (socket) => {
  console.log(`a user ${socket.id} connected`);

  socket.on("sendMessage", (message, username) => {
    console.log(message, username);
    io.emit("message", message, username);
  });

  socket.on("requestNew", async (queryURL, room) => {
    try {
      const response = await fetch(queryURL);
      const responseJSON = await response.json();
      console.log(responseJSON);
      console.log(queryURL);
      io.to(room).emit("responseQuestion", responseJSON);
    } catch (error) {
      console.error("Error fetching problem:", error);
    }
  });

  socket.on("roomJoin", (room) => {
    console.log("a new user joined ", room);
    socket.join(room);
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
