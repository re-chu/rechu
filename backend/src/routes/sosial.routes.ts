import express from "express";
import * as sosialService from "../services/sosial.service";

export const sosialRoute = express();
// const home = "http://localhost:5000/sosial/kakao";
// sosialRoute.get("/kakao", (req, res, next) => {
//   try {
//     const result = sosialService.kakaoStart();
//     return res.redirect(result);
//   } catch (err) {
//     console.log(err.message);
//     next(new Error(`500, 카카오 로그인서비스 도중 오류`));
//   }
// });

// sosial/kakao 로 보내는 버튼하나
// 리다이렉트 된 페이지에서 바로 api/kakao/auth 로  post 요청 보낼수 있나
// 보낼때
sosialRoute.get("/kakao/auth", async (req, res, next) => {
  const code = String(req.query.code);
  console.log(code);
  try {
    const result = await sosialService.kakaoAuth(code);
    return res.send(result);
  } catch (err) {
    console.log("kako REST API 연결실패!");
    next(new Error(`500, 카카오 로그인 실패!`));
  }
});
export default sosialRoute;

// 진영님 : 게시글 상세조회 요청주소 확인 board/:boardId/like
