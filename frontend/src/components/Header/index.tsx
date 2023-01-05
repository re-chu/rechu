import { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import Logo from 'assets/images/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { HContainer, HHeader } from './style';
import { BellOutlined } from '@ant-design/icons';
import { setAdmin, setAlarm } from 'store/slices/userSlice';
import { useAppDispatch, useAppSelector } from 'store/config';
import socket from 'services/socket';
import axios from 'axios';
import API from 'utils/api';

const AlarmWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
    font-size: 3rem;
    background-color: yellowgreen;
    span {
        position: absolute;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background-color: red;
    }
`;

const Header = () => {
    const navigate = useNavigate();
    const userState = useAppSelector(state => state.userState);
    const dispatch = useAppDispatch();

    // userState 안에 전역 관리하는 isAdmin이 들어있습니다.
    console.log(userState.hasNewAlarm);

    const token = localStorage.getItem('accessToken');
    const test = async () => {
        const res = await API.get(`/users/individuals`);
        if (res.news) setNewAlarmOn();
    };

    const checkAlarm = async () => {
        const data = {
            news: 0,
        };
        const res = await API.patch('/users/individuals', '', data);
        console.log(res);
    };

    useEffect(() => {
        test();
        // 게시글 좋아요, 댓글달기, 댓글좋아요 시 누가 눌럿던 간에 알림이 울림!!
        socket.on('alaram', () => {
            console.log('오옷 누군가 나의 게시글/댓글에 좋아요 또는 댓글을 남겼다!!');
            setNewAlarmOn();
        });

        // 알림 확인했다는 이벤트 발송
        checkAlarm();
    }, []);

    // 로그아웃 시 전역 관리 중인 isAdmin값 초기화
    const setAdminLogout = useCallback(() => {
        dispatch(setAdmin(false));
    }, [dispatch]);

    // 새로운 알림 도착 시 새 알림 여부 on
    const setNewAlarmOn = useCallback(() => {
        dispatch(setAlarm(true));
    }, [dispatch]);

    const logout = useCallback(async () => {
        try {
            // await axios.patch(
            //     `${API.BASE_URL}/users/sign-out`,
            //     {},
            //     { headers: { authorization: `Bearer ${token}` } },
            // );

            await API.patch('/users/sign-out', '', {});

            // admin 여부 false
            setAdminLogout();

            localStorage.clear();
            window.location.replace('/');
        } catch (err: unknown) {
            console.log(err);
        }
    }, [setAdminLogout, token]);

    return (
        <HContainer>
            <HHeader>
                <h1 onClick={() => navigate('/')}>
                    <img src={Logo} alt="logo" />
                </h1>

                <div className="toggleMenu">
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </div>

                <div className="">
                    <nav>
                        <ul>
                            {userState.isAdmin === true && (
                                <li>
                                    <Link to="/admin">관리자</Link>
                                </li>
                            )}

                            <li>
                                <Link to="/comunity">커뮤니티</Link>
                            </li>

                            <li>
                                <Link to="/resume/list">이력서</Link>
                            </li>
                            <li>
                                <Link to="/match">상점</Link>
                            </li>
                            <li>
                                <Link to="/alarm">
                                    <AlarmWrapper>
                                        <BellOutlined />
                                    </AlarmWrapper>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <ul className="util">
                        {token ? (
                            <>
                                <li>
                                    <Link to="/profile">마이페이지</Link>
                                </li>
                                <li onClick={logout}>로그아웃</li>
                            </>
                        ) : (
                            <li>
                                <Link to="/login">로그인</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </HHeader>
        </HContainer>
    );
};

export default Header;
