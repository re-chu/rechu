import React, { useEffect, useState } from 'react';
import {
    ResumeContainer,
    ResumeFrame,
    UserInfo,
    FormTitle,
    InputForm,
    Title,
    ExistForm,
    Background,
} from './style';
import { BiPlus } from '@react-icons/all-files/bi/BiPlus';
import { BiEdit } from '@react-icons/all-files/bi/BiEdit';
import axios, { AxiosResponse } from 'axios';
import Header from 'components/Header';
import { useParams } from 'react-router-dom';
import Job from './Job';
import Project from './Project';
import { UserData, ResumeData, FormStore, CareerData, ProjectData } from 'models/resumeEdit-model';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/config';
import API from 'utils/api';

const Resume = () => {
    const [isWorkFormToggle, setIsWorkFormToggle] = useState<boolean>(false);
    const [isprojectFormToggle, setIsProjectFormToggle] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserData>({} as UserData);
    const [resumeTitle, setResumeTitle] = useState<ResumeData>({} as ResumeData);
    const [addJobElement, setAddJobElement] = useState<FormStore[]>([]);
    const [addProjectElement, setAddProjectElement] = useState<FormStore[]>([]);
    const [createCareerData, setCreateCareerData] = useState<CareerData[]>([]);
    const [createProjectData, setCreateProjectData] = useState<ProjectData[]>([]);

    // const componentToggle = useSelector<RootState>(state => state.workFormToggle);

    const params = useParams();
    const resumeIds = params.id;
    const token = localStorage.getItem('accessToken');

    const fetchDatas = async () => {
        try {
            const res = await axios.get<
                AxiosResponse<{
                    userData: UserData;
                    resumeData: ResumeData;
                    careersData: CareerData[];
                    projectsData: ProjectData[];
                }>
            >(`${API.BASE_URL}/my-portfolio/resumes/${resumeIds}`, {
                headers: { authorization: `Bearer ${token}` },
            });
            const userInfoData = res.data.data.userData;
            const resumeTitle = res.data.data.resumeData;
            const careerData = res.data.data.careersData;
            const projectData = res.data.data.projectsData;

            setResumeTitle(resumeTitle);
            setUserInfo(userInfoData);
            setCreateCareerData(careerData);
            setCreateProjectData(projectData);
        } catch (err: unknown) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDatas();
    }, [resumeIds, token]);

    const choiceJob = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const posionValue = e.target.value;
        try {
            const res = await axios.patch(`${API.BASE_URL}/my-portfolio/resumes/${resumeIds}`, {
                position: posionValue,
            });
            setResumeTitle({ ...resumeTitle, position: posionValue });
            console.log(res, 'position position position position position');
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const resumeNameValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResumeTitle({
            ...resumeTitle,
            title: e.target.value,
        });
    };

    const resumeNameChange = async () => {
        try {
            const res = await axios.patch(`${API.BASE_URL}/my-portfolio/resumes/${resumeIds}`, {
                name: resumeTitle.title,
            });

            console.log(res);
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const addJobComponents = () => {
        const newJob = [...addJobElement, { list: addJobElement.length, state: false }];
        setAddJobElement(newJob);
        setIsWorkFormToggle(true);
    };

    const addProjectComponents = () => {
        const newProject = [...addProjectElement, { list: addProjectElement.length, state: false }];
        setAddProjectElement(newProject);
        setIsProjectFormToggle(true);
    };

    const deleteJobComponent = async (carrerId: number) => {
        await axios.delete(`${API.BASE_URL}/my-portfolio/careers/${carrerId}`);
        const flteredId = createCareerData.filter(e => e.careerId !== carrerId);
        setCreateCareerData(flteredId);
    };

    const deleteProjectComponent = async (projectId: number) => {
        await axios.delete(`${API.BASE_URL}/my-portfolio/projects/${projectId}`);
        const flteredId = createProjectData.filter(e => e.projectId !== projectId);
        setCreateProjectData(flteredId);
    };

    return (
        <>
            <Background>
                <Header />
                <ResumeContainer>
                    <ResumeFrame>
                        <UserInfo>
                            <Title>
                                <input
                                    type="text"
                                    defaultValue={resumeTitle.resumeName}
                                    onChange={resumeNameValue}
                                />
                                <span>
                                    <button type="button" onClick={resumeNameChange}>
                                        <BiEdit />
                                    </button>
                                </span>
                            </Title>
                            <div className="userFlex">
                                <ul>
                                    <li>
                                        <input
                                            type="text"
                                            placeholder="name"
                                            readOnly
                                            value={`${userInfo.username}`}
                                        />
                                    </li>
                                    <li>
                                        <small>Email</small>{' '}
                                        <input
                                            type="email"
                                            placeholder="?????????"
                                            readOnly
                                            value={`${userInfo.email}`}
                                        />
                                    </li>
                                    <li>
                                        <small>Phone</small>
                                        <input
                                            type="tel"
                                            placeholder="?????????"
                                            readOnly
                                            value={`${userInfo.phoneNumber}`}
                                        />
                                    </li>
                                </ul>
                            </div>
                        </UserInfo>
                        <InputForm>
                            <div className="inputFlex">
                                <section>
                                    <div className="positionDiv">
                                        <select
                                            onChange={choiceJob}
                                            defaultValue={
                                                resumeTitle.position === '' ? 'choice' : `position`
                                            }
                                        >
                                            <option
                                                value="choice"
                                                disabled
                                                className={
                                                    resumeTitle.position === '' ? 'block' : 'none'
                                                }
                                            >
                                                {resumeTitle.position}
                                            </option>
                                            <option value="position" disabled>
                                                ????????? ??????
                                            </option>
                                            <option>??????</option>
                                            <option>??????</option>
                                            <option>????????????</option>
                                            <option>?????????</option>
                                            <option>??????</option>
                                        </select>
                                    </div>
                                </section>

                                <section>
                                    <FormTitle>
                                        <label>????????????</label>
                                        <span
                                            onClick={() => setIsWorkFormToggle(!isWorkFormToggle)}
                                        >
                                            <BiPlus className={isWorkFormToggle ? 'rotate' : ''} />
                                        </span>
                                    </FormTitle>

                                    {createCareerData.map((tem: CareerData, idx: number) => {
                                        return (
                                            <ExistForm key={idx}>
                                                <div>
                                                    <h1>???????????? {tem.careerId}</h1>

                                                    <ul className="customBtn">
                                                        <li>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    deleteJobComponent(tem.careerId)
                                                                }
                                                            >
                                                                ??????
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="careerContent">
                                                    <ul>
                                                        <li>
                                                            {`${tem.startDate}~${
                                                                tem.workNow ? tem.endDate : '?????????'
                                                            }`}
                                                        </li>
                                                    </ul>

                                                    <ul>
                                                        <li>
                                                            <strong>{tem.company}</strong>
                                                        </li>
                                                        <li>{tem.position}</li>
                                                    </ul>

                                                    <dl>
                                                        <dt>{tem.reward}</dt>
                                                    </dl>
                                                </div>
                                            </ExistForm>
                                        );
                                    })}

                                    {isWorkFormToggle && (
                                        <Job
                                            onCareerCreated={state => {
                                                setCreateCareerData([
                                                    ...createCareerData,
                                                    ...state,
                                                ]);
                                            }}
                                            setIsWorkFormToggle={setIsWorkFormToggle}
                                            setAddJobElement={setAddJobElement}
                                            addJobElement={addJobElement}
                                        />
                                    )}
                                </section>

                                <section>
                                    <FormTitle>
                                        <label>????????????</label>
                                        <span
                                            onClick={() =>
                                                setIsProjectFormToggle(!isprojectFormToggle)
                                            }
                                        >
                                            <BiPlus
                                                className={isprojectFormToggle ? 'rotate' : ''}
                                            />
                                        </span>
                                    </FormTitle>

                                    {createProjectData.map((tem: ProjectData, idx: number) => {
                                        return (
                                            <ExistForm key={idx}>
                                                <div>
                                                    <h1>???????????? {tem.projectId}</h1>

                                                    <ul className="customBtn">
                                                        <li>
                                                            <button
                                                                type="button"
                                                                name="projectDelete"
                                                                onClick={() =>
                                                                    deleteProjectComponent(
                                                                        tem.projectId,
                                                                    )
                                                                }
                                                            >
                                                                ??????
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="projectContent">
                                                    <ul>
                                                        <li>
                                                            <strong>{tem.projectName}</strong>{' '}
                                                            <span>{tem.year}</span>
                                                        </li>
                                                        <li>{tem.skills}</li>
                                                        <li>
                                                            {tem.link1 && (
                                                                <span>Link: {tem.link1}</span>
                                                            )}
                                                            {tem.link2 && (
                                                                <span>Link: {tem.link2}</span>
                                                            )}
                                                        </li>
                                                    </ul>

                                                    <dl>
                                                        <dt>{tem.information}</dt>
                                                    </dl>
                                                </div>
                                            </ExistForm>
                                        );
                                    })}
                                    {isprojectFormToggle && (
                                        <Project
                                            setIsProjectFormToggle={setIsProjectFormToggle}
                                            setAddProjectElement={setAddProjectElement}
                                            addProjectElement={addProjectElement}
                                            onProjectCreated={state => {
                                                setCreateProjectData([
                                                    ...createProjectData,
                                                    ...state,
                                                ]);
                                            }}
                                        />
                                    )}
                                </section>
                            </div>
                        </InputForm>
                    </ResumeFrame>
                </ResumeContainer>
            </Background>
        </>
    );
};

export default Resume;
