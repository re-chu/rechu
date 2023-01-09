import { Socket } from "socket.io";
import wsServer from "../wsServer";

const chatSocket = wsServer.of("/chat");
chatSocket.on("connection", (socket: Socket) => {
  console.log("채팅 소켓 연결");
  socket.on("enterChatRoom", (roomId) => {
    socket.join(String(roomId));
  });

  socket.on("sendMessage", (roomId: number, data: { text: string; created: Date; senderId: number }) => {
    socket.to(String(roomId)).emit("newChatMessage", data);
    socket.emit("newMessageAlarm", roomId, data);
  });
  socket.on("leaveChatRoom", (roomId) => {
    socket.leave(String(roomId));
  });
});
export default chatSocket;
