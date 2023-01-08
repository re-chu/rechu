import { CreateBoardDto } from "./dto/create-board.dto";
import express from "express";
import * as boardService from "../services/board.service";
import * as commentService from "../services/comment.service";
import * as userService from "../services/user.service";
import { validateBody, tokenValidator } from "../middlewares";
import { CreateCommentDto } from "./dto";

export const boardRoute = express();

boardRoute.get("/random", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  try {
    const board = await boardService.randomBoards(userId);
    return res.status(200).json({
      msg: "오늘의 조회에~",
      data: board,
    });
  } catch (err) {
    next(err);
  }
});

/**type으로 최신,좋아요,댓글 순으로 리스트 반환 */
boardRoute.get("/", async (req, res, next) => {
  const filter = String(req.query.filter);
  const perPage = Number(req.query.perPage);
  const enumFilter = ["likeCnt", "commentCnt", "created"];
  if (enumFilter.includes(filter) === false || perPage <= 0) {
    next(new Error(`400, query를 확인해주세요`));
    return;
  }
  try {
    const notices = await boardService.getNoticeForMain(filter, perPage);
    return res.status(200).json({
      msg: "게시글 전체 목록 조회",
      data: notices,
    });
  } catch (err) {
    next(err);
  }
});

// 이력서 게시판의 첫 요청 및 페이지네이션
boardRoute.get("/resumes", async (req, res, next) => {
  const firstRequest = Number(req.query.firstRequest);
  const type = String(req.query.type);
  const mark = String(req.query.mark).toUpperCase();
  const count = Number(req.query.count);
  console.log(req.query);
  try {
    const result = await boardService.getResumeNotices(firstRequest, type, count, mark);
    return res.status(200).json({
      msg: "이력서 게시물 조회",
      data: { boardCount: result.boardListCount, boardList: result.boardList },
    });
  } catch (err) {
    next(err);
  }
});

// 자유 게시판의 첫 요청 및 페이지네이션
boardRoute.get("/community", async (req, res, next) => {
  const firstRequest = Number(req.query.firstRequest);
  const type = String(req.query.type);
  const mark = String(req.query.mark).toUpperCase();
  const count = Number(req.query.count);
  const accessType = ["likeCnt", "created"];
  if (accessType.includes(type) === false || count < 2) {
    next(new Error(`404, 입력정보를 정확히 입력해주세요.`));
    return;
  }

  try {
    const result = await boardService.getCommunityNotices(firstRequest, type, count, mark);
    console.log("wegwegwegwegweg", result);
    return res.status(200).json({
      msg: "자유게시물입니다.",
      data: { boardCount: result.boardListCount, boardList: result.boardList },
    });
  } catch (err) {
    next(err);
  }
});

// 게시물 상세조회
boardRoute.get("/:id/", async (req, res, next) => {
  const id = Number(req.params.id);
  let userId = null;
  // 혹시라도 토큰을 넣어서 보냈더라면 검증해주고 userId에 id값 넣기
  if (req.query.lifeIsGood) {
    userId = Number(req.query.lifeIsGood);
  }
  try {
    const notice = await boardService.findOneBoard(id, userId);
    return res.status(200).json({
      msg: "찾아냈습니다.",
      data: notice,
    });
  } catch (err) {
    next(err);
  }
});

// 게시글 작성 API
boardRoute.post("/", validateBody(CreateBoardDto), tokenValidator, async (req, res, next) => {
  // console.log(req.file);
  const { id } = req.body.jwtDecoded;
  const { title, content, hashTags } = req.body;
  let { resumeId } = req.body;
  if (resumeId === 0) resumeId = null;
  const data: Record<string, string | boolean | number> = {
    fromUserId: id,
    content,
    title,
    hashTags,
    hasResumeId: resumeId,
  };
  console.log("바디의 데이터 : ", data);
  try {
    const result = await boardService.postNotice(data);
    return res.status(201).json({
      msg: "게시글 생성 완료",
      data: result.insertId,
    });
  } catch (err) {
    next(err);
  }
});

// 게시글 수정 API
boardRoute.patch("/:boardId", tokenValidator, async (req, res, next) => {
  const boardId = Number(req.params.boardId);
  const fromUserId = Number(req.body.jwtDecoded.id);
  const content = req.body.content;
  const title = req.body.title;
  const hashTags = req.body.hashTags;
  const complate = req.body.complate;
  let hasResumeId = req.body.resumeId;
  if (hasResumeId === 0) hasResumeId = null;
  const toUpdate = {
    ...(content && { content }),
    ...(title && { title }),
    ...(hashTags && { hashTags }),
    ...(complate && { complate }),
  };
  console.log(
    "프론트에서 받은 데이터",
    `boardId = ${boardId} fromUserId = ${fromUserId} content = ${content} title = ${title} hashTags = ${hashTags} complate = ${complate}`
  );
  try {
    const udated = await boardService.updateNotice(boardId, fromUserId, toUpdate);
    return res.status(200).json({
      status: 200,
      msg: "게시글이 수정되었습니다",
      data: udated,
    });
  } catch (err) {
    console.log("으악 에러야 ", err);
    next(err);
  }
});

// 게시글 좋아요 API
// import { wsServer } from "../server";
boardRoute.patch("/:boardId/like", tokenValidator, async (req, res, next) => {
  const id = Number(req.body.jwtDecoded.id);
  const boardId = Number(req.params.boardId);
  const { likesStatus } = req.body;
  console.log("userID ", id, "boardId", boardId, likesStatus);
  // })
  try {
    const likes = await boardService.addLikes(id, boardId, likesStatus);
    return res.status(200).json({
      msg: `좋아요 상태 : ${likes} `,
      data: `ok`,
    });
  } catch (err) {
    next(err);
  }
});

// 게시글 삭제 API
boardRoute.delete("/:boardId", tokenValidator, async (req, res, next) => {
  const { id } = req.body.jwtDecoded;
  const boardId = Number(req.params.boardId);
  try {
    await boardService.deleteNotice(id, boardId);
    return res.status(200).json({
      msg: "삭제 완료",
    });
  } catch (err) {
    next(err);
  }
});

// 댓글달기
boardRoute.post("/:boardId/comments", validateBody(CreateCommentDto), tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  const boardId = Number(req.params.boardId);
  const { text } = req.body;
  const data = {
    userId,
    boardId,
    text,
  };
  try {
    const result = await commentService.addComment(data);
    return res.status(201).json({
      msg: "댓글이 달렸습니다.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// 댓글 삭제
boardRoute.delete("/:boardId/comments/:commentId", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  const boardId = Number(req.params.boardId);
  const commentId = Number(req.params.commentId);

  try {
    const result = await commentService.deleteComment(userId, boardId, commentId);
    return res.status(200).json({
      msg: "댓글 삭제 완료",
      data: "ok",
    });
  } catch (err) {
    next(err);
  }
});

boardRoute.get("/:boardId/comments", async (req, res, next) => {
  const boardId = Number(req.params.boardId);
  const mark = String(req.query.mark);
  const count = Number(req.query.count);
  const userId = Number(req.query.lifeIsGood);
  const firstRequest = Number(req.query.firstRequest);
  try {
    const result = await commentService.moreCommentsPagenation(firstRequest, boardId, userId, count, mark);
    return res.status(200).json({
      msg: "댓글 페이지네이션",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export default boardRoute;
