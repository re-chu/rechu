import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as S from './style';
import Logo from 'assets/images/logo.png';
import { useForm } from 'react-hook-form';
import API from 'utils/api';
import { Container, ImgSection } from '../Login/style';

const Join = () => {
    const [email, setEmail] = useState();
    const [code, setCode] = useState();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormData>();

    interface FormData {
        id: string;
        password: string;
        name: string;
        phone: string;
        email: string;
        code: number;
        passwordCheck: string;
    }

    const onValid = async (data: FormData) => {
        if (data.password !== data.passwordCheck) {
            setError('passwordCheck', { message: '비밀번호가 일치하지 않습니다.' });
        }

        const jsondata = {
            email: data.email,
            password: data.password,
            username: data.name,
            phoneNumber: data.phone,
        };

        try {
            await axios.post(`${API.BASE_URL}/users/individuals`, jsondata);
            alert('회원가입이 완료되었습니다.');
            navigate('/login');
        } catch (err: any) {
            console.error(err.stack);
            if (err.response.status === 400) {
                console.log('400 Error');
                alert('이미 가입한 이메일 입니다.');
            }
        }
    };

    const onChange = (e: any) => {
        setEmail(e.target.value);
    };

    const sendEmail = async (e: any) => {
        e.preventDefault();
        const jsondata = {
            email,
        };

        try {
            const res = await axios.post(`${API.BASE_URL}/users/email`, jsondata);
            alert('이메일을 확인 해 주세요');
        } catch (err: any) {
            console.error(err.stack);
        }
    };

    const emailAuth = async (e: any) => {
        e.preventDefault();
        const jsondata = {
            email: email,
            code: Number(code),
        };

        try {
            const res = await axios.post(`${API.BASE_URL}/users/email/auth`, jsondata);

            const reqConfirm = res.data.msg;

            sessionStorage.setItem('reqConfirm', reqConfirm);
            sessionStorage.setItem('email', res.data.email);
            alert('인증 완료');
        } catch (err: any) {
            console.error(err.stack);
        }
    };

    return (
        <Container>
            <ImgSection>
                <article>
                    <img src={Logo} alt="logo" />
                </article>
            </ImgSection>

            <S.MobileDiv>
                <form onSubmit={handleSubmit(onValid)}>
                    <h1>SIGN UP</h1>
                    <div className="signWrap">
                        <ul>
                            <li>
                                <label>이메일</label>
                                <input
                                    {...register('email', {
                                        required: '이메일을 입력해주세요',
                                        pattern: {
                                            value: /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                            message: '이메일 형식만 가능합니다.',
                                        },
                                    })}
                                    placeholder="이메일 입력"
                                    autoComplete="off"
                                    value={email}
                                    onChange={onChange}
                                />
                                <p className={`${errors.email ? 'block' : 'none'}`}>
                                    <label>{errors?.email?.message}</label>
                                </p>
                            </li>

                            <li>
                                <button type="button" onClick={sendEmail}>
                                    인증번호 보내기
                                </button>
                            </li>

                            <li>
                                <input
                                    placeholder="인증번호를 입력해주세요"
                                    {...register('code')}
                                    value={code}
                                    onChange={(e: any) => {
                                        setCode(e.target.value);
                                    }}
                                ></input>
                                <button type="button" onClick={emailAuth}>
                                    인증하기
                                </button>
                            </li>

                            <li>
                                <label>비밀번호</label>
                                <input
                                    {...register('password', {
                                        required: '비밀번호를 입력해주세요',
                                        minLength: {
                                            value: 5,
                                            message: '비밀번호는 최소 5자리 이상 입력해주세요',
                                        },
                                    })}
                                    type="password"
                                    placeholder="비밀번호 입력"
                                    autoComplete="new-password"
                                />
                                <label className={`${errors.password ? 'block' : 'none'}`}>
                                    {errors?.password?.message}
                                </label>
                            </li>

                            <li>
                                <label>비밀번호 확인</label>
                                <input
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    {...register('passwordCheck', {
                                        required: '비밀번호를 입력해주세요 ',
                                        minLength: {
                                            value: 5,
                                            message: '비밀번호는 최소 5자리 이상 입력해주세요',
                                        },
                                    })}
                                />
                                <label className={`${errors.passwordCheck ? 'block' : 'none'}`}>
                                    {errors?.passwordCheck?.message}
                                </label>
                            </li>

                            <li>
                                <label>이름</label>
                                <input
                                    {...register('name', {
                                        required: '비밀번호를 입력해주세요 ',
                                    })}
                                    placeholder="이름 입력"
                                />
                            </li>

                            <li>
                                <label>휴대폰</label>
                                <input
                                    {...register('phone', {
                                        required: '비밀번호를 입력해주세요 ',
                                    })}
                                    placeholder="- 빼고 입력해주세요"
                                    maxLength={13}
                                />
                            </li>
                        </ul>

                        <div>
                            <button formAction="">회원가입</button>
                        </div>
                    </div>
                </form>
            </S.MobileDiv>
        </Container>
    );
};

export default Join;
