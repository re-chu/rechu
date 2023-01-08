import bcrypt from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { CreateUserDto, CreateAuthDataDto, AuthEmailDto, LoginUserDto } from "./dto";
import { random } from "../config/sendMail";
import { createIndiUser, findOneUser } from "../db/user.repo";
import { avatarImg, tokenValidator, validateBody } from "../middlewares";
import { CreateReportDto } from "./dto/create-report.dto";
export const userRoute = express();
// 일퀘 - 랜덤 이력서 열람시 포인트 적립
userRoute.get("/point", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  try {
    const result = await userService.savePointByDayQuest(userId);
    return res.status(200).json({
      msg: "일퀘 완료 현재상태 : ",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**고인물 관련 */
// 포인트 상점 -
userRoute.get("/rots", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);

  try {
    const result = await userService.getRotListOrMatchingStatus(userId);
    return res.status(200).json({
      msg: "고인물찾기 or 매칭현황",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});
userRoute.post("/match", tokenValidator, async (req, res, next) => {
  const menteeId = Number(req.body.jwtDecoded.id);
  const mentoId = Number(req.body.rotId);
  console.log("고인물매칭 요청, ", menteeId, mentoId);
  try {
    const matchingId = await userService.createMatch(menteeId, mentoId);
    return res.status(200).json({
      msg: "고인물 매칭 성공",
      data: { matchingId },
    });
  } catch (err) {
    next(err);
  }
});
userRoute.delete("/match", tokenValidator, async (req, res, next) => {
  const matchingId = req.body.matchingId;
  try {
    const result = await userService.cancelMatch(matchingId);
    return res.status(200).json({
      msg: "매칭 취소",
      data: { status: result },
    });
  } catch (err) {
    next(err);
  }
});
userRoute.patch("/match", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  const matchingId = req.body.matchingId;
  const menteeID = req.body.menteeId;
  try {
    const result = await userService.acceptMatch(userId, matchingId, menteeID);
    return res.status(200).json({
      msg: "매칭 수락",
      data: { reason: result },
    });
  } catch (err) {
    next(err);
  }
});
userRoute.post("/match/success", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  const role = req.body.role;
  const matchingId = req.body.matchingId;
  if (role === "mentee" && role === "mento") {
    next(new Error(`400, role 값을 잘 입력해주세요`));
    return;
  }
  console.log(matchingId, "야 잘 들어오냐?", role);
  try {
    const result = await userService.successMatch(matchingId, role, userId);
    return res.status(200).json({
      msg: "첨삭완료",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});
//고인물이 요청들어온거 볼때
userRoute.get("/req", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  try {
    const nubList = await userService.getRequestCorrection(userId);
    return res.status(200).json({
      msg: "도움이 필요한 뉴비들",
      data: nubList,
    });
  } catch (err) {
    next(err);
  }
});

userRoute.patch("/off", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  try {
    await userService.offUser(userId);
    return res.status(200).json({
      msg: "그동안 감사했습니다.",
      data: "삭제 완료",
    });
  } catch (err) {
    next(err);
  }
});

// 회원정보 보기
userRoute.get("/individuals", tokenValidator, async (req, res, next) => {
  const { id } = req.body.jwtDecoded;
  console.log(id);
  try {
    const user = await userService.unIncludePasswordUserInfo(id);
    return res.status(200).json({
      msg: "회원정보",
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

/** 회원가입, 로그인, 정보수정, 로그아웃 */
// 개인 회원가입 라우트
userRoute.post("/individuals", validateBody(CreateUserDto), async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, phoneNumber, password } = req.body;
  console.log(req.body);
  console.log("들어옴?");
  // hash 화 된 비번
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = {
    username,
    email,
    phoneNumber,
    password: hashedPassword,
  };
  try {
    const success = await userService.join(data);
    return res.status(201).json({
      msg: "가입 완료 &_&",
      data: success,
    });
  } catch (err) {
    next(err);
  }
});
// 로그인 라우트
userRoute.post("/", validateBody(LoginUserDto), async (req, res, next) => {
  if (req.body.password === null) {
    next(new Error("400, 비밀번호를 입력해주세요."));
  }
  const { email, password } = req.body;
  try {
    const success = await userService.login(email, password);
    return res.status(200).json({
      msg: "로그인 성공",
      accessToken: success.accessToken,
      refreshToken: success.refreshToken,
      userId: success.userId,
      isAdmin: success.isAdmin,
    });
  } catch (err) {
    next(err);
  }
});
// 개인정보 수정 라우트
userRoute.patch("/individuals", tokenValidator, async (req, res, next) => {
  const id = Number(req.body.jwtDecoded.id);
  // const currentPw = req.body.currentPw;
  // if (!currentPw) next(new Error("400, 기존 비밀번호를 입력하세요."));
  const password = req.body.password;
  const phoneNumber = req.body.phoneNumber;
  const gitHubUrl = req.body.gitHubUrl;
  const avatarUrl = req.body.avatarUrl;
  const working = req.body.working;
  const chance = req.body.chance;
  const news = req.body.news;
  console.log(req.body, "dd");
  // const avatarUrl = req.body.avatarUrl;
  const toUpdate = {
    ...(password && { password }),
    ...(phoneNumber && { phoneNumber }),
    ...(avatarUrl && { avatarUrl }),
    ...(gitHubUrl && { gitHubUrl }),
    ...(working && { working }),
    ...(chance && { chance }),
    ...(news && { news }),
  };
  // 0값으로 들어오면 위 코드로 잡히지 않음.
  if (req.body.working === false) {
    toUpdate.working = 0;
  }
  if (req.body.news === 0) {
    toUpdate.news = 0;
  }
  console.log("업데이트 할 것들", toUpdate);
  try {
    const update = await userService.updateInfo(id, toUpdate);
    return res.status(200).json({
      msg: "회원정보가 수정되었습니다.",
      data: update,
    });
  } catch (err) {
    next(err);
  }
});
// 로그아웃
userRoute.patch("/sign-out", tokenValidator, async (req, res, next) => {
  const userId = Number(req.body.jwtDecoded.id);
  try {
    const result = userService.updateInfo;
    return res.status(200).json({
      msg: "로그아웃 성공",
      data: "로그아웃 성공",
    });
  } catch (err) {
    next(err);
  }
});

/** 이메일 인증 관련 */
// 회원가입시 인증번호 보내는 라우트
userRoute.post("/email", validateBody(CreateAuthDataDto), async (req, res, next) => {
  const toEmail = req.body.email;
  // 내용에 들어갈 랜덤 수
  const number = random(111111, 999999);

  try {
    await userService.sendEmail(toEmail, number);
    // 실제로 보내는 함수
    return res.status(200).json({
      msg: "전송완료 4분이내 인증을 완료해주세요.",
      data: number,
    });
  } catch (err) {
    next(err);
  }
});
// 회원가입시 이메일 인증하는 라우트
userRoute.post("/email/auth", validateBody(AuthEmailDto), async (req, res, next) => {
  try {
    const { email, code } = req.body;
    await userService.authEmail(email, code);
    return res.status(200).json({
      msg: `인증 완료`,
    });
  } catch (err) {
    next(err);
  }
});
// 임시 비번 보내기 라우트
userRoute.post("/eamil/password", validateBody(CreateAuthDataDto), async (req, res, next) => {
  const { email } = req.body;
  try {
    const newPassword = await userService.findPassword(email);
    return res.status(200).json({
      msg: `임시 비밀번호가 ${email}로 발송되었습니다.`,
      data: newPassword, // 배포시 수정 -삭제
    });
  } catch (err) {
    next(err);
  }
});

/**신고 관련 */
// 신고 여부
userRoute.get("/report", tokenValidator, async (req, res, next) => {
  const reporterUserId = Number(req.body.jwtDecoded.id);
  const defendantUserId = Number(req.query.defendantUserId);
  try {
    const result = await userService.checkReported(reporterUserId, defendantUserId);
    return res.status(200).json({
      msg: "해당 유저에 대한 신고접수 존재여부",
      data: { reported: result },
    });
  } catch (err) {
    next(err);
  }
});
// 신고하기
userRoute.post("/report", validateBody(CreateReportDto), tokenValidator, async (req, res, next) => {
  const reporterUserId = Number(req.body.jwtDecoded.id);
  const { defendantUserId, reason } = req.body;
  const data = {
    reporterUserId,
    defendantUserId,
    reason,
  };
  console.log(data);
  try {
    const result = await userService.report(data);
    return res.status(201).json({
      msg: "정상적으로 신고접수가 되었습니다.",
      data: { reported: result },
    });
  } catch (err) {
    next(err);
  }
});
// 신고 취소
userRoute.patch("/report", tokenValidator, async (req, res, next) => {
  const reporterUserId = Number(req.body.jwtDecoded.id);
  const defendantUserId = req.body.defendantUserId;
  try {
    await userService.cancelReport(reporterUserId, defendantUserId);
    return res.status(200).json({
      msg: "신고접수가 취소됐읍니다.",
      data: { reported: false },
    });
  } catch (err) {
    next(err);
  }
});

export default userRoute;
//
