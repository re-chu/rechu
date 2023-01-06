import * as alarmRepo from "../db/alarm.repo";
export const getAlarmData = async (userId: number) => {
  try {
    const newAlarm = await alarmRepo.getAlarmDataQ(userId);
    return newAlarm;
  } catch (err) {
    console.log("??");
    console.log(err.message);
    throw new Error(`500, 서버오류`);
  }
};
export type UpdateAlarm = {
  type: string;
  cmCommentId?: number;
  bmBoardId?: number;
  commentId?: number;
};
export const checkoutAlarm = async (toUpdate: UpdateAlarm): Promise<true> => {
  try {
    const update = await alarmRepo.updateAlarm(toUpdate);
    return update;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버 오류`);
  }
};
