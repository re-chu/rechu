import * as utils from "./utils";
import { CreateUserDto } from "src/routes/dto/create-individual.dto";
import { db } from ".";
import { UserProfile } from "./schemas";
import { updateData } from "./utils/transData";

export const getUsersWhereRot = async () => {
  const getColumns = "id,username,point,avatarUrl,working";
  const [liveInRot] = await db.query(`
    SELECT ${getColumns}
    FROM user
    WHERE point > 100
  `);
  const result = utils.jsonParse(liveInRot);
  return result;
};

export const getUsersByAdmin = async () => {
  const getColumns =
    "id,username,point,email,phoneNumber,created,avatarUrl,password,clickedLikes,gitHubUrl,howToLogin,role,working";
  const [users] = await db.query(`
    SELECT ${getColumns}
    FROM user
    WHERE role = user
  `);
  const result = utils.jsonParse(users);
  return result;
};

/** 인자로 userId 또는 email을 넣어주시면, 비밀번호를 제외한 사용자 정보를 드립니다. */
export const unIncludePasswordUserInfoQ = async (userIdOrEmail: number | string): Promise<UserProfile> => {
  const queryResultCoulmns =
    "id,news,username,point,email,phoneNumber,created,avatarUrl,clickedLikes,gitHubUrl,howToLogin,role,working,chance";
  let [userInfoRows, fields] = [[], []];

  // 파라미터로 들어온 data 값이 num이면 id로 찾고, 아니면 email로 찾음
  switch (typeof userIdOrEmail) {
    case "string":
      [userInfoRows, fields] = await db.query(
        `
      SELECT
        ${queryResultCoulmns} 
      FROM user 
      WHERE email=?`,
        [userIdOrEmail]
      );
      break;
    default:
      // user = await dataSource.getRepository(User).findOne({ where: { id: data } });
      [userInfoRows, fields] = await db.query(
        `
        SELECT
          ${queryResultCoulmns} 
          FROM user 
          WHERE id=?`,
        [userIdOrEmail]
      );
      break;
  }
  const result = utils.jsonParse(userInfoRows)[0];
  return result;
};

export const findOneUser = async (userIdOrEmail: number | string): Promise<UserProfile> => {
  const queryResultCoulmns =
    "id,username,point,email,phoneNumber,created,avatarUrl,password,clickedLikes,gitHubUrl,howToLogin,role,working,ban ";
  let [userInfoRows, fields] = [[], []];

  // 파라미터로 들어온 data 값이 num이면 id로 찾고, 아니면 email로 찾음
  switch (typeof userIdOrEmail) {
    case "string":
      [userInfoRows, fields] = await db.query(
        `
      SELECT
        ${queryResultCoulmns} 
      FROM user 
      WHERE email=?`,
        [userIdOrEmail]
      );
      break;
    default:
      // user = await dataSource.getRepository(User).findOne({ where: { id: data } });
      [userInfoRows, fields] = await db.query(
        `
        SELECT
          ${queryResultCoulmns} 
          FROM user 
          WHERE id=?`,
        [userIdOrEmail]
      );
      break;
  }
  const result = utils.jsonParse(userInfoRows)[0];
  return result;
};

export const createIndiUser = async (data: Record<string, string | number | boolean>) => {
  const { username, email, phoneNumber, password } = data;
  const [keys, values, valval] = utils.insertData(data);
  const [newUser] = await db.query(
    `
      INSERT INTO 
      user (${keys.join(", ")})
      VALUES (${values.join(", ")})
    `,
    [...valval]
  );
  // const newUser = dataSource.getRepository(User).create({ ...data });
  const result = utils.jsonParse(newUser).insertId;

  return result;
};

