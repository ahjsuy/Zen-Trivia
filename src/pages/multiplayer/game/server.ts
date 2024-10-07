import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import socketIO from "@nestjs/platform-socket.io";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 4000;

app.use(cors());

io.on("connection", (socket) => {
  console.log(`a user ${socket.id} connected`);
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
