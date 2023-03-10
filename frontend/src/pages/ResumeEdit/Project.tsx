import React, { useEffect, useState } from 'react';
import { ProjectFormData, FormStore } from 'models/resumeEdit-model';
import axios, { AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';
import { GiCancel } from '@react-icons/all-files/gi/GiCancel';
import API from 'utils/api';

type ProjectFormState = {
    setIsProjectFormToggle: React.Dispatch<React.SetStateAction<boolean>>;
    setAddProjectElement: React.Dispatch<React.SetStateAction<FormStore[]>>;
    addProjectElement: FormStore[];
    onProjectCreated: (state: any) => void;
};

const Project = ({
    setIsProjectFormToggle,
    addProjectElement,
    setAddProjectElement,
    onProjectCreated,
}: ProjectFormState) => {
    const [searchStackToggle, setSearchStackToggle] = useState<boolean>(false);
    const [AllStacks, setAllStacks] = useState([]);
    const [stackInputValue, setStackInputValue] = useState<string>('');
    const [tagListItem, setTagListItem] = useState<string[]>([]);
    const [projectFormDataState, setProjectFormDataState] = useState<ProjectFormData>({
        projectName: '',
        year: '',
        information: '',
        link1: '',
        link2: '',
        stacks: [],
    });

    const params = useParams();
    const resumeIds = params.id;

    const getStack = async () => {
        try {
            const res = await axios.get<AxiosResponse>(`${API.BASE_URL}/my-portfolio/skills`);
            const data = res.data.data;
            setAllStacks(data);
        } catch (err: unknown) {
            console.log(err);
        }
    };
    useEffect(() => {
        getStack();
    }, []);

    const changeStackValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setStackInputValue(e.target.value);
    };

    const enterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') e.preventDefault();
    };

    const searchStackBlur = (e: React.FocusEvent<HTMLElement>) => {
        setSearchStackToggle(!searchStackToggle);
    };

    const addTagList = (tagItem: string, idx: number) => {
        const newTagItem = new Set<string>([...tagListItem]);
        newTagItem.add(tagItem);
        setTagListItem([...newTagItem]);
    };

    const stackFilter = AllStacks.filter((tem: { name: string; skillId: number }) =>
        tem.name.toLowerCase().includes(stackInputValue.toLowerCase()),
    );

    const deleteTagItem = (idx: number) => {
        const filterTagItem = tagListItem.filter((tem, id) => id !== idx);
        setTagListItem(filterTagItem);
    };

    const projectFormHandler = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
            | React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const target = e.target;
        setProjectFormDataState({
            ...projectFormDataState,
            [target.name]: target.value,
        });
    };

    useEffect(() => {
        setProjectFormDataState({
            ...projectFormDataState,
            stacks: [...tagListItem],
        });
    }, [tagListItem]);

    // const deleteProjectForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     const deleteFilter = addProjectElement.filter((tem: FormStore) => tem.list !== idx);
    //     setAddProjectElement(deleteFilter);
    //     if (deleteFilter.length === 0) setIsProjectFormToggle(e => !e);
    // };

    const validationForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (projectFormDataState.year === '') {
            alert('?????? ????????? ??????????????????.');
            return;
        }

        try {
            const res = await axios.post(
                `${API.BASE_URL}/my-portfolio/resumes/${resumeIds}/new-project`,
                {
                    projectName: projectFormDataState.projectName,
                    year: projectFormDataState.year,
                    information: projectFormDataState.information,
                    link1: projectFormDataState.link1,
                    link2: projectFormDataState.link2,
                    skills: projectFormDataState.stacks,
                },
            );

            const insertId = res.data.data[0].insertId;
            const result = await axios.get(`${API.BASE_URL}/my-portfolio/projects/${insertId}`);

            if (res.status === 200) {
                onProjectCreated(result.data.data);
                setIsProjectFormToggle(false);
            }
        } catch (err: unknown) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={validationForm}>
            <div className="formWrap">
                <ul>
                    <li>
                        <dl>
                            <dt>???????????? ??????</dt>
                            <dd>
                                <input
                                    type="text"
                                    placeholder="???????????? ????????? ??????????????????."
                                    name="projectName"
                                    onChange={projectFormHandler}
                                    required
                                />
                            </dd>
                        </dl>
                        <dl>
                            <dt>?????? ??????</dt>
                            <dd>
                                <select onChange={projectFormHandler} name="year">
                                    <option value="none">?????? ??????</option>
                                    <option>2023</option>
                                    <option>2022</option>
                                    <option>2021</option>
                                    <option>2020</option>
                                    <option>2019</option>
                                    <option>2018</option>
                                    <option>2017</option>
                                    <option>2016</option>
                                    <option>2015</option>
                                    <option>2014</option>
                                    <option>2013</option>
                                    <option>2012</option>
                                    <option>2011</option>
                                    <option>2010</option>
                                    <option>2009</option>
                                    <option>2008</option>
                                    <option>2007</option>
                                    <option>2006</option>
                                    <option>2005</option>
                                    <option>2004</option>
                                    <option>2003</option>
                                    <option>2002</option>
                                    <option>2001</option>
                                    <option>2000</option>
                                </select>
                            </dd>
                        </dl>
                    </li>
                </ul>

                <ul>
                    <li>
                        <label>?????? ?????? ??????</label>
                    </li>

                    <li>
                        {tagListItem.map((tem, idx) => {
                            return (
                                <div key={idx} className="stackList">
                                    <span>{tem}</span>
                                    <button type="button" onClick={(): void => deleteTagItem(idx)}>
                                        <GiCancel />
                                    </button>
                                </div>
                            );
                        })}
                        <input
                            type="text"
                            placeholder="?????? ??????"
                            onFocus={() => setSearchStackToggle(!searchStackToggle)}
                            onKeyPress={enterKeyPress}
                            onChange={changeStackValue}
                        />
                        <article
                            className={searchStackToggle ? 'block' : 'none'}
                            onBlur={searchStackBlur}
                        >
                            {stackFilter.length === 0 &&
                                AllStacks.map((stack: { name: string }, idx: number) => {
                                    return (
                                        <dl key={idx}>
                                            <dt>{stack.name}</dt>
                                        </dl>
                                    );
                                })}
                            {stackFilter.map((tem: { name: string }, idx: number) => {
                                return (
                                    <dl key={idx}>
                                        <dt onClick={() => addTagList(tem.name, idx)}>
                                            {tem.name}
                                        </dt>
                                    </dl>
                                );
                            })}
                        </article>
                    </li>
                </ul>

                <ul>
                    <li>
                        <label>???????????? ?????? ??????</label>
                    </li>
                    <li>
                        <textarea
                            maxLength={500}
                            placeholder="?????????????????? ?????? ??????, ???????????? ????????? ?????????????????? ????????????."
                            name="information"
                            onChange={projectFormHandler}
                        ></textarea>
                    </li>
                </ul>

                <section style={{ paddingTop: '3.2rem' }}>
                    <ul>
                        <li>
                            <label>?????????</label>
                        </li>
                        <li style={{ paddingBottom: '1.6rem' }}>
                            <input
                                type="email"
                                placeholder="URL"
                                name="link1"
                                onChange={projectFormHandler}
                            />
                        </li>
                        <li>
                            <input
                                type="email"
                                placeholder="URL"
                                name="link2"
                                onChange={projectFormHandler}
                            />
                        </li>
                    </ul>
                </section>

                <div className="formBtn">
                    <button type="button" onClick={() => setIsProjectFormToggle(e => !e)}>
                        ??????
                    </button>
                    <button type="submit">??????</button>
                </div>
            </div>
        </form>
    );
};

export default Project;
