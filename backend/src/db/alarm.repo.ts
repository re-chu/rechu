import { db } from "./";
import * as utils from "./utils/";

type AlarmData = Array<AlarmBoardsLikes | AlarmNewComments | AlarmCommentsLikes>;

type AlarmBoardsLikes = {
  type: string;
  whoIsUserId: number;
  whoIsUserAvatarUrl: string;
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
  whoIsUserAvatarUrl: string;
  whoIsUserId: number;
  created: Date;
  whereBoard: number;
  checkout: number;
};
export const getAlarmDataQ = async (userId: number): Promise<AlarmData> => {
  const [boardsRows, commentsRows, commentsLikesRows] = await Promise.all([
    // 좋아요 찍힌 게시글 찾는 repo
    db.query(
      `
    SELECT 
      u.id as whoIsUserId,
      u.avatarUrl as whoIsUserAvatarUrl,
      u.username as whoIsUser,
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
        (SELECT id FROM board WHERE fromUserId=?) 
    ORDER BY bm.created DESC , bm.checkout ASC 
    LIMIT 10
  `,
      [userId]
    ),
    // 내게시글에 댓글 올린 것 알림
    db.query(
      `
    SELECT
      c.id as commentId,
      u.id as whoIsUserId,
      u.username as whoIsUsername,
      u.avatarUrl as whoIsAvatarUrl,
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
        (select id from board where fromUserId=?)
    ORDER BY c.created DESC , c.checkout ASC 
    LIMIT 10
  `,
      [userId]
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
  ]);
  const boards = utils.jsonParse(boardsRows)[0];
  const comments = utils.jsonParse(commentsRows)[0];
  const commentsLikes = utils.jsonParse(commentsLikesRows)[0];
  const value1 = boards.map((board: AlarmBoardsLikes) => {
    return { ...board, type: "likesBoard" };
  });
  const value2 = comments.map((comment: AlarmNewComments) => {
    return { ...comment, type: "addComment" };
  });
  const value3 = commentsLikes.map((commentsLike: AlarmCommentsLikes) => {
    return { ...commentsLike, type: "likesComment" };
  });
  const result = [...value1, ...value2, ...value3];
  const resultValue = result.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()).slice(0, 10); // 트러블슈팅 ㄱㄱ
  // console.log(resultValue);
  return resultValue;
};
