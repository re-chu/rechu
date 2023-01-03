import http from "http";
import app from "./server";
import { Server } from "socket.io";

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  },
});
wsServer.on("connection", (socket) => {
  console.log("접속되면 보여지는 것", socket.rooms);
  socket.on("login", (userId) => {
    socket.join(String(userId));
    console.log("새로 만들어짐 로그인을", socket.rooms);
  });

  socket.on("likesBoard", (boardOwnerId) => {
    console.log("게시글좋아요 알림");
    socket.to(String(boardOwnerId)).emit("alaram");
  });
  socket.on("addComment", (boardOwnerId) => {
    console.log("댓글추가 알림");
    socket.to(String(boardOwnerId)).emit("alaram");
  });
  socket.on("likesComment", (commentOwnerId) => {
    console.log("댓글좋아요 알림");
    socket.to(String(commentOwnerId)).emit("alaram");
  });
});

export default httpServer;
