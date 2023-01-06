import bcrypt from "bcrypt";
import { dataSource, db, updateUser } from "../db";
import * as userRepo from "../db/user.repo";
import * as authRepo from "../db/auth.repo";
import { CreateUserDto } from "../routes/dto";
import jwt from "jsonwebtoken";
import { send } from "../config/sendMail";
import { EmailAuth, UserProfile } from "../db/schemas";

// 매칭 관련
export const getRotListOrMatchingStatus = async (userId: number): Promise<userRepo.RotList | userRepo.MatchInfo> => {
  try {
    const connect = await userRepo.findMatchQ(userId);
    if (!connect.matchInfo) {
      console.log("고인물 리스트 리턴 로직");
      const list = await userRepo.getRotListQ(userId);
      return list;
    }
    // 이미 매칭중이라면 리스트 X 현재 매칭정보 O
    return connect;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버오류`);
  }
};
export const createMatch = async (menteeId: number, mentoId: number): Promise<number> => {
  const data = {
    step: "요청중",
    menteeId,
    mentoId,
  };
  try {
    const alreadyMatch = await userRepo.findMatchQ(menteeId);
    console.log("alreadyMatch", alreadyMatch);
    if (alreadyMatch.matchInfo) throw new Error(`이미 요청한 고인물입니다.`);
    const matchingId = await userRepo.createMatchQ(data);
    return matchingId;
  } catch (err) {
    console.log(err.message);
    if (err.message === "이미 요청한 고인물입니다.") throw new Error(`400, 고인물 요청을 이미 했습니다.`);
    throw new Error(`500, 서버오류`);
  }
};
export const cancelMatch = async (matchingId: number) => {
  try {
    const isMatch = await userRepo.findMatchByMatchingId(matchingId);
    if (!isMatch) throw new Error("존재하지 않은 매칭입니다.");

    const deleteMatch = await userRepo.cancelMatchQ(matchingId);
    return deleteMatch;
  } catch (err) {
    console.log(err.message);
    if (err.message === "존재하지 않은 매칭입니다.") throw new Error(`404, 존재하지 않은 매칭입니다.`);
    throw new Error(`500, 서버 오류`);
  }
};
export const acceptMatch = async (userId: number, matchingId: number, menteeId: number) => {
  try {
    const mentoInfo = await userRepo.unIncludePasswordUserInfoQ(userId);
    if (mentoInfo.point < 200) throw new Error(`당신은 고이지 않았다.`);
    const result = await userRepo.acceptMatchQ(matchingId, menteeId);
    return result;
  } catch (err) {
    console.log(err.message);
    if (err.message === "당신은 고이지 않았다.") throw new Error(`400, 당신은 고이지 않았따.`);
    throw new Error(`500, 서버 오류`);
  }
};
export const successMatch = async (matchingId: number, role: string, userId: number): Promise<string> => {
  const data: { role: string; deleteMenteeIdQuery?: string } = {
    role: "",
    deleteMenteeIdQuery: "",
  };
  switch (role) {
    case "mento":
      data.role = "mentoComplate";
      break;
    default:
      data.role = "menteeComplate";
      data.deleteMenteeIdQuery = ", menteeId = 0";
      break;
  }

  try {
    const success = await userRepo.successMatchQ(matchingId, data, userId);
    const matchInfo = await userRepo.findMatchByMatchingId(matchingId);
    const menteeComplate = Number(matchInfo.menteeComplate);
    const mentoComplate = Number(matchInfo.mentoComplate);
    console.log(mentoComplate, menteeComplate, matchInfo);
    if (mentoComplate > 0 && menteeComplate > 0) {
      console.log("ㅋㅋ");
      console.log(matchingId, "이거 뭐냐고");
      const complateMatch = await userRepo.complateMatch(matchingId);
      console.log(complateMatch);
      return complateMatch;
    }
    return success;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버 오류`);
  }
};
export const getRequestCorrection = async (userId: number) => {
  try {
    console.log(userId);
    const list = await userRepo.getRequestCorrectionQ(userId);
    console.log("zzz");
    return list;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버 오류`);
  }
};

export const getUserList = async () => {
  try {
    // 일반사용자가 회원조회하는 경우는 이력서 첨삭요청할때 고인물들 목록 보는것 뿐임
    const rot = await userRepo.getUsersWhereRot();
    return rot;
  } catch (err) {
    throw new Error(`500, 서버오류`);
  }
};

// 유저한명정보 불러오기 섭스
export const individualInfo = async (userIdOrEmail: number | string): Promise<UserProfile> => {
  const user = await userRepo.findOneUser(userIdOrEmail);
  return user;
};

// 클라에서 쓸 서비스
export const unIncludePasswordUserInfo = async (userIdOrEmail: number | string): Promise<UserProfile> => {
  const user = await userRepo.unIncludePasswordUserInfoQ(userIdOrEmail);
  return user;
};

// 회원가입 서비스
export const join = async (data: CreateUserDto): Promise<{ insertId: number }> => {
  // 우선 인증을 완료했는지 검증,
  const inserData = {
    email: data.email,
    password: data.password,
    username: data.username,
    phoneNumber: data.phoneNumber,
  };
  const statusVerify = await authRepo.findOneAuthData(data.email);
  console.log(statusVerify);
  if (!statusVerify) throw Error(`404, [${data.email}] 해당 이메일로 진행된 인증절차가 없습니다.`);
  if (statusVerify.verify === false || !statusVerify)
    throw Error(`404, [${data.email}] 해당 이메일에 대한 인증 내역을 확인할 수 없습니다.`);

  // 이미 가입한 회원이지 확인,
  const overlapUser = await userRepo.findOneUser(data.email);
  if (overlapUser) throw Error("400, 이미 가입한 회원입니다.");

  // 검증끝났으면 만들어!
  const newUser = await userRepo.createIndiUser(inserData);
  return newUser;
};

// 로그인 서비스
export const login = async (email: string, password?: string) => {
  // 가입한 이메일 있는지 확인
  const user = await userRepo.findOneUser(email);
  if (!user) throw Error(`404, ${email}로 가입한 회원이 없습니다.`);
  // 비밀번호 일치하는지 확인
  if (user.howToLogin === "local" && password && user.password !== null) {
    const existence = user.password;
    const comparePw = await bcrypt.compare(password, existence);
    if (!comparePw) throw Error(`400, 비밀번호가 일치하지 않습니다.`);
  }
  console.log(user.ban - Date.now());
  if ((user.ban && user.ban - Date.now() >= 0) || user.active) {
    throw new Error(`400, 당신의 정지기간은 ${new Date(user.ban)} 까지입니다.`);
  }
  // 로그인시작 - JWT 발급해야함
  // accessToken 은 10분, refreshToken 은 하루동안 유효
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      type: "AT",
    },
    process.env.JWT_SECRET_KEY || "secret",
    { expiresIn: 60 * 60 * 24 } // 수정해야함
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      type: "RT",
    },
    process.env.JWT_SECRET_KEY || "secret",
    { expiresIn: 60 * 60 * 24 }
  );
  const data = {
    RT: refreshToken,
    ban: 0,
  };

  // RT 교체
  await userRepo.updateUser(user.id, data);
  // 옵젝으로 묶어서 리턴
  const result = {
    accessToken,
    refreshToken,
    userId: user.id,
    isAdmin: false,
  };
  if (user.role === "admin") {
    result.isAdmin = true;
  }
  return result;
};

// 정보수정 서비스
export const updateInfo = async (id: number, data: Record<string, string>, currentPw?: string): Promise<boolean> => {
  // 비밀번호 일치 여부
  try {
    // 변경하려는 유저가 없는 예외
    const user = await userRepo.findOneUser(id);
    if (!user) throw new Error("404, 유저정보를 찾을 수 없습니다. 관리자에게 문의하세요.");

    // const existence = user.password;
    // const comparePw = await bcrypt.compare(currentPw, existence);
    // if (!comparePw) throw Error(`400, 비밀번호를 확인해 주세요.`);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    await updateUser(id, data);
  } catch (err) {
    console.log(err.message);
    throw Error("500, 서버 오류");
  }

  return true;
};

export const logout = async (id: number, data: { RT: null }): Promise<boolean> => {
  try {
    await userRepo.updateUser(id, data);
    return true;
  } catch (err) {
    console.log("로그아웃 서비스중 에러", err);
    throw new Error(`500, 서버오류`);
  }
};

// 임시 비밀번호 보내기 서비스
export const findPassword = async (email: string): Promise<boolean | string> => {
  const user = await userRepo.findOneUser(email);

  if (!user) throw Error(`404, ${email}로 가입한 유저는 없습니다.`);
  const randomStr = Math.random().toString(36).substring(2, 12);
  const hashedPassword = await bcrypt.hash(randomStr, 10);
  const data = { password: hashedPassword };
  try {
    await updateUser(user.id, data);
  } catch (err) {
    throw Error("500, 서버에 오류가 생겼습니다.");
  }

  const mailInfo = {
    from: "jinytree1403@naver.com",
    to: email,
    subject: "[헤드헌터] 비밀번호 발송 ",
    text: `      
    헤드헌터 ${email} 
    
    임시 비밀번호 :  ${randomStr}
    
    빠른 시일 내로 비밀번호를 변경하시길 바랍니다.
    `,
  };
  //발송
  // 아래 try/catch 문은 배포시 삭제해야함. 네이버로그인이 안되는것에 대한 오류를 잡은것.
  try {
    send(mailInfo);
    return randomStr;
  } catch (err) {
    return true;
  }
};

// 회원가입시 이메일 인증 부분
export const sendEmail = async (toEmail: string, number?: number) => {
  const overlap = await authRepo.findOneAuthData(toEmail);
  // 인증 시도한 적이 없다면 생성
  if (!overlap) {
    await authRepo.createAuthData(toEmail, number);
  } else {
    // 재시도라면 업데이트
    await authRepo.updateAuthData(toEmail, number);
  }
  // 이메일 내용
  const mailInfo = {
    from: "jinytree1403@naver.com",
    to: toEmail,
    subject: "[헤드헌터] 인증번호 발송 ",
    text: `      
    헤드헌터 회원가입 인증번호
    
    인증번호 입력란에 ${number} 를 입력해주세요.`,
  };
  //발송
  // 아래 try/catch 문은 배포시 삭제해야함. 네이버로그인이 안되는것에 대한 오류를 잡은것.
  try {
    send(mailInfo);
    return;
  } catch (err) {
    return;
  }
};

export const authEmail = async (email: string, code: number) => {
  // 우선 해당하는 이메일 찾아서
  const statusVerify = await authRepo.findOneAuthData(email);
  if (!statusVerify) throw Error(`404, [${email}] 해당 이메일로 인증번호가 보내지지 않았습니다.`);
  if (statusVerify.code !== code) throw Error(`400, 입력된 코드가 올바르지 않습니다.`);
  // 4분안에 인증했을 경우
  if (statusVerify.time.getTime() + 300000 - Date.now() <= 0)
    throw Error(`400, 인증시간이 지났습니다. 인증번호를 재발급 해주세요.`);
  statusVerify.verify = true;
  await dataSource.getRepository(EmailAuth).save(statusVerify);
  return;
  // 이메일의 verify 상태가 false? 그럼 에러
};

// 신고여부
export const checkReported = async (reporter: number, defendant: number): Promise<boolean> => {
  try {
    const checked = await userRepo.checkReportedQ(reporter, defendant);
    console.log(checked);
    if (checked) return true;
    return false;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500 , 서버 오류`);
  }
};

