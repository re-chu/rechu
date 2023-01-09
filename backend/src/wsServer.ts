import server from "./server";
import { Server } from "socket.io";
import { httpsServer } from "./server";
const wsServer = new Server(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  },
});

export default wsServer;
