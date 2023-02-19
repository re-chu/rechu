import { DatePicker } from 'antd';
import React, { useState } from 'react';
import { FormStore, WorkFormData } from 'models/resumeEdit-model';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API from 'utils/api';
import { changeWorkFormToggle } from 'store/slices/formSlice';
import { useAppDispatch, useAppSelector } from 'store/config';

type WorkFormState = {
    setAddJobElement: React.Dispatch<React.SetStateAction<FormStore[]>>;
    addJobElement: FormStore[];
    onCareerCreated: (state: []) => void;
};

const Job = ({ setAddJobElement, addJobElement, onCareerCreated }: WorkFormState) => {
    const [isStilWork, setIsStilWork] = useState<boolean>(true);

    const [workFormDataState, setWorkFormDataState] = useState<WorkFormData>({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        reward: '',
        notDevlop: false,
        workNow: false,
    });

    const workFormToggle = useAppSelector(state => state.formState.workFormToggle);
    const dispatch = useAppDispatch();

    const params = useParams();
    const resumeIds = params.id;

    const workFormHandler = (
        e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>,
    ) => {
        const target = e.target;
        const checked = isStilWork ? false : true;

        setWorkFormDataState({
            ...workFormDataState,
            workNow: checked,
            [target.name]: target.value,
        });
    };

    const workStartTimeHandler = (date: any, dateString: string) => {
        setWorkFormDataState({
            ...workFormDataState,
            startDate: dateString,
        });
    };

    const workEndTimeHandler = (date: any, dateString: string) => {
        setWorkFormDataState({
            ...workFormDataState,
            endDate: dateString,
        });
    };

    const validationForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (workFormDataState.startDate === '') {
            alert('필수정보를 입력해주세요.');
            return;
        }

        try {
            const res = await axios.post(
                `${API.BASE_URL}/my-portfolio/resumes/${resumeIds}/new-career`,
                {
                    company: workFormDataState.company,
                    position: workFormDataState.position,
                    startDate: workFormDataState.startDate,
                    endDate: workFormDataState.endDate,
                    reward: workFormDataState.reward,
                    notDevlop: workFormDataState.notDevlop,
                    workNow: workFormDataState.workNow,
                },
            );

            const insertId = res.data.data[0].insertId;
            const result = await axios.get(`${API.BASE_URL}/my-portfolio/careers/${insertId}`);

            if (res.status === 200) {
                onCareerCreated(result.data.data);
                dispatch(changeWorkFormToggle(false));
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
                            <dt>회사명</dt>
                            <dd>
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="회사 이름"
                                    value={workFormDataState.company}
                                    onChange={workFormHandler}
                                    required
                                />
                            </dd>
                        </dl>
                        <dl>
                            <dt>직무</dt>
                            <dd>
                                <input
                                    type="text"
                                    name="position"
                                    placeholder="프론트엔드"
                                    value={workFormDataState.position}
                                    onChange={workFormHandler}
                                    required
                                />
                            </dd>
                        </dl>
                        <dl className="noneDevelop">
                            <dt>
                                <input
                                    type="checkbox"
                                    name="notDevlop"
                                    onChange={e =>
                                        setWorkFormDataState({
                                            ...workFormDataState,
                                            notDevlop: e.target.checked,
                                        })
                                    }
                                />
                            </dt>
                            <dd>
                                <label>비개발 경력</label>
                            </dd>
                        </dl>
                    </li>
                </ul>

                <ul>
                    <li>
                        <dl>
                            <dt>
                                <label>입사</label>
                                <small>재직 중 </small>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isStilWork ? true : false}
                                        onClick={(): void => setIsStilWork(!isStilWork)}
                                        onChange={workFormHandler}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </dt>

                            <dd>
                                <DatePicker
                                    placeholder="YYYY-MM"
                                    picker="month"
                                    name="startDate"
                                    onChange={workStartTimeHandler}
                                />
                            </dd>
                        </dl>
                        {!isStilWork && (
                            <dl>
                                <dt>퇴사</dt>
                                <dd>
                                    <DatePicker
                                        placeholder="YYYY-MM"
                                        picker="month"
                                        name="endDate"
                                        onChange={workEndTimeHandler}
                                    />
                                </dd>
                            </dl>
                        )}
                    </li>
                </ul>

                <ul>
                    <li>
                        <label>업무 성과</label>
                    </li>
                    <li>
                        <textarea
                            maxLength={500}
                            placeholder={`구체적인 역할과 성과 위주의 글을 작성해보세요. \n수치와 함께 표현되면 경험이 잘 전달될 수 있습니다.`}
                            name="reward"
                            onChange={workFormHandler}
                        ></textarea>
                    </li>
                </ul>
            </div>

            <div className="formBtn">
                <button
                    type="button"
                    onClick={() => dispatch(changeWorkFormToggle(!workFormToggle))}
                >
                    취소
                </button>
                <button type="submit">저장</button>
            </div>
        </form>
    );
};

export default Job;
