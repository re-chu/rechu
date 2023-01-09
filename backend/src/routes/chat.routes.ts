import express from "express";
import { RoomData } from "../db/chat.repo";
import { tokenValidator } from "../middlewares";
import * as chatService from "../services";
export const chatRoute = express();

chatRoute.get("/room", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  try {
    const result = await chatService.getRoomData(userId);
    return res.status(200).json({
      msg: "채팅방 목록",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 채팅방목록 API  : 상대 프사, 이름, 가장최근대화내용, 업데이트시간,
 * 채팅방 클릭시 해당 채팅방으로 입장할떄 소켓 연결하는데 이떄 소켓이벤트 보내고 이 안에 채팅방 id 주셈
 * 채팅방 입장했습니다. : 채팅 내역 작성유저id, 작성시간, 작성내용, checkout
 * 채팅 전송 : post userId 내용,
 */
// type ChatData = {
//   userId: number;
//   created: Date;
//   text: string;
//   checkout: number | null;
//   mark: string;
// };
chatRoute.get("/message", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  const roomId = Number(req.query.roomId);
  const mark = String(req.query.mark);
  try {
    const chatDatas = await chatService.getChatDatas(userId, roomId, mark);
    return res.status(200).json({
      msg: "채팅내역조회",
      data: chatDatas,
    });
  } catch (err) {
    next(err);
  }
});

chatRoute.post("/message", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  const { fromRoomId, text } = req.body;
  try {
    await chatService.sendChat(userId, fromRoomId, text);
    return res.status(201).json({
      msg: "성공",
      data: "성공",
    });
  } catch (err) {
    next(err);
  }
});

chatRoute.patch("/message", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  const roomId = req.body.roomId;
  try {
    await chatService.checkoutChatRoom(userId, roomId);
    return res.status(200).json({
      msg: "check out",
      data: "checkout",
    });
  } catch (err) {
    next(err);
  }
});
