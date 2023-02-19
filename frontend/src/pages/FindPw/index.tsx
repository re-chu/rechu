import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as S from './style';
import Logo from 'assets/images/logo.png';
import { useForm } from 'react-hook-form';
import API from 'utils/api';

const FindPw = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    interface FormData {
        email: string;
    }

    const onSubmitHandler = async (data: FormData) => {
        try {
            const res = await API.post(`/users/eamil/password`, data);

            alert('비밀번호가 전송되었습니다.');
            navigate('/login');
        } catch (err: unknown) {
            console.log(err);
        }
    };

    return (
        <S.FindPwFrame>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div>
                    <h1>임시 비밀번호 보내기</h1>
                    <ul>
                        <li>
                            <input
                                {...register('email', {
                                    required: '이메일을 입력해주세요',
                                    pattern: {
                                        value: /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                        message: '이메일 형식만 가능합니다.',
                                    },
                                })}
                                placeholder="이메일 입력"
                            />
                            <label className={`${errors.email ? 'block' : 'none'}`}>
                                {errors?.email?.message}
                            </label>
                        </li>

                        <li>
                            <button formAction="">이메일로 임시 비밀번호 보내기</button>
                        </li>
                    </ul>
                </div>
            </form>
        </S.FindPwFrame>
    );
};

export default FindPw;