// 신고하기
export const report = async (data: {
  reporterUserId: number;
  defendantUserId: number;
  reason: string;
}): Promise<boolean> => {
  try {
    console.log("신고하기 ");
    const alreadyReport = await userRepo.checkReportedQ(data.reporterUserId, data.defendantUserId);
    if (alreadyReport) throw new Error(`이미 신고한 게시글입니다.`);
    await userRepo.reportQ(data);
    return true;
  } catch (err) {
    console.log(err.message);
    if (err.message === "이미 신고한 게시글입니다.") throw new Error(`400, 이미 신고한 게시글입니다.`);
    throw new Error(`500 , 서버 오류`);
  }
};

// 신고취소
export const cancelReport = async (reportId: number, defendantId: number) => {
  try {
    const alreadyReport = await userRepo.checkReportedQ(reportId, defendantId);
    if (!alreadyReport) throw new Error(`신고하려는 사람이 없는디요`);
    console.log("취소하기 ");
    const cancel = await userRepo.cancelReportQ(reportId, defendantId);
    return cancel;
  } catch (err) {
    console.log(err.message);
    if (err.message === "신고하려는 사람이 없는디요") throw new Error(`400, 신고하려는 사람이 없는디요`);
    throw new Error(`500, 서버오류`);
  }
};

export const savePointByDayQuest = async (userId: number) => {
  try {
    const user = await unIncludePasswordUserInfo(userId);
    if (user.chance === 0) throw new Error(`잔여횟수가 없습니다.`);
    const success = await userRepo.savePointByDayQuestQ(userId);
    return success;
  } catch (err) {
    console.log(err.message);
    if (err.message === "잔여횟수가 없습니다.") throw new Error(`400, 잔여횟수가 없습니다.`);
    throw new Error(`500, 서버 오류`);
  }
};

export const offUser = async (userId: number) => {
  try {
    await userRepo.offUserQ(userId);
    return true;
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버오류`);
  }
};
