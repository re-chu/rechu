import bcrypt from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import { validateBody } from "../middlewares/dto-validator";
import {tokenValidator} from "../middlewares/verify-JWT"
import { CreateUserDto, CreateAuthDataDto, AuthEmailDto, LoginUserDto } from "./dto/index.dto";
import { findResumeList, createResume, createCareer, findCareer, createProject } from "../services/index.service";
//import { findResumeList } from "../db/resume.repo";
//import { random } from "../config/sendMail";

const resumeRoute = express();

// 1. 이력서 (틀) 생성
resumeRoute.post("/resume", tokenValidator, async (req, res, next) => {
    const userId = req.body.jwtDecoded.id;
    let resumeName = [];

    try {
        const myResumeList = await findResumeList(userId);

        for (let i=0; i<myResumeList[0].length; i++) {
            const [name, num] = myResumeList[0][i].name.split(" ");

            if (name == '')
            resumeName.push(myResumeList[0][i].name)
        }
        console.log(resumeName)
        return
        const newResume = await createResume(userId);

        return res.json({
            data: newResume,
        });
    } catch (err) {
        next(err);
    }
})

// 2. 내 이력서 목록 조회
resumeRoute.get("/myportfolio/list", tokenValidator, async (req: Request, res: Response, next: NextFunction) => { // validateBody(CreateUserDto),
    const userId = req.body.jwtDecoded.id;

    try {
        const success = await findResumeList(userId);

        return res.status(200).json({
            status: 200,
            msg: "내 이력서 목록 조회 성공",
            data: success[0],
        });
    } catch (err) {
        next(err);
    }
});

// 업무경험
// 1. 업무경험 생성
resumeRoute.post("/resume/career/:resumeId", async (req, res, next) => {
    const resumeId = Number(req.params.resumeId);
    const careerInfo = req.body

    try {
        const newCareer = await createCareer(resumeId, careerInfo);

        return res.json({
            data: newCareer,
        });
    } catch (err) {
        next(err);
    }
})

// 2. 업무경험 조회
resumeRoute.get("/resume/career/:resumeId", async (req, res, next) => {
    const resumeId = Number(req.params.resumeId);

    try {
        const Careers = await findCareer(resumeId);

        return res.json({
            data: Careers[0],
        });
    } catch (err) {
        next(err);
    }
})

// 프로젝트
// 1. 프로젝트 생성
resumeRoute.post("/resume/project/:resumeId", async (req, res, next) => {
    const resumeId = Number(req.params.resumeId);
    const projectInfo = req.body

    try {
        const newProject = await createProject(resumeId, projectInfo);

        return res.json({
            data: newProject,
        });
    } catch (err) {
        next(err);
    }
})


/*
// 로그인 서비스
// 비밀
userRoute.post("/", validateBody(LoginUserDto), async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const success = await login(email, password);
        return res.status(200).json({
            status: 200,
            msg: "로그인 성공",
            accessToken: success.accessToken,
            refreshToken: success.refreshToken,
        });
    } catch (err) {
        next(err);
    }
});

// 회원가입시 인증번호 보내는 라우트
userRoute.post("/email", validateBody(CreateAuthDataDto), async (req, res, next) => {
    const toEmail = req.body.email;
    // 내용에 들어갈 랜덤 수
    const number = random(111111, 999999);

    try {
        await sendEmail(toEmail, number);
        // 실제로 보내는 함수
        return res.status(200).json({
            status: 200,
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
        await authEmail(email, code);
        return res.status(200).json({
            status: 200,
            msg: `인증 완료`,
        });
    } catch (err) {
        next(err);
    }
});
userRoute.post("/zz", async (req, res, next) => {
    const data = req.body;
    const zz = await createIndiUser(data);
    console.log(zz);
    return res.json({
        data: zz,
    });
}); */

export default resumeRoute;