export const updateUser = async (id: number, data: Record<string, string | boolean | number>): Promise<string> => {
  const [keys, values] = updateData(data);
  console.log("업뎃내역 ", data);
  await db.query(
    `
    UPDATE user 
    SET ${keys.join(", ")},updated=now() 
    WHERE id = ?
    `,
    [...values, id]
  );
  // typeORM 코드
  // await dataSource.getRepository(User).update(id, toUpdate);
  return "ok";
};

// 리폿했는지 여부
export const checkReportedQ = async (reporter: number, defendant: number) => {
  const [checked] = await db.query(
    `
    SELECT *
    FROM user_report_table
    WHERE 
      reporterUserId = ?
      AND
      defendantUserId = ?
  `,
    [reporter, defendant]
  );

  const result = utils.jsonParse(checked)[0];
  return result;
};

export const reportQ = async (reportData: { reporterUserId: number; defendantUserId: number; reason: string }) => {
  const [keys, values, valval] = utils.insertData(reportData);
  const [newReport] = await db.query(
    `
      INSERT INTO 
      user_report_table (${keys.join(", ")})
      VALUES (${values.join(", ")})
    `,
    [...valval]
  );
  await db.query(
    `
    UPDATE user
    SET reported= reported+1
    WHERE id=?
  `,
    [reportData.defendantUserId]
  );

  const result = utils.jsonParse(newReport);
  console.log("리포트후 리절트 =", result);
  return true;
};

export const cancelReportQ = async (reporterUserId: number, defendantUserId: number) => {
  await db.query(
    `
    DELETE 
    FROM user_report_table
    WHERE 
      reporterUserID = ?
      AND
      defendantUserID = ?
  `,
    [reporterUserId, defendantUserId]
  );
  console.log("리폿취소요");
  await db.query(
    `
    UPDATE user
    SET reported = reported-1
    WHERE id = ?
  `,
    [defendantUserId]
  );

  return true;
};

// 고인물 목록 조회
export type Rot = {
  username: string;
  id: number;
  point: number;
  corrections: number;
};
export type RotList = Rot[];
export const getRotListQ = async (userId: number): Promise<RotList> => {
  const [rotList] = await db.query(
    `
    SELECT 
      username,
      id,
      point,
      corrections
    FROM user
    WHERE 
      id != ? AND
      point > 200 AND
      working = true
    ORDER BY rand()
    LIMIT 6
  `,
    [userId]
  );
  const result = utils.jsonParse(rotList);
  return result;
};

// 매칭 현황
export type MatchInfo = {
  matchInfo: {
    matchingId: number;
    step: string;
    mentoId: number;
    menteeId: number;
    created: "";
    rotId: number;
    mentoEmail: string;
    mentoName: string;
    point: number;
  };
  cancelAble: boolean;
};

export type Match = {
  id: number;
  step: string;
  complate: number;
  mentoComplate: string;
  menteeComplate: string;
};
export const findMatchByMatchingId = async (matchingId: number): Promise<Match> => {
  const [connect] = await db.query(
    `
    SELECT 
      id,
      step,
      mentoComplate,
      menteeComplate
    FROM connect 
    WHERE
      id=?
  `,
    [matchingId]
  );
  const result = utils.jsonParse(connect)[0];

  return result;
};

export const findMatchQ = async (userId: number): Promise<MatchInfo> => {
  const result: MatchInfo = {
    matchInfo: {
      matchingId: 0,
      step: "",
      mentoId: 0,
      menteeId: 0,
      created: "",
      rotId: 0,
      mentoEmail: "",
      mentoName: "",
      point: 0,
    },
    cancelAble: false,
  };
  const [connect] = await db.query(
    `
      SELECT 
        c.id as matchingId,
        c.step,
        c.mentoId,
        c.menteeId,
        c.created,
        u.id as rotId,
        u.email as mentoEmail,
        u.username as mentoName,
        u.point
      FROM connect c
      JOIN user u
      on mentoId = u.id
      WHERE 
        menteeId = ? AND menteeComplate = 0
    `,
    [userId]
  );
  const parseConnect = utils.jsonParse(connect)[0];
  console.log("현재 진행중인 매칭", parseConnect);
  result.matchInfo = parseConnect;
  if (result.matchInfo?.step === "요청중") {
    result.cancelAble = true;
  }
  // if (!parseConnect) {
  //   return false;
  // }
  return result;
};

