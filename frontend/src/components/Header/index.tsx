import { useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import Logo from 'assets/images/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { HContainer, HHeader, AlarmWrapper, AlarmDot } from './style';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { setAdmin, setAlarm } from 'store/slices/userSlice';
import { useAppDispatch, useAppSelector } from 'store/config';
import socket from 'services/socket';
import API from 'utils/api';

const Header = () => {
    const navigate = useNavigate();
    const userState = useAppSelector(state => state.userState);
    const dispatch = useAppDispatch();

    const token = localStorage.getItem('accessToken');

    const [isAdmin, setIsAdmin] = useState<boolean>(admin);
    const [menuBarToggle, setMenuBarToggle] = useState<boolean>(false);
    const checkHasNewAlarm = async () => {
        const res = await API.get(`/users/individuals`);
        if (res.news) {
            setNewAlarmState(true);
        } else {
            setNewAlarmState(false);
        }
    };

    useEffect(() => {
        checkHasNewAlarm();

        // 게시글 좋아요, 댓글달기, 댓글좋아요 시 누가 눌럿던 간에 알림이 울림!!
        socket.on('alarm', () => {
            console.log('오옷 누군가 나의 게시글/댓글에 좋아요 또는 댓글을 남겼다!!');
            setNewAlarmState(true);
        });
    }, [userState]);

    // 로그아웃 시 전역 관리 중인 isAdmin값 초기화
    const setAdminLogout = useCallback(() => {
        dispatch(setAdmin(false));
    }, [dispatch]);

    const changeToggleMenu = () => {
        setMenuBarToggle(!menuBarToggle);
    };

    // 새로운 알림 도착 시 새 알림 여부 on
    const setNewAlarmOn = useCallback(() => {
        dispatch(setAlarm(true));
    }, [dispatch]);

    // 새로운 알림 도착 시 새 알림 여부 on off
    const setNewAlarmState = useCallback(
        (state: boolean) => {
            dispatch(setAlarm(state));
        },
        [dispatch],
    );

    const logout = useCallback(async () => {
        try {
            await API.patch('/users/sign-out', '', {});

            // admin 여부 false
            dispatch(setAdmin(false));

            localStorage.clear();
            window.location.replace('/');
        } catch (err: unknown) {
            console.log(err);
        }
    }, [setAdminLogout, token]);

    const handleAlarmToChecked = async () => {
        const data = {
            news: 0,
        };
        await API.patch('/users/individuals', '', data);
        setNewAlarmState(false);
    };

    return (
        <HContainer>
            <HHeader>
                <h1 onClick={() => navigate('/')}>
                    <img src={Logo} alt="logo" />
                </h1>

                <section className="alarmIcon">
                    <Link to="/alarm">
                        <BellOutlined />
                    </Link>
                </section>

                <div className="mobileMenu">
                    <article
                        className={`${menuBarToggle ? 'toggleMenu active' : 'toggleMenu'}`}
                        onClick={changeToggleMenu}
                    >
                        <span className="line"></span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </article>

                    {menuBarToggle && (
                        <div className="menuBar">
                            <nav>
                                <ul>
                                    {isAdmin === true && (
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
                    )}
                </div>

                <div className="navMenu">
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
                                <Link to="/match">매칭</Link>
                            </li>
                            <li>
                                <Link to="/alarm">
                                    <AlarmWrapper onClick={handleAlarmToChecked}>
                                        <BellOutlined />
                                        {userState.hasNewAlarm ? <AlarmDot /> : ''}
                                    </AlarmWrapper>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <ul className="util">
                        {token ? (
                            <>
                                <li>
                                    <Link to="/profile">
                                        <UserOutlined />
                                    </Link>
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
