import {
  findOneUser,
  createResumeQ,
  createCareerQ,
  createProjectQ,
  findMyResumesQ,
  findResumeQ,
  findCareersQ,
  findProjectsQ,
  findCareerQ,
  findProjectQ,
  updateResumeQ,
  updateCareerQ,
  updateProjectQ,
  deleteResumeQ,
  deleteCareerQ,
  deleteProjectQ,
  findSkillsQ,
  createSkillQ
} from "../db/index.repo";
import {isNumber} from "class-validator";

// 1-1. 이력서 생성
export const createResume = async (userId: number): Promise<Object> => {
  let defaultResumeNameNums = [];
  let newResumeName = "";

  const userInfo = await findOneUser(userId);
  const myResumeList = await findMyResumesQ(userId);

  for (let i=0; i<Object.keys(myResumeList).length; i++) {
    const resumeNames = myResumeList[i].resumeName.split(" ");

    if (resumeNames.length == 2 && resumeNames[0] == userInfo.username && isNumber(Number(resumeNames[1]))) {
      defaultResumeNameNums.push(Number(resumeNames[1]));
    }
  }

  if (defaultResumeNameNums.length == 0) {
    newResumeName = `${userInfo.username} 1`;
  } else {
    newResumeName = `${userInfo.username} ${Math.max(...defaultResumeNameNums) + 1}`;
  }

  const newResume = await createResumeQ(userId, newResumeName);

  return newResume;
};

// 1-2. 업무경험 생성
export const createCareer = async (resumeId: number, newCareerInfo: Record<string, string | number | boolean>): Promise<Object> => {
  const newCareer = await createCareerQ(resumeId, newCareerInfo);

  return newCareer;
};

// 1-3. 프로젝트 생성
export const createProject = async (resumeId: number, newProjectInfo: Record<string, string | number | boolean>): Promise<Object> => {
  const newProject = await createProjectQ(resumeId, newProjectInfo);

  return newProject;
};

// 2-1.

// 2-2. 내 이력서 목록 조회
export const findMyResumes = async (userId: number): Promise<any> => {
  const myResumes = await findMyResumesQ(userId);

  return myResumes;
};

// 2-3. 이력서 상세 조회
export const findMyResume = async (userId: number, resumeId: number): Promise<Object> => {
  let myResume = {};

  const userInfo = await findOneUser(userId);
  const resumeInfo = await findResumeQ(resumeId);
  const careers = await findCareersQ(resumeId);
  const projects = await findProjectsQ(resumeId);

  Promise.all([userInfo, resumeInfo, careers, projects])
    .catch(error => {
      console.log(error.message);
    })

  myResume['userData'] = userInfo;
  myResume['resumeData'] = resumeInfo;
  myResume['careersData'] = careers;
  myResume['projectsData'] = projects;

  return myResume;
};

// 2-4. 업무경험 조회
export const findCareer = async (careerId: number): Promise<any> => {
  const career = await findCareerQ(careerId);

  return career;
};

// 2-5. 프로젝트 조회
export const findProject = async (projectId: number): Promise<any> => {
  const project = await findProjectQ(projectId);

  return project;
};

// 3-1. 이력서 기본정보 수정
export const updateResume = async (detailId: number, updateResumeInfo: Record<string, string | number>) => {
  const updatedResume = await updateResumeQ(detailId, updateResumeInfo);

  return updatedResume;
};

// 3-2. 업무경험 수정
export const updateCareer = async (careerId: number, updateCareerInfo: Record<string, string | number>) => {
  const updatedCareer = await updateCareerQ(careerId, updateCareerInfo);

  return updatedCareer;
};

// 3-3. 프로젝트 수정
export const updateProject = async (projectId: number, updateProjectInfo: Record<string, string | number>) => {
  const updatedProject = await updateProjectQ(projectId, updateProjectInfo);

  return updatedProject;
};

// 4-1. 이력서 삭제
export const deleteResume = async (resumeId: number) => {
  const deletedResume = await deleteResumeQ(resumeId);

  return deletedResume;
};

// 4-2. 업무경험 삭제
export const deleteCareer = async (careerId: number) => {
  const deletedCareer = await deleteCareerQ(careerId);

  return deletedCareer;
};

// 4-3. 프로젝트 삭제
export const deleteProject = async (projectId: number) => {
  const deletedProject = await deleteProjectQ(projectId);

  return deletedProject;
};

// skill list 불러오기
export const findSkills = async () => {
  const skills = await findSkillsQ();

  return skills;
}

// skill 생성
export const createSkill = async (newSkillName: string) => {
  const newskill = await createSkillQ(newSkillName);

  return newskill;
}