// 매칭 요청  트렌젝션 o
export const createMatchQ = async (data: { step: string; menteeId: number; mentoId: number }): Promise<number> => {
  const [keys, values, valval] = utils.insertData(data);
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    const [create] = await conn.query(
      `
      INSERT INTO 
      connect (${keys.join(", ")})
      VALUES (${values.join(", ")})
    `,
      [...valval]
    );
    const parseCreate = utils.jsonParse(create);
    const matchingId = parseCreate.insertId;
    // 만들어진 매칭 id 값으로 멘티의 유저정보 업데이트
    await conn.query(
      `
      UPDATE user
      SET 
        matching = ?
      WHERE
        id = ?
    `,
      [matchingId, data.menteeId]
    );
    conn.commit();
    return matchingId;
  } catch (err) {
    conn.rollback();
    console.log(err.message);
    throw new Error(`에러`);
  } finally {
    conn.release();
  }
};

// 매칭 취소  트렌젝션 o
export const cancelMatchQ = async (matchingId: number): Promise<boolean> => {
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    const [zz] = await conn.query(
      `
      DELETE FROM connect
      WHERE id = ? 
    `,
      [matchingId]
    );
    await conn.query(
      `
      UPDATE user
      SET
        matching = 0
      WHERE 
        matching = ?
    `,
      [matchingId]
    );
    conn.commit();
    // 여기도 트렌젝션
    return true;
  } catch (err) {
    console.log(err.message);
    conn.rollback();
    throw new Error(`에러`);
  } finally {
    conn.release();
  }
};

// 매칭 수락 ( 고인물 )
export const acceptMatchQ = async (matchingId: number, menteeId: number): Promise<boolean> => {
  const [updateMatch] = await db.query(
    `
    UPDATE connect
    SET
      step = "진행중"
    WHERE 
      id= ? AND
      menteeId = ?
  `,
    [matchingId, menteeId]
  );
  return true;
};

// 매칭 끝내기버튼
export const successMatchQ = async (
  matchingId: number,
  data: { role: string; deleteMenteeIdQuery?: string },
  userId: number
): Promise<string> => {
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    if (data.deleteMenteeIdQuery) {
      console.log("멘티제거");
      await conn.query(
        `
      UPDATE user 
      SET 
        matching = 0 ,
        point = point -50
      WHERE 
        id IN (
            SELECT menteeId FROM connect WHERE id = ?
          );
    `,
        [matchingId]
      );
    } else {
      conn.query(
        `
      UPDATE user
      SET
        corrections=corrections+1 ,
        point = point +50
      WHERE
        id = ?
    `,
        [userId]
      );
    }
    const [updated] = await conn.query(
      `
    UPDATE connect
    SET
      ${data.role} = 1 
    WHERE
      id = ?
  `,
      [matchingId]
    );
    const [matchInfoRow] = await conn.query(
      `
      SELECT mentoComplate , menteeComplate From connect Where id = ?
    `,
      [matchingId]
    );
    const matchInfo = utils.jsonParse(matchInfoRow)[0];
    if (matchInfo.menteeComplate + matchInfo.mentoComplate === 2) {
      await conn.query(
        `
      UPDATE connect
      SET
        step = "완료"
      WHERE 
        id = ?
    `,
        [matchingId]
      );
    }
    const result = data.role === "menteeComplate" ? "멘티가 종료누름" : "멘토가 종료누름";
    conn.commit();
    return result;
  } catch (err) {
    console.log(err.message);
    conn.rollback();
    throw new Error(`500 서버오류`);
  } finally {
    conn.release();
  }
};

