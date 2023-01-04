import { useCallback } from 'react';
import { LoginSection, Container, ImgSection } from './style';
import Logo from 'assets/images/logo.png';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Kakao from 'assets/images/kakao.png';
import API from 'utils/api';
import { setAdmin } from 'store/slices/userSlice';
import { useAppDispatch } from 'store/config';

const Login = () => {
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    interface FormData {
        password: string;
        email: string;
    }

    // 관리자 계정일 경우 유저 전역 상태에 관리자 여부 저장
    const setIsAdmin = useCallback(() => {
        dispatch(setAdmin(true));
    }, [dispatch]);

    const onSubmitHandler = async (data: FormData) => {
        const jsondata = {
            email: data.email,
            password: data.password,
        };
        try {
            const res = await API.post('/users', jsondata);
            const accessToken = res.accessToken;
            const refreshToken = res.refreshToken;
            const userId = res.userId;
            const isAdmin = res.isAdmin;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('isAdmin', isAdmin);
            // 관리자 계정일 경우
            if (isAdmin) setIsAdmin();
            // window.location.replace('/');
        } catch (err: any) {
            console.error(err.stack);
            alert('아이디 혹은 비밀번호가 틀렸습니다');
        }
    };

    const LoginByKakao = async () => {
        try {
            const baseUrl = 'https://kauth.kakao.com/oauth/authorize?';
            const zz = `client_id=${process.env.REACT_APP_KAKAO_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=profile_nickname,profile_image,account_email`;
            const finalUrl = `${baseUrl}${zz}`;
            window.location.href = finalUrl;
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

            <LoginSection>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="loginWrap">
                        <h1>LOGIN</h1>

                        <input
                            type="email"
                            {...register('email', {
                                required: '이메일을 입력해주세요',
                                pattern: {
                                    value: /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                    message: '이메일 형식만 가능합니다.',
                                },
                            })}
                            placeholder="이메일 입력"
                            autoComplete="off"
                        />

                        <label className={`${errors.email ? 'block' : 'none'}`}>
                            {errors?.email?.message}
                        </label>

                        <input
                            {...register('password', {
                                required: '비밀번호를 입력해주세요',
                            })}
                            type="password"
                            placeholder="비밀번호 입력"
                            autoComplete="new-password"
                        />
                        <div className="util">
                            <Link to="/join">회원가입 </Link>
                            <Link to="/find-pw">비밀번호 찾기</Link>
                        </div>

                        <article>
                            <ul>
                                <li>
                                    <button type="submit" className="loginBtn">
                                        로그인
                                    </button>
                                </li>
                            </ul>
                            <ul className="kakaoLogin">
                                <li onClick={LoginByKakao}>
                                    <span>
                                        <img src={Kakao} alt="kakao" />
                                    </span>
                                    <button type="button">카카오 로그인</button>
                                </li>
                            </ul>
                        </article>
                    </div>
                </form>
            </LoginSection>
        </Container>
    );
};

export default Login;
