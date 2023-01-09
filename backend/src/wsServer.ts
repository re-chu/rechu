import server from "./server";
import { Server } from "socket.io";

const wsServer = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  },
});

export default wsServer;
