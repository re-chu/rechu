import { db } from ".";
import * as userRepo from "./user.repo";
import * as resumeRepo from "./resume.repo";
import { BoardInfo } from "./schemas/board.entity";
import * as utils from "./utils";
import { TypeCareer, TypeProject } from "./schemas";

// type에 따라 자유게시판 목록
export const firstGetCommunityNoticesQ = async (type: string, count: number) => {
  let asType = "";
  if (type === "created") {
    asType = "unix_timestamp";
  }
  const [boards] = await db.query(
    `
      SELECT 
        b.id as postId,
        u.username as username,
        b.hasResumeId as hasResume,
        b.title as postTitle,
        b.content as postDescription,
        b.fromUserId as userId,
        u.avatarUrl as userProfileSrc,
        commentCnt as commentCount,
        likeCnt as likeCount,
        b.created as createdAt,
        CONCAT (
          LPAD (${asType}(b.${type}),12,0)
          ,
          LPAD (b.id,8,0)
        ) as MARK
      FROM board b
      JOIN user u
      ON b.fromUserId = u.id
      WHERE
        b.active = 1 AND
        b.hasResumeId IS NULL
      ORDER BY b.${type} DESC , b.id DESC
      LIMIT ?
      `,
    [count]
  );
  const [boardList] = await db.query(`SELECT id FROM board WHERE hasResumeId IS NULL`);
  const boardListCount = utils.jsonParse(boardList).length;
  const result = {
    boardList: utils.jsonParse(boards),
    boardListCount,
  };
  return result;
};
export const moreGetCommunityNoticesQ = async (type: string, count: number, mark: string) => {
  let asType = "";
  if (type === "created") {
    asType = "unix_timestamp";
  }
  const [boards] = await db.query(
    `
      SELECT 
        b.id as postId,
        u.username as username,
        b.hasResumeId as hasResume,
        b.title as postTitle,
        b.content as postDescription,
        b.fromUserId as userId,
        u.avatarUrl as userProfileSrc,
        commentCnt as commentCount,
        likeCnt as likeCount,
        b.created as createdAt,
        CONCAT (
          LPAD (${asType}(b.${type}),12,0),
          LPAD (b.id,8,0)
        ) as MARK
      FROM 
        board b
      JOIN 
        user u
      ON 
        b.fromUserId = u.id
      WHERE 
        b.active = 1 AND
        ${mark} >  CONCAT (
            LPAD (${asType}(b.${type}),12,0),
            LPAD (b.id,8,0)
          )
      ORDER BY 
        b.${type} DESC ,
        b.id DESC
      LIMIT ?
      `,
    [count]
  );
  const result = {
    boardList: utils.jsonParse(boards),
    boardListCount: null,
  };
  return result;
};

// type에 따라 이력서 게시판 목록
export const firstGetResumeNoticesQ = async (type: string, count: number) => {
  let asType = "";
  if (type === "created") {
    asType = "unix_timestamp";
  }
  const [boards] = await db.query(
    `
      SELECT 
        b.id as postId,
        r.position as position,
        u.username as username,
        b.hasResumeId as hasResume,
        b.title as postTitle,
        b.content as postDescription,
        b.fromUserId as userId,
        u.avatarUrl as userProfileSrc,
        commentCnt as commentCount,
        likeCnt as likeCount,
        b.created as createdAt,
        b.complate,
        CONCAT (
          LPAD (${asType}(b.${type}),12,0)
          ,
          LPAD (b.id,8,0)
        ) as MARK
      FROM board b
      JOIN user u
      ON b.fromUserId = u.id
      JOIN resume r
      ON b.hasResumeId = r.id
      WHERE
        b.active = 1 AND
        b.hasResumeId IS NOT NULL 
      ORDER BY b.${type} DESC , b.id DESC
      LIMIT ?
      `,
    [count]
  );
  const [boardList] = await db.query(`SELECT id FROM board WHERE hasResumeId IS NOT NULL`);
  const boardListCount = utils.jsonParse(boardList).length;
  const result = {
    boardList: utils.jsonParse(boards),
    boardListCount,
  };
  return result;
};
export const moreGetResumeNoticesQ = async (type: string, count: number, mark: string) => {
  let asType = "";
  if (type === "created") {
    asType = "unix_timestamp";
  }
  const [boards] = await db.query(
    `
      SELECT 
        b.id as postId,
        u.username as username,
        b.hasResumeId as hasResume,
        b.title as postTitle,
        b.content as postDescription,
        b.fromUserId as userId,
        u.avatarUrl as userProfileSrc,
        commentCnt as commentCount,
        likeCnt as likeCount,
        b.created as createdAt,
        b.complate,
        CONCAT (
          LPAD (${asType}(b.${type}),12,0),
          LPAD (b.id,8,0)
        ) as MARK
      FROM board b
      JOIN user u
      ON b.fromUserId = u.id
      JOIN resume r
      ON b.hasResumeId = r.id
      WHERE
        b.active = 1 AND
        b.hasResumeId IS NOT NULL AND
        ${mark} > CONCAT (
            LPAD (${asType}(b.${type}),12,0),
            LPAD (b.id,8,0)     
          )
      ORDER BY b.${type} DESC , b.id DESC
      LIMIT ?
      `,
    [count]
  );
  console.log("으악시바", boards);
  const result = {
    boardList: utils.jsonParse(boards),
    boardListCount: null,
  };
  return result;
};

