import * as chatRepo from "../db/chat.repo";

// export const createChatRoom = async (data: { mentoId: number; menteeId: number; fromConnectId: number }) => {
//   try {
//     const result = await chatRepo.createChatRoomQ(data);
//     return result;
//   } catch (err) {
//     console.log(err.message);
//     if (err.message === "404") throw new Error(`404, 이미 존재하는 채팅방이거나 매칭정보를 찾을 수 없습니다.`);
//     throw new Error(`500, 서버 에러`);
//   }
// };

export const getRoomData = async (userId: number): Promise<chatRepo.RoomData[]> => {
  try {
    const result = await chatRepo.getChatRoomQ(userId);
    return result;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 채팅방 목록을 불러올 수 없습니다.`);
  }
};

export const getChatDatas = async (userId: number, roomId: number, mark: string) => {
  try {
    if (!mark) {
      const result = await chatRepo.firstGetChatDataQ(userId, roomId);
      return result;
    }
    const result = await chatRepo.moreGetChatDataQ(userId, roomId, mark);
    return result;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 채팅내역을 불러올 수 없습니다.`);
  }
};

export const sendChat = async (userId: number, roomId: number, text: string): Promise<true> => {
  const data = {
    sendFrom: userId,
    fromRoomId: roomId,
    text,
  };
  try {
    await chatRepo.sendChatQ(data);
    return true;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 채팅 보내기에 실패했습니다.`);
  }
};

export const checkoutChatRoom = async (userId: number, roomId: number): Promise<true> => {
  try {
    await chatRepo.checkoutChatRoomQ(userId, roomId);
    return true;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500 서버 오류`);
  }
};
