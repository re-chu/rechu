import express, { Request, Response, NextFunction } from "express";
import { tokenValidator } from "../middlewares/verify-JWT";
import {
  createResume,
  createCareer,
  createProject,
  findMyResumes,
  findMyResume,
  findCareer,
  findProject,
  updateResume,
  updateCareer,
  updateProject,
  deleteResume,
  deleteCareer,
  deleteProject,
  findSkills,
  createSkill,
} from "../services/index.service";

const resumeRoute = express();

// 1-1. 이력서 (틀) 생성
resumeRoute.post("/new-resume", tokenValidator, async (req, res, next) => {
  const userId = req.body.jwtDecoded.id;

  try {
    const newResume = await createResume(userId);

    return res.json({
      status: 201,
      msg: "이력서 생성 성공",
      data: newResume,
    });
  } catch (err) {
    next(err);
  }
});

// 1-2. 업무경험 생성
resumeRoute.post("/resumes/:resumeId/new-career", async (req, res, next) => {
  const resumeId = Number(req.params.resumeId);
  const newCareerInfo = req.body;

  try {
    const newCareer = await createCareer(resumeId, newCareerInfo);

    return res.json({
      status: 201,
      msg: "업무경험 생성 성공",
      data: newCareer,
    });
  } catch (err) {
    next(err);
  }
});

// 1-3. 프로젝트 생성
resumeRoute.post("/resumes/:resumeId/new-project", async (req, res, next) => {
  const resumeId = Number(req.params.resumeId);
  const newProjectInfo = req.body;

  try {
    const newProject = await createProject(resumeId, newProjectInfo);

    return res.json({
      status: 201,
      msg: "프로젝트 생성 성공",
      data: newProject,
    });
  } catch (err) {
    next(err);
  }
});

// 2-1. 이력서 목록 조회

// 2-2. 내 이력서 목록 조회
resumeRoute.get(
  "/resumes",
  tokenValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.jwtDecoded.id;

    try {
      const myResumes = await findMyResumes(userId);

      return res.status(200).json({
        status: 200,
        msg: "내 이력서 목록 조회 성공",
        data: myResumes,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 2-3. 이력서 상세 조회
resumeRoute.get(
  "/resumes/:resumeId",
  tokenValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.jwtDecoded.id;
    const resumeId = Number(req.params.resumeId);

    try {
      const myResume = await findMyResume(userId, resumeId);

      return res.json({
        status: 200,
        msg: "이력서 상세 정보 조회",
        data: myResume,
      });
    } catch (err) {
      next(err);
    }
  }
);

// 2-4. 업무경험 조회 (하나)
resumeRoute.get("/careers/:careerId", async (req, res, next) => {
  const careerId = Number(req.params.careerId);

  try {
    const career = await findCareer(careerId);

    return res.json({
      status: 200,
      msg: "이력서 업무경험 조회 성공",
      data: career,
    });
  } catch (err) {
    next(err);
  }
});

// 2-5. 프로젝트 조회 (하나)
resumeRoute.get("/projects/:projectId", async (req, res, next) => {
  const projectId = Number(req.params.projectId);

  try {
    const project = await findProject(projectId);

    return res.json({
      status: 200,
      msg: "이력서 프로젝트 조회 성공",
      data: project,
    });
  } catch (err) {
    next(err);
  }
});

// 3-1. 이력서 기본 정보 수정
resumeRoute.patch("/resumes/:resumeId", async (req, res, next) => {
  const resumeId = Number(req.params.resumeId);
  const updateResumeInfo = req.body;

  try {
    const updatedResume = await updateResume(resumeId, updateResumeInfo);

    return res.json({
      status: 203,
      msg: "이력서 기본정보 수정 성공",
      data: updatedResume,
    });
  } catch (err) {
    next(err);
  }
});

// 3-2. 업무경험 수정
resumeRoute.patch("/careers/:careerId", async (req, res, next) => {
  const careerId = Number(req.params.careerId);
  const updateCareerInfo = req.body;

  try {
    const updatedCareer = await updateCareer(careerId, updateCareerInfo);

    return res.json({
      status: 203,
      msg: "이력서 업무경험 수정 성공",
      data: updatedCareer,
    });
  } catch (err) {
    next(err);
  }
});

// 3-3. 프로젝트 수정
resumeRoute.patch("/projects/:projectId", async (req, res, next) => {
  const projectId = Number(req.params.projectId);
  const updateProjectInfo = req.body;

  try {
    const updatedProject = await updateProject(projectId, updateProjectInfo);

    return res.json({
      status: 203,
      msg: "이력서 프로젝트 수정 성공",
      data: updatedProject,
    });
  } catch (err) {
    next(err);
  }
});

// 4-1. 이력서 전체 삭제
resumeRoute.delete("/resumes/:resumeId", async (req, res, next) => {
  const resumeId = Number(req.params.resumeId);

  try {
    const deletedResume = await deleteResume(resumeId);

    return res.json({
      status: 203,
      msg: "이력서 삭제 성공",
      data: deletedResume,
    });
  } catch (err) {
    next(err);
  }
});

// 4-2. 업무경 험 삭제
resumeRoute.delete("/careers/:careerId", async (req, res, next) => {
  const careerId = Number(req.params.careerId);

  try {
    const deletedCareer = await deleteCareer(careerId);

    return res.json({
      status: 203,
      msg: "이력서 업무경험 삭제 성공",
      data: deletedCareer,
    });
  } catch (err) {
    next(err);
  }
});

// 4-3. 프로젝트 삭제
resumeRoute.delete("/projects/:projectId", async (req, res, next) => {
  const projectId = Number(req.params.projectId);

  try {
    const deletedProject = await deleteProject(projectId);

    return res.json({
      status: 203,
      msg: "이력서 프로젝트 삭제 성공",
      data: deletedProject,
    });
  } catch (err) {
    next(err);
  }
});

// skill List 불러오기
resumeRoute.get("/skills", async (req, res, next) => {
  try {
    const skills = await findSkills();

    return res.json({
      status: 200,
      msg: "스택 목록 조회 성공",
      data: skills,
    });
  } catch (err) {
    next(err);
  }
});

// skill 새로 생성하기
resumeRoute.post("/skills/:newSkillName", async (req, res, next) => {
  try {
    const newSkillName = req.params.newSkillName;

    const newSkill = await createSkill(newSkillName);

    return res.json({
      status: 201,
      msg: "스택 생성 성공",
      data: newSkill,
    });
  } catch (err) {
    next(err);
  }
});

export default resumeRoute;
