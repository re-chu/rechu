import { CreateBoardDto } from "./dto/create-board.dto";
import express from "express";
import { getNoticeAll, getOneNotice, postNotice, updateNotice } from "../services/board.service";
import { validateBody, tokenValidator } from "../middlewares/index.middleware";

const boardRoute = express();
boardRoute.get("/all", async (req, res, next) => {
  try {
    const notices = await getNoticeAll();
    return res.status(200).json({
      status: 200,
      msg: "게시글 전체 목록 조회",
      data: notices,
    });
  } catch (err) {
    next(err);
  }
});

boardRoute.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const Notice = await getOneNotice(id);
    return res.status(200).json({
      status: 200,
      msg: "찾아냈습니다.",
      data: Notice,
    });
  } catch (err) {
    next(err);
  }
});

boardRoute.post("/jwttest", tokenValidator, (req, res) => {
  console.log("req.body ", req.body);
  return res.json({ data: req.headers });
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
    const result = await postNotice(data);
    return res.status(201).json({
      status: 200,
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
  let hasResumeId = req.body.resumeId;
  if (hasResumeId === 0) hasResumeId = null;
  const toUpdate = {
    ...(content && { content }),
    ...(title && { title }),
    ...(hashTags && { hashTags }),
  };

  try {
    const udated = await updateNotice(boardId, fromUserId, toUpdate);
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

boardRoute.post("/comment/:boardId", tokenValidator, async (req, res, next) => {
  const userId = req.body.jwtDecoded.id;
  const boardId = req.params.boardId;
  const { content } = req.body;
  const data = {
    userId,
    boardId,
    content,
  };
  try {
  } catch (err) {
    next(err);
  }
});
export default boardRoute;