// 메인페이지 애서 활용됨
export const findAllBoardForMainpage = async (filter: string, perPage: number) => {
  const [boards] = await db.query(
    `
    SELECT 
      b.id as postId,
      u.username as username,
      b.hasResumeId as hasResume,
      b.title as postTitle,
      b.content as postDescription,
      b.fromUserId as userId,
      u.avatarUrl as userProfileSrc,
      commentCnt as commentCount,
      likeCnt as likeCount,
      b.created as createdAt
    FROM board b
    JOIN user u
    ON b.fromUserId = u.id
    WHERE
      b.hasResumeId IS NOT NULL  AND
      b.active = 1
    ORDER BY b.${filter} DESC
    LIMIT ?
  `,
    [perPage]
  );
  const [boardList] = await db.query(`SELECT id FROM board WHERE hasResumeId IS NOT NULL`);
  const boardListCount = utils.jsonParse(boardList).length;
  const result = {
    boardList: utils.jsonParse(boards),
    boardListCount,
  };
  return result;
};

// 게시물에 달린 좋아요 전체조회
export const findLikesToBoard = async (boardId: number) => {
  const [likes] = await db.query(`select id from board_like_maping where boardId=?`, [boardId]);
  const result = utils.jsonParse(likes);
  return result;
};

// 게시물 있는지 찾는 것
export const boardStatus = async (boardId: number, userId?: null | number) => {
  const [notice] = await db.query(
    `
      SELECT *
      FROM board
      WHERE id=?
    `,
    [boardId]
  );
  const returnValue = utils.jsonParse(notice)[0];
  return returnValue;
};

type OneBoardInfo = {
  alreadyLikesThisBoard: boolean;
  boardInfo: BoardInfo;
  resumeInfo: null | {
    id: number;
    usedUserId: number;
    name: string;
    career: Array<TypeCareer>;
    projects: Array<TypeProject>;
  };
} | null;
// 상세 게시글 보기
export const findOneBoardQ = async (boardId: number, userId?: null | number): Promise<OneBoardInfo> => {
  // 이력서와 댓글의 기본값
  // const returnValue:{
  //   id: number;

  const result: OneBoardInfo = {
    alreadyLikesThisBoard: false,
    boardInfo: {
      id: 0,
      title: "",
      content: "",
      hashTags: "",
      boardCreated: undefined,
      hasResumeId: 0,
      fixed: false,
      ownUserId: 0,
      email: "",
      avatarUrl: "",
      likeCnt: 0,
      commentCnt: 0,
      active: 1,
    },
    resumeInfo: null,
  };

  // } = {}
  let id = 0;
  if (userId) {
    id = userId;
  }
  let [boardInfoRows] = await db.query(
    `SELECT 
      id,
      title,
      content, 
      hashTags, 
      created as boardCreated,
      hasResumeId, 
      fixed,
      likeCnt,
      commentCnt,
      fromUserId as ownUserId 
    From board 
    WHERE id=? AND active = 1`,
    [boardId]
  );
  // 쿼리로 받아온 배열의 length 를 사용하기 위해서 jsonParse 유틸함수를 사용함.
  const boardInfo = utils.jsonParse(boardInfoRows)[0];
  if (!boardInfo || boardInfo === undefined) return null;

  // 게시물의 오너ID로 유저검색후, 이메일과 프사정보를 넣어줌
  // 현재 보고있는 게시물에 좋아요를 눌렀는지 확인함. 받아온 userId 가 있다면
  const [userInfo, checkLikes] = await Promise.all([
    userRepo.findOneUser(boardInfo.ownUserId),
    alreadyLikesBoard(boardInfo.id, userId),
  ]);
  console.log("해당 사람이 게시글 좋아요 누름?", checkLikes);
  result.boardInfo = boardInfo;
  result.boardInfo.email = userInfo.email;
  result.boardInfo.avatarUrl = userInfo.avatarUrl;

  // 이미 게시물에 좋아요 눌렀는지 확인
  if (checkLikes) {
    result.alreadyLikesThisBoard = true;
  } else {
    result.alreadyLikesThisBoard = false;
  }

  // 게시물이 가지고 있는 이력서Id 가 있다면
  if (boardInfo.hasResumeId > 0 || boardInfo.hasResumeId !== null) {
    const resumeRows = await resumeRepo.findResumeQ(boardInfo.hasResumeId);
    console.log(resumeRows);
    console.log(typeof resumeRows);
    // 값을 수정하기 위해서 jsonParse 해야함.
    const resume = utils.jsonParse(resumeRows);
    console.log(resume);
    console.log(typeof resume);

    // 이력서가 있다면 이력서에 종속된 프로젝트와 커리어를 찾아서 각 필드에 넣어줌
    const [career, projects] = await Promise.all([
      resumeRepo.findCareersQ(resume.resumeId),
      resumeRepo.findProjectsQ(resume.resumeId),
    ]);

    // 쿼리로 날린 값에 프로젝트와 커리어를 넣고,
    // 리턴할 이력서 정보에 넣음
    resume.project = utils.jsonParse(projects);
    resume.career = utils.jsonParse(career);
    result.resumeInfo = resume;
  }

  return result;
};

