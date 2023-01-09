import { UpdateAlarm } from "../services";
import { db } from "./";
import * as utils from "./utils/";
import * as userRepo from "./user.repo";

type AlarmData = {
  matchRequests: MatchRequests[] | null;
  alarmData: Array<AlarmBoardsLikes | AlarmNewComments | AlarmCommentsLikes | AlarmAcceptMatch>;
};
type MatchRequests = {
  matchingId: number;
  step: string;
  menteeId: number;
  menteeName: string;
  menteeEmail: string;
  menteeAvatarUrl: string;
  created: Date;
};
type AlarmBoardsLikes = {
  type: string;
  whoIsUserId: number;
  whoIsAvatarUrl: string;
  whoIsUsername: string;
  whereBoard: number;
  created: Date;
  checkout: number;
};
type AlarmNewComments = {
  type: string;
  commentId: number;
  whoIsUserId: number;
  whoIsUsername: string;
  whoIsAvatarUrl: string;
  whereBoard: number;
  created: Date;
  checkout: number;
};
type AlarmCommentsLikes = {
  type: string;
  cmCommentId: number;
  whoIsUsername: string;
  whoIsAvatarUrl: string;
  whoIsUserId: number;
  created: Date;
  whereBoard: number;
  checkout: number;
};
type AlarmAcceptMatch = {
  mentoName: string;
  mentoAvatarUrl: string;
  created: Date;
  type: string;
};
export const getAlarmDataQ = async (userId: number): Promise<AlarmData> => {
  const [mentoReqRows] = await db.query(
    `
      SELECT 
        c.id as matchingId,
        c.step,
        c.menteeId,
        u.username as menteeName,
        u.email as menteeEmail,
        u.avatarUrl as menteeAvatarUrl,
        c.created
      FROM connect c
      JOIN user u
      ON u.id = c.menteeId
      WHERE 
        c.step = '요청중' AND mentoId = ? AND mentoComplate = 0 
      ORDER BY created DESC
  `,
    [userId]
  );

  // const metoReq = utils.jsonParse(mentoReqRows)

  const [boardsRows, commentsRows, commentsLikesRows, matchingAcceptRow, matchingSuccessRow] = await Promise.all([
    // 좋아요 찍힌 게시글 찾는 repo
    db.query(
      `
    SELECT 
      bm.id as bmBoardId,
      u.id as whoIsUserId,
      u.avatarUrl as whoIsUserAvatarUrl,
      u.username as whoIsUsername,
      bm.boardId as whereBoard,
      bm.created as created,
      bm.checkout as checkout
    FROM
      board_like_maping bm 
    JOIN 
      user u
    ON 
      u.id = bm.userId
    WHERE 
      bm.boardId IN 
        (SELECT id FROM board WHERE fromUserId=?) AND
      bm.userId != ?
    ORDER BY bm.created DESC , bm.checkout ASC 
    LIMIT 10
  `,
      [userId, userId]
    ),
    // 내게시글에 댓글 올린 것 알림
    db.query(
      `
    SELECT
      c.id as commentId,
      u.id as whoIsUserId,
      u.username as whoIsUsername,
      u.avatarUrl as whoIsUserAvatarUrl,
      c.boardId as whereBoard,
      c.created as created,
      c.checkout as checkout 
    FROM 
      comment c
    JOIN 
      user u
    ON 
      c.userId = u.id
    WHERE 
      boardId IN 
        (select id from board where fromUserId=?) AND
      c.userId != ?
    ORDER BY c.created DESC , c.checkout ASC 
    LIMIT 10
  `,
      [userId, userId]
    ),
    db.query(
      `
    SELECT 
      cm.id as cmCommentId,
      u.username as whoIsUsername,
      u.avatarUrl as whoIsUserAvatarUrl,
      u.id as whoIsUserId,
      cm.created as created,
      c.boardId as whereBoard,
      cm.checkout as checkout
    FROM comment_like_maping cm
    JOIN user u
    ON u.id = cm.userId
    JOIN comment c
    ON cm.commentId = c.id
    WHERE 
      cm.userId != ? AND
      cm.commentId IN (SELECT id FROM comment WHERE userId = ?) 
    ORDER BY cm.created DESC , cm.checkout ASC 
    LIMIT 10
  `,
      [userId, userId]
    ),
    db.query(
      `
    SELECT
      u.username as mentoName,
      u.avatarUrl as mentoAvatarUrl,
      c.created as created
    FROM connect c
    JOIN user u
    ON u.id = c.mentoId
    WHERE c.menteeId = ? AND c.step = '진행중'
    ORDER BY c.created DESC
    LIMIT 1
  `,
      [userId]
    ),
    db.query(
      `
    SELECT
      u.username as mentoName,
      u.avatarUrl as mentoAvatarUrl,
      c.created as created
    FROM connect c
    JOIN user u
    ON u.id = c.mentoId
    WHERE c.menteeId = ? AND c.step = '완료'
    ORDER BY c.created DESC
    LIMIT 1
  `,
      [userId]
    ),
  ]);
  const matchRequests = utils.jsonParse(mentoReqRows);
  const boards = utils.jsonParse(boardsRows)[0];
  const comments = utils.jsonParse(commentsRows)[0];
  const commentsLikes = utils.jsonParse(commentsLikesRows)[0];
  const matchingAccept = utils.jsonParse(matchingAcceptRow)[0];
  const matchingSuccess = utils.jsonParse(matchingSuccessRow)[0];
  const value1 = boards.map((board: AlarmBoardsLikes) => {
    return { ...board, type: "likesBoard" };
  });
  const value2 = comments.map((comment: AlarmNewComments) => {
    return { ...comment, type: "addComment" };
  });
  const value3 = commentsLikes.map((commentsLike: AlarmCommentsLikes) => {
    return { ...commentsLike, type: "likesComment" };
  });
  const value4 = matchingAccept.map((acceptMatch: AlarmCommentsLikes) => {
    return { ...acceptMatch, type: "acceptMatch" };
  });
  const value5 = matchingSuccess.map((successMatch: AlarmCommentsLikes) => {
    return { ...successMatch, type: "successMath" };
  });
  const result = [...value1, ...value2, ...value3, ...value4, ...value5];
  const alarmData = result.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()).slice(0, 10); // 트러블슈팅 ㄱㄱ
  // console.log(resultValue);
  const resultValue = {
    matchRequests,
    alarmData,
  };
  return resultValue;
};

export const updateAlarm = async (data: UpdateAlarm): Promise<true> => {
  switch (data.type) {
    case "likesBoard":
      await db.query(
        `
        UPDATE board_like_maping
        SET checkout = 1
        WHERE id = ?
      `,
        [data.bmBoardId]
      );
      break;
    case "likesComment":
      await db.query(
        `
        UPDATE comment_like_maping
        SET checkout = 1
        WHERE id = ?
        `,
        [data.cmCommentId]
      );
      break;
    default:
      await db.query(
        `
        UPDATE comment
        SET checkout = 1
        WHERE id = ?
        `,
        [data.commentId]
      );
  }
  return true;
};
