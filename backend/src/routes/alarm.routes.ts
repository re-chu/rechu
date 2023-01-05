import express from "express";
import { tokenValidator } from "../middlewares";
import * as alarmService from "../services";
import { UpdateAlarm } from "../services";
export const alarmRoute = express();

alarmRoute.get("/", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  try {
    const alarmData = await alarmService.getAlarmData(userId);
    return res.status(200).json({
      msg: "새로들어온 요청들",
      data: alarmData,
    });
  } catch (err) {
    next(err);
  }
});

alarmRoute.patch("/", tokenValidator, async (req, res, next) => {
  // const userId = Number(req.body.jwtDecoded.id);
  const { cmCommentId, bmBoardId, commentId, type } = req.body;
  const toUpdate: UpdateAlarm = {
    ...(cmCommentId && { cmCommentId }),
    ...(bmBoardId && { bmBoardId }),
    ...(commentId && { commentId }),
    ...(type && { type }),
  };
  try {
    const result = await alarmService.checkoutAlarm(toUpdate);
    return res.status(200).json({
      msg: "확인 완료",
      data: `${type} 알림 확인 ${result}`,
    });
  } catch (err) {
    next(err);
  }
});

export default alarmRoute;
