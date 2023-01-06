import http from "http";
import express from "express";
import { errorHandler } from "./middlewares/error-handdler";
import {
  userRoute,
  adminRoute,
  boardRoute,
  rootRoute,
  commentRoute,
  sosialRoute,
  alarmRoute,
  chatRoute,
} from "./routes";
import cors from "cors";
import resumeRoute from "./routes/resume.routes";
const app = express();
const httpServer = http.createServer(app);
// import { Server } from "socket.io";
// const zz = new Server(httpServer);

// app.set("io", zz);
app.use("/uploads", express.static("uploads"));
// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/", rootRoute);
app.use("/users", userRoute);
app.use("/admin", adminRoute);
app.use("/my-portfolio", resumeRoute);
app.use("/board", boardRoute);
app.use("/comments", commentRoute);
app.use("/sosial", sosialRoute);
app.use("/alarm", alarmRoute);
app.use("/chat", chatRoute);

// 에러 미들웨어
app.use(errorHandler);

export default httpServer;
