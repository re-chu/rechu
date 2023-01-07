import * as utils from "./utils";
import { db } from ".";
export const createChatRoomQ = async (data: { mentoId: number; menteeId: number; fromConnectId: number }) => {
  const [keys, values, valval] = utils.insertData(data);
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    const [checkMatchStatus, alreadyCreatedRoom] = await Promise.all([
      utils.jsonParse(
        await conn.query(
          `
            SELECT step
            FROM connect
            WHERE id=?
        `,
          [data.fromConnectId]
        )
      )[0][0],
      utils.jsonParse(
        await conn.query(
          `
            SELECT id FROM chat_room_table WHERE fromConnectId = ?
    `,
          [data.fromConnectId]
        )
      )[0][0],
    ]);
    console.log(checkMatchStatus, "1");
    console.log(alreadyCreatedRoom, "2");
    if (!checkMatchStatus || alreadyCreatedRoom) throw new Error(`404`);
    const [createdRoom] = await conn.query(
      `
        INSERT 
        INTO chat_room_table(${keys.join(", ")})
        VALUES (${values.join(", ")})
        
    `,
      [...valval]
    );
    const result = utils.jsonParse(createdRoom).insertId;
    conn.commit();
    return result;
  } catch (err) {
    conn.rollback();
    console.log(err.message);
    throw new Error(err.message);
  } finally {
    conn.release();
  }
};
