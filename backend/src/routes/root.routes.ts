import express, { request } from "express";
import * as middlewares from "../middlewares/multer";
import sharp from "sharp";
import fs from "fs";
export const rootRoute = express();
rootRoute.get("/", () => console.log("ㅎㅇ"));
rootRoute.post("/file/url", middlewares.boardImg.single("image"), (req, res, next) => {
  try {
    sharp(req.file.path)
      .resize({ width: 600 })
      .withMetadata()
      .toBuffer((err, buffer) => {
        if (err) throw new Error(`500, 이미지 저장중 오류`);
        // 새로저장
        fs.writeFile(req.file.path, buffer, (err) => {
          if (err) throw new Error(`500, 파일 저장중 오류`);
        });
      });
    return res.status(200).json({
      imageUrl: req.file.path,
    });
  } catch (err) {
    next(err);
  }
});

// 게시물이 생성되기전 취소되거나 갑작스러운 종료시 요청
rootRoute.post("/file/cancel", async (req, res, next) => {
  //
  const { pathArr } = req.body;
  console.log(pathArr);
  try {
    for (let i = 0; i < pathArr.length; i++) {
      console.log(`${i + 1}번째 이미지파일 삭제중`);
      fs.unlink(`${pathArr[i]}`, (err) => {
        if (err) throw new Error(`500, 파일 삭제중 오류`);
        console.log("삭제완료");
      });
    }
  } catch (err) {
    next(err);
  }
});
export default rootRoute;
