import bcrypt from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import { validateBody } from "../middlewares/dto-validator";
import { tokenValidator } from "../middlewares/verify-JWT";
import { CreateUserDto, CreateAuthDataDto, AuthEmailDto, LoginUserDto } from "./dto/index.dto";
import {
    indiInfo,
    createResume,
    findMyResumes,
    createDetail,
    findDetail,
    updateResume,
    deleteResume, getMyResume,
} from "../services/index.service";
import { isNumber } from "class-validator";
import { updateNotice } from "../services/board.service";
import boardRoute from "./board.routes";
//import { findResumeList } from "../db/resume.repo";
//import { random } from "../config/sendMail";

const resumeRoute = express();

// 1. 이력서 (틀) 생성
resumeRoute.post("/new-resume", tokenValidator, async (req, res, next) => {
    const userId = req.body.jwtDecoded.id;

    try {
        const newResume = await createResume(userId);

        return res.json({
            status: 201,
            msg: "이력서 생성 성공",
            data: newResume
        });
    } catch (err) {
        next(err);
    }
})

// 2-1. 이력서 목록 조회

// 2-2. 내 이력서 목록 조회
resumeRoute.get("/resumes", tokenValidator, async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.jwtDecoded.id;

    try {
        const myResumes = await findMyResumes(userId);

        return res.status(200).json({
            status: 200,
            msg: "내 이력서 목록 조회 성공",
            data: myResumes[0],
        });
    } catch (err) {
        next(err);
    }
});

// 2-3. 이력서 상세 조회
resumeRoute.get("/resumes/:resumeId", tokenValidator, async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.jwtDecoded.id;
    const resumeId = Number(req.params.resumeId);

    try {
        const myResume = await getMyResume(userId, resumeId);

        return res.json({
            status: 200,
            msg: "이력서 상세 정보 조회",
            userData: users,
            resumeData: resumes[0],
            careerData: careers[0],
            projectData: projects[0]
        });
    } catch (err) {
        next(err);
    }
});

// 3. 이력서 (기본 정보) 수정
resumeRoute.patch("/resume/:resumeId", async (req, res, next) => {
  const resumeId = Number(req.params.resumeId);
  const updateInfo = req.body;

    try {
        const updatedResume = await updateResume(resumeId, updateInfo, "resume");

    return res.json({
      status: 203,
      msg: "이력서 수정 성공",
      data: updatedResume,
    });
  } catch (err) {
    next(err);
  }
});

// 4. 이력서 전체 삭제
resumeRoute.delete("/resume/:resumeId", async (req, res, next) => {
    const resumeId = Number(req.params.resumeId);

    try {
        const deletedCareer = await deleteResume(resumeId, "career", "all");
        const deletedProject = await deleteResume(resumeId, "project", "all");
        const deletedResume = await deleteResume(resumeId, "resume", "one");

        return res.json({
            status: 203,
            msg: "이력서 삭제 성공",
            dataCareer: deletedCareer,
            dataProject: deletedProject,
            dataResume: deletedResume
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
        const newCareer = await createDetail(resumeId, careerInfo, "career");

        return res.json({
            status: 201,
            msg: "업무경험 생성 성공",
            data: newCareer
        });
    } catch (err) {
        next(err);
    }
})

// 2. 업무경험 조회 (하나)
resumeRoute.get("/resume/career/:careerId", async (req, res, next) => {
    const careerId = Number(req.params.careerId);

    try {
        const careers = await findDetail(careerId, "career", "one");

        return res.json({
            status: 200,
            msg: "이력서 업무경험 조회 성공",
            data: careers[0]
        });
    } catch (err) {
        next(err);
    }
})

// 3. 업무경험 수정
resumeRoute.patch("/resume/career/:careerId", async (req, res, next) => {
    const careerId = Number(req.params.careerId);
    const updateInfo = req.body

    try {
        const updatedResume = await updateResume(careerId, updateInfo, "career");

        return res.json({
            status: 203,
            msg: "이력서 업무경험 수정 성공",
            data: updatedResume
        });
    } catch (err) {
        next(err);
    }
});

// 4. 업무경험 삭제
resumeRoute.delete("/resume/career/:careerId", async (req, res, next) => {
    const careerId = Number(req.params.careerId);

    try {
        const deletedResume = await deleteResume(careerId, "career", "one");

        return res.json({
            status: 203,
            msg: "이력서 업무경험 삭제 성공",
            data: deletedResume
        });
    } catch (err) {
        next(err);
    }
});

// 프로젝트
// 1. 프로젝트 생성
resumeRoute.post("/resume/project/:resumeId", async (req, res, next) => {
    const resumeId = Number(req.params.resumeId);
    const projectInfo = req.body

    try {
        const newProject = await createDetail(resumeId, projectInfo, "project");

        return res.json({
            status: 201,
            msg: "이력서 프로젝트 생성 성공",
            data: newProject
        });
    } catch (err) {
        next(err);
    }
})

// 2. 프로젝트 조회 (하나)
resumeRoute.get("/resume/project/:projectId", async (req, res, next) => {
    const projectId = Number(req.params.projectId);

    try {
        const projects = await findDetail(projectId, "project", "one");

        return res.json({
            status: 200,
            msg: "이력서 프로젝트 조회 성공",
            data: projects[0]
        });
    } catch (err) {
        next(err);
    }
})

// 3. 프로젝트 수정
resumeRoute.patch("/resume/project/:projectId", async (req, res, next) => {
    const projectId = Number(req.params.projectId);
    const updateInfo = req.body

    try {
        const updatedResume = await updateResume(projectId, updateInfo, "project");

        return res.json({
            status: 203,
            msg: "이력서 프로젝트 수정 성공",
            data: updatedResume
        });
    } catch (err) {
        next(err);
    }
});

// 4. 프로젝트 삭제
resumeRoute.delete("/resume/project/:projectId", async (req, res, next) => {
    const projectId = Number(req.params.projectId);

    try {
        const deletedResume = await deleteResume(projectId, "project", "one");

        return res.json({
            status: 203,
            msg: "이력서 프로젝트 삭제 성공",
            data: deletedResume
        });
    } catch (err) {
        next(err);
    }
});

export default resumeRoute;
