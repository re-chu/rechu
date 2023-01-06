import express from "express";
import { tokenValidator } from "../middlewares";
import * as chatService from "../services";
export const chatRoute = express();

//매칭 결정시 만들어지는 채팅방 id
chatRoute.post("/", tokenValidator, async (req, res, next) => {
  const { mentoId, menteeId, matchingId }: { mentoId: number; menteeId: number; matchingId: number } = req.body;
  try {
    const result = await chatService.createChatRoom({ mentoId, menteeId, fromConnectId: matchingId });
    return res.status(201).json({
      msg: "채팅방생성",
      data: { charRoomId: result },
    });
  } catch (err) {
    next(err);
  }
});
