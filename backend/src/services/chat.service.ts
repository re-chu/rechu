import * as chatRepo from "../db/chat.repo";

export const createChatRoom = async (data: { mentoId: number; menteeId: number; fromConnectId: number }) => {
  try {
    const result = await chatRepo.createChatRoomQ(data);
    return result;
  } catch (err) {
    console.log(err.message);
    if (err.message === "404") throw new Error(`404, 이미 존재하는 채팅방이거나 매칭정보를 찾을 수 없습니다.`);
    throw new Error(`500, 서버 에러`);
  }
};
