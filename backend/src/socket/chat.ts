import { Socket } from "socket.io";
import wsServer from "../wsServer";

const chatSocket = wsServer.of("/chat");
chatSocket.on("connection", (socket: Socket) => {
  console.log("채팅 소켓 연결");
  socket.on("enterChatRoom", (roomId) => {
    socket.join(String(roomId));
  });

  socket.on(
    "sendMessage",
    (data: { roomId: number; sender: string; text: string; created: Date; avatarUrl: string }) => {
      console.log(data.sender, "가 메시지를 보냄");
      socket.to(String(data.roomId)).emit("newChatMessage", data);
    }
  );
});
export default chatSocket;
