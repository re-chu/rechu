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
