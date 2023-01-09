//import bcrypt from "bcrypt";
//import { dataSource, updateUser } from "../db";
import * as adminRepo from "../db/admin.repo";
//import * as authRepo from "../db/auth.repo";
//import { CreateUserDto } from "../routes/dto";
//import jwt from "jsonwebtoken";
//import { send } from "../config/sendMail";
import { EmailAuth, UserProfile } from "../db/schemas";
import {findUsersQ, updateUserQ} from "../db/admin.repo";

// 2-0. 페이지네이션
export const findPages = async (count: number) => {
  const rows: number = await adminRepo.findPagesQ();

  const pages: number = Math.ceil(rows / count);

  return pages;
};

// 2-1. 전체 회원 목록 조회
export const findUsersAll = async () => {
  const users = await adminRepo.findUsersAllQ();

  return users;
};

// 2-2. 전체 회원 목록 조회 (페이지네이션)
export const findUsers = async (count: number, offset: number) => {
  const users = await adminRepo.findUsersQ(count, offset);

  return users;
};

// 2-3. 최악의 전체 회원 목록 조회
export const findWorstUsers = async () => {
  const worstUsers = await adminRepo.findWorstUsersQ();

  return worstUsers;
};

// 2-4. 신고 내역 조회
export const findReport = async (userId: number) => {
  const reportInfo = await adminRepo.findReportQ(userId);

  return reportInfo;
};

// 2-5. 검색
export const findUser = async (keyword: string) => {
  const findUser = await adminRepo.findUserQ(keyword);

  return findUser;
};

// 3-1. 포인트 / 비활성화
export const updateUser = async (userId: number, updateInfo: Record<string, string | number>, count: number, offset: number) => {
  const updatedUser = await adminRepo.updateUserQ(userId, updateInfo);
  const updatedUsers = await adminRepo.findUsersQ(count, offset);

  return updatedUsers;
}

// 3-2. 2주 밴
export const banUser = async (userId: number, type: string): Promise<Date> => {
  const data = {
    ban: Date.now() + 1209600000,
  };

  try {
    if (type === "BAN") {
      await adminRepo.banUserQ(userId, data, type);

      return new Date(Date.now() + 1209600000);
    }

    data.ban = 0;

    await adminRepo.banUserQ(userId, data, type);

    return new Date(Date.now());
  } catch (err) {
    console.log(err.message);
    throw new Error(`500, 서버오류`);
  }
};