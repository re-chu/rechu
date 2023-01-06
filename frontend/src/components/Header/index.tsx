import { useCallback, useEffect, useState } from 'react';
import Logo from 'assets/images/logo.png';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { HContainer, HHeader } from './style';
import { BellOutlined } from '@ant-design/icons';
import API from 'utils/api';
import { setAdmin, setAlarm } from 'store/slices/userSlice';
import { useAppDispatch, useAppSelector } from 'store/config';

const Header = () => {
    const navigate = useNavigate();
    const userState = useAppSelector(state => state.userState);
    const dispatch = useAppDispatch();

    // userState 안에 전역 관리하는 isAdmin이 들어있습니다.
    console.log(userState);

    const token = localStorage.getItem('accessToken');
    const admin = localStorage.getItem('isAdmin') === 'true' ? true : false;

    const [isAdmin, setIsAdmin] = useState<boolean>(admin);
    const [menuBarToggle, setMenuBarToggle] = useState<boolean>(false);

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

    useEffect(() => {
        setNewAlarmOn();
    }, []);

    const logout = useCallback(() => {
        try {
            axios.patch(
                `${API.BASE_URL}/users/sign-out`,
                {},
                { headers: { authorization: `Bearer ${token}` } },
            );

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
                            <li>
                                <Link to="/alarm">
                                    <BellOutlined />
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