// 조인X 게시물 정보 보기
export const findBoardData = async (boardId: number) => {
  const board = await db.query(`SELECT * FROM board WHERE (id=?)`, [boardId]);
  return utils.jsonParse(board)[0][0];
};

// 게시글 만들기
export const create = async (data: Record<string, string | number | boolean>): Promise<any> => {
  console.log("서비스가 받아온 data : ", data);
  const [keys, values, arrValues] = utils.insertData(data);
  const newBoard = await db.query(
    `
      INSERT 
      INTO board (${keys.join(", ")}) 
      VALUES (${values.join(",")})
  `,
    [...arrValues]
  );
  console.log(typeof newBoard);
  return newBoard[0];
};

// 게시글 수정
export const updateBoard = async (boardId: number, data: Record<string, string | number>) => {
  console.log("게시글 업데이트 내역 : ", data);
  console.log("boardID 값 : ", boardId);
  const [keys, values] = utils.updateData(data);
  await db.query(
    `
    UPDATE board 
    SET ${keys.join(", ")}, 
      fixed=true,
      updated=now()
    WHERE id = ?`,
    [...values, boardId]
  );
  return true;
};

// 게시글 삭제
export const deleteBoard = async (userId: number, boardId: number) => {
  // 보드에 연관된 포인트와 좋아요 행 삭제
  await db.query(
    `
      DELETE 
      FROM board_like_maping 
      WHERE boardId = ?
      `,
    [boardId]
  );
  console.log("게시물좋아요매핑 삭제");
  await db.query(
    `
      DELETE 
      FROM point_from_board 
      WHERE boardId = ? AND userId = ?
      `,
    [boardId, userId]
  );
  console.log("게시물 포인트테이블에서 삭제");

  // 보드에 소속된 댓글들에 관련된거 지우고, 댓글까지 지워야함
  const [comments] = await db.query(
    `
    select id as commentId 
    from comment
    where boardId = ?
    `,
    [boardId]
  );
  console.log("게시글에 달린 커맨트 id 찾음");
  const zz = utils.jsonParse(comments);
  console.log(zz);
  // 게시물에 달린 댓글들 모조리 조사해서 연관있는것들 KILL....
  await Promise.all(
    zz.map(async (comment) => {
      console.log("첫번째 id", comment.commentId);
      await db.query(`DELETE FROM comment_like_maping WHERE commentId=?`, [comment.commentId]);
      console.log("댓글 좋아요 매핑테이블에서 해당 댓글 id로 등록된것 삭제");
      await db.query(`DELETE FROM point_from_comment WHERE commentId=?`, [comment.commentId]);
      console.log("댓글 포인트테이블에서 해당 댓글 id로 등록된것 삭제");
    })
  );

  const deleteComment = await db.query(
    `
    DELETE
    FROM comment
    WHERE boardId = ? 
  `,
    [boardId]
  );
  console.log("댓글삭제");
  await db.query(
    `
      DELETE 
      FROM board 
      WHERE (id = ?)
    `,
    [boardId]
  );
  return true;
};

// 게시물ID 로 댓글 찾기

