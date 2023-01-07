import wsServer from "../wsServer";

export const chatSocket = wsServer.of("/chat");

export default chatSocket;
