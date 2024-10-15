import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  // Check if Socket.IO is already attached to prevent multiple instances
  let io: SocketIOServer;

  if (!("io" in httpServer)) {
    io = new SocketIOServer(httpServer);
    httpServer.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected");
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  } else {
    io = httpServer["io"];
  }

  // All Next.js requests
  server.all("*", (req, res) => handle(req, res));

  httpServer.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
