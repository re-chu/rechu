import { Socket } from "socket.io";
import wsServer from "../wsServer";
import globalSocekt from "./global";
const chatSocket = wsServer.of("/chat");
chatSocket.on("connection", (socket: Socket) => {
  console.log("채팅 소켓 연결");
  socket.on("enterChatRoom", (roomId) => {
    socket.join(String(roomId));
  });

  socket.on("sendMessage", (roomId: number, data: { username: string; text: string; created: Date }) => {
    console.log(data.username, "가 메시지를 보냄");
    socket.to(String(roomId)).emit("newChatMessage", data);
  });

  socket.on("leaveChatRoom", (roomId) => {
    socket.leave(String(roomId));
  });
});
export default chatSocket;