// 매칭 종료 ( 멘티id 비우고, 멘토id 만 남기기)
// 트렌젝션 O
export const complateMatch = async (matchingId: number) => {
  console.log("??");
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    const [match] = await conn.query(
      `
      SELECT 
        mentoId,
        menteeId
      FROM connect
      WHERE
        id = ?
    `,
      [matchingId]
    );

    conn.commit();
    return "매칭 종료";
  } catch (err) {
    conn.rollback();
    console.log(err.message);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

type 임시 = {
  matchingId: number;
  step: string;
  menteeId: number;
  menteeName: string;
  menteeEmail: string;
  created: string;
};
// 고인물에게 들어온 요청  트렌젝션 O
export type GetMatchRequest = {
  matchingId: number;
  step: string;
  menteeId: number;
};
export const getRequestCorrectionQ = async (userId: number) => {
  // step = 요청중, mentoId =userId , complate = 0인것들을 created DESC 로 뱉기
  console.log("이까진 오나?", userId);
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    const [list] = await conn.query(
      `
      SELECT 
        c.id as matchingId,
        c.step,
        c.menteeId,
        u.username as menteeName,
        u.email as menteeEmail,
        c.created
      FROM connect c
      JOIN user u
      ON u.id = c.menteeId
      WHERE 
        c.step != '완료' AND mentoId = ? AND mentoComplate = 0 
      ORDER BY created DESC
    `,
      [userId]
    );
    const result = utils.jsonParse(list);
    type Req = {
      matchingId: number;
      step: string;
      menteeId: number;
      created: string;
      cancelAble: boolean;
    };
    const addCancelAble = result.map((req: Req) => {
      req.cancelAble = req.step !== "요청중" ? false : true;
      return { ...req };
    });
    conn.commit();
    // if (result.step !== "요청중") {
    //   result.cancelAble = false;
    // }
    // result.cancelAble = true;
    return result;
  } catch (err) {
    conn.rollback();
    console.log(err.message);
    throw new Error(`500, 서버 오류`);
  } finally {
    conn.release();
  }
};

// 일퀘 포인트+ 기회 -1
export const savePointByDayQuestQ = async (userId: number) => {
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    await conn.query(
      `
      UPDATE user
      SET 
      chance = chance- 1,
      point = point + 2
      WHERE
      id = ?
      `,
      [userId]
    );
    console.log("여기?");
    const [updateChance] = await conn.query(
      `
        SELECT 
          id,
          point,
          chance
        FROM user
        WHERE
        id = ?
        `,
      [userId]
    );
    console.log("여기?");
    conn.commit();
    const result = utils.jsonParse(updateChance)[0];
    return result;
  } catch (err) {
    conn.rollback();
    console.log(err.message);
    throw new Error(err);
  } finally {
    conn.release();
  }
};

// 회원탈퇴  유저정보 업뎃 + 이메일인증기록삭제 + 매칭중인거 삭제
export const offUserQ = async (userId: number) => {
  const conn = await db.getConnection();
  const text = "탈퇴한 회원";
  conn.beginTransaction();
  console.log("들옴?");
  try {
    await Promise.all([
      conn.query(
        `
      DELETE
      FROM email_auth
      WHERE 
        email in (SELECT email from user where ?)
      `,
        [userId]
      ),
      conn.query(
        `
        UPDATE user
        SET
          email = '${text}',
          username = '${text}',
          avatarUrl = '${"https://url.kr/7h42va"}',
          phoneNumber = "",
          gitHubUrl = "",
          point = 0
        WHERE 
          id = ?
      `,
        [userId]
      ),
      conn.query(
        `
        DELETE 
        FROM connect
        WHERE
          mentoId = ?
        `,
        [userId]
      ),
    ]);
    console.log("되어야는데..");
    conn.commit();
    return true;
  } catch (err) {
    console.log(err.message);
    conn.rollback();
  } finally {
    conn.release();
  }
};
