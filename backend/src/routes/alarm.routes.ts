import express from "express";
import { tokenValidator } from "../middlewares";
import * as alarmService from "../services";
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

export default alarmRoute;
