import * as utils from "./utils";
import { db } from ".";

// 채팅방 목록 가져오기
export type RoomData = {
  roomId: number;
  username: string;
  avatarUrl: string;
  lastText: string;
  created: Date;
  mentoId: number;
  menteeId: number;
  fromConnectId: number;
  noCheckoutMessages: number | null;
};
export const getChatRoomQ = async (userId: number): Promise<RoomData[]> => {
  // 멘토 Id or 멘티 ID 가 userId 인 채팅룸 데이터 다 불러옴+
  // 안읽은 채팅을 구현하기 위해 챗데이터를 찾는데, 위 쿼리에 나온 id 값으로 채팅내역찾음
  // 이때 checkout이 0이고 sendFrom != userId 인 값을 최신정렬로 가져옴
  // 이걸 리턴값에 추가하고, 가장 리턴의[0]번째 text를 lastText로 전달함
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    const [chatRoomDataRows] = await conn.query(
      `
        SELECT 
            id as roomId ,
            lastText,
            created,
            mentoId,
            menteeId,
            fromConnectId
        FROM chat_room_table 
        WHERE mentoId = ? OR menteeId = ?
        ORDER BY created DESC
    `,
      [userId, userId]
    );
    const chatRoomData = utils.jsonParse(chatRoomDataRows);

    const extendsRoomDatas = await Promise.all(
      chatRoomData.map(async (roomData: RoomData) => {
        const [chatRows] = await conn.query(
          `SELECT 
            text,
            checkout,
            sendFrom
            FROM chat_data_table 
            WHERE fromRoomId = ? AND sendFrom != ? AND checkout = 0
            ORDER BY created DESC
            LIMIT 301
            `,
          [roomData.roomId, userId]
        );

        const noCheckedChatDatas = utils.jsonParse(chatRows);
        // 상대방이 누군지 찾아서 리턴
        const [targetUserRow] = await conn.query(
          `
              SELECT avatarUrl,username FROM user WHERE ?
            `,
          [noCheckedChatDatas.sendFrom]
        );
        const targetUser = utils.jsonParse(targetUserRow)[0];

        roomData.avatarUrl = targetUser.avatarUrl;
        roomData.username = targetUser.username;
        roomData.lastText = noCheckedChatDatas.text;
        roomData.created = noCheckedChatDatas[0].created;
        return {
          ...roomData,
          noCheckoutMessages: noCheckedChatDatas.length,
        };
      })
    );
    conn.commit();
    const result = extendsRoomDatas;
    return result;
  } catch (err) {
    console.log(err.message);
    conn.rollback();
    throw new Error(err);
  } finally {
    conn.release();
  }
};

// 채팅방 들어갔을때 채팅내역 불러오고, 안읽은거 파바바박 업데이트 시키기
export type ChatData = {
  chatId: number;
  senderId: number;
  username: string;
  avatarUrl: string;
  text: string;
  MARK: string;
};
export const firstGetChatDataQ = async (userId: number, roomId: number): Promise<ChatData[]> => {
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    // 채팅방 들어온거면 안읽은 메시지 확인도 해야함
    //
    const [chatDataRows] = await conn.query(
      `
        SELECT
            chat.id as chatId,
            chat.sendFrom as senderId,
            chat.text,
            CONCAT (
                LPAD (unix_timestamp(chat.created),12,0)
                ,
                LPAD (chat.id,8,0)
            ) as MARK,
            chat.created,
            user.username,
            user.avatarUrl	
        FROM chat_data_table chat
        JOIN user user
        ON user.id = chat.sendFrom
        WHERE fromRoomId = ? 
        ORDER BY created DESC 
        LIMIT 20
    `,
      [roomId]
    );
    // 메시지확인
    await conn.query(
      `
        UPDATE chat_data_table
        SET
            checkout = 1
        WHERE sendFrom != ? AND fromRoomId = ?
    `,
      [userId, roomId]
    );
    const chatData = utils.jsonParse(chatDataRows);
    conn.commit();
    return chatData;
  } catch (err) {
    console.log(err.message);
    conn.rollback();
    throw new Error(err);
  } finally {
    conn.release();
  }
};
//채팅내역 더보기
export const moreGetChatDataQ = async (userId: number, roomId: number, mark: string): Promise<ChatData[]> => {
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    const [chatDataRows] = await conn.query(
      `
        SELECT
            id as chatId,
            sendFrom as senderId,
            text,
            CONCAT (
                LPAD (unix_timestamp(created),12,0)
                ,
                LPAD (id,8,0)
            ) as MARK,
            created		
        WHERE fromRoomId = ? AND
            ${mark} >  CONCAT (
            LPAD (unix_timestamp(created),12,0),
            LPAD (b.id,8,0)
          )
        ORDER BY created DESC 
        LIMIT 20
    `,
      [roomId]
    );
    conn.commit();
    const result = utils.jsonParse(chatDataRows);
    return result;
  } catch (err) {
    console.log(err.message);
    conn.rollback();
    throw new Error(err);
  } finally {
    conn.release();
  }
};

export const sendChatQ = async (data: { sendFrom: number; fromRoomId: number; text: string }): Promise<true> => {
  const [keys, values, valval] = utils.insertData(data);
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    await conn.query(
      `
      INSERT INTO chat_data_table
      (${keys.join(", ")})
      VALUES (${values.join(", ")})
    `,
      [...valval]
    );
    conn.commit();
    return true;
  } catch (err) {
    conn.rollback();
    console.log(err.message);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

export const checkoutChatRoomQ = async (userId: number, roomId: number) => {
  await db.query(
    `
    UPDATE chat_data_table
    SET checkout = 1
    WHERE sendFrom != ? AND fromRoomId = ?
  `,
    [userId, roomId]
  );
  return true;
};

export const destructionRoom = async (roomId: number) => {
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    await db.query(
      `
      DELETE chat_data_table
      WHERE fromRoomId=?
    `,
      [roomId]
    );
    await db.query(
      `
      DELETE chat_room_table
      where id= ?
    `,
      [roomId]
    );
    return true;
    conn.commit();
  } catch (err) {
    conn.rollback();
    console.log(err.message);
    throw new Error(err);
  } finally {
    conn.release();
  }
};
