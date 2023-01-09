import wsServer from "../wsServer";

const rootIo = wsServer.of("/");
rootIo.on("connection", (socket) => {
  console.log("글로벌 소켓 연결!");
  socket.on("login", (userId) => {
    socket.join(String(userId));
    console.log("로그인된다면 만들어지", socket.rooms);
  });

  socket.on("likesBoard", (boardOwnerId) => {
    console.log("게시글좋아요 알림");
    socket.to(String(boardOwnerId)).emit("alarm");
  });
  socket.on("addComment", (boardOwnerId) => {
    console.log("댓글추가 알림");
    socket.to(String(boardOwnerId)).emit("alarm");
  });
  socket.on("likesComment", (commentOwnerId) => {
    console.log("댓글좋아요 알림");
    socket.to(String(commentOwnerId)).emit("alarm");
  });
  socket.on("matchRequestToMento", (mentoId) => {
    console.log("멘토에게 요청알림 보내기");
    socket.to(String(mentoId)).emit("alarm");
  });
  socket.on("matchRequestToMentee", (mentoId) => {
    console.log("멘티에게 수락알림 보내기");
    socket.to(String(mentoId)).emit("alarm");
  });
});

export default rootIo;