/** 해당 id의 게시물에 등록된 좋아요의  userId 배열을 반환하는 REPO */
export const alreadyLikesBoard = async (boardId: number, userId: number) => {
  const [resultRows] = await db.query(
    `
      SELECT 
        userId 
      FROM board_like_maping 
      WHERE(boardId=? AND userId=?)
    `,
    [boardId, userId]
  );
  // 리턴값이 복수이기 떄문에 배열로 반환
  const result = utils.jsonParse(resultRows)[0];
  return result;
};

// 좋아요 테이블에 board 값 추가  트렌젝션 o
export const likeBoardFromUser = async (data: Record<number, number>) => {
  const [keys, values, valval] = utils.insertData(data);
  const boardId = valval[1];
  const userId = valval[0];
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    const [compareUserId] = await conn.query(`SELECT fromUserId FROM board WHERE id = ?`, [boardId]);
    if (compareUserId[0].fromUserId !== userId) {
      conn.query(
        `
          UPDATE user
          SET news = 1
          WHERE id in (SELECT fromUserId FROM board WHERE id =?)
        `,
        [boardId]
      );
    }
    await Promise.all([
      conn.query(
        `
          INSERT 
          INTO 
          board_like_maping (${keys.join(", ")})
          VALUES (${values})
        `,
        [...valval]
      ),
      conn.query(
        `
        UPDATE board
        SET
          likeCnt = likeCnt+1
        WHERE id = ?
      `,
        [boardId]
      ),
      // 아래 쿼리는 내가 누른 좋아요가 몇개ㅑ인지 확인할때 쓰는것 근데 지금은 별 쓸일없긴함.
      conn.query(
        `
        UPDATE user
        SET
          clickedLikes = clickedLikes+1
        WHERE id = ?
      `,
        [userId]
      ),
    ]);
    conn.commit();
    return true;
  } catch (err) {
    console.log(err.message);
    conn.rollback();
    throw new Error(err);
  } finally {
    conn.release();
  }
};

export const unlikeBoardFromUser = async (userId: number, boardId: number) => {
  // 삭제에 필요한것들 userId, boardId WHERE (coulmn = ? ADN coulmn2 = ?)
  await db.query(
    `
      DELETE
      FROM board_like_maping
      WHERE (userId = ? AND boardId = ?)
    `,
    [userId, boardId]
  );

  await db.query(
    `
    UPDATE board
    SET
      likeCnt = likeCnt -1
    WHERE id = ?
  `,
    [boardId]
  );
  return true;
};

// 이미 게시글에 좋아요 했는지 확인
export const findSavedPointByBoard = async (userId: number, boardId: number) => {
  const [result] = await db.query(
    `
      SELECT userId
      FROM point_from_board
      WHERE (userId=? AND boardId=?)
    `,
    [userId, boardId]
  );
  const returnValue = utils.jsonParse(result)[0];
  return returnValue;
};

// 게시물 좋아요로 게시물 오너의 포인트가 증가됨  트렌젝션 o
export const savePointByBoard = async (data: { userId: number; boardId: number }) => {
  const [keys, values, valval] = utils.insertData(data);
  const conn = await db.getConnection();
  conn.beginTransaction();
  try {
    const [uselessValue, boardRows] = await Promise.all([
      conn.query(
        `
          INSERT INTO point_from_board (${keys.join(", ")})
          VALUES (${values.join(", ")})
        `,
        [...valval]
      ),
      conn.query(
        `
        SELECT 
          fromUserId
        FROM board
        WHERE id = ?
      `,
        [data.boardId]
      ),
    ]);
    const userId = utils.jsonParse(boardRows)[0].fromUserId;
    // 어뷰징 방지
    if (userId !== data.userId) {
      await conn.query(
        `
        UPDATE user 
        SET 
        point = point+?
        WHERE id= ?
      `,
        [5, userId]
      );
    }
    conn.commit();
    return true;
  } catch (err) {
    console.log(err.message);
    conn.rollback();
    throw new Error(err);
  } finally {
    conn.release();
  }
};

export const randomBoardsQ = async (userId: number) => {
  const [random] = await db.query(
    `SELECT id 
     FROM board 
        WHERE id not in (
            SELECT boardId FROM board_like_maping WHERE userId = ?
            )
        ORDER BY RAND() LIMIT 1`,
    [userId]
  );
  const [user] = await db.query(
    `
    SELECT 
      chance
    FROM user
    WHERE 
      id = ?
  `,
    [userId]
  );
  const boardId = utils.jsonParse(random)[0].id;
  const chance = utils.jsonParse(user)[0].chance;
  const result = {
    boardId,
    chance,
  };
  return result;
};
