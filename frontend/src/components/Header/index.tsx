import { useCallback, useEffect, useState } from 'react';
import Logo from 'assets/images/logo.png';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { HContainer, HHeader } from './style';
import API from 'utils/api';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const admin = localStorage.getItem('isAdmin') === 'true' ? true : false;

    const [isAdmin, setIsAdmin] = useState<boolean>(admin);

    const userInfo = async () => {
        try {
            const res = await API.get(`/users/individuals`);
        } catch (err: unknown) {
            console.log(err);
        }
    };

    useEffect(() => {
        userInfo();
    }, [token]);

    const logout = useCallback(() => {
        try {
            axios.patch(
                `${API.BASE_URL}/users/sign-out`,
                {},
                { headers: { authorization: `Bearer ${token}` } },
            );

            localStorage.clear();
            window.location.replace('/');
        } catch (err: unknown) {
            console.log(err);
        }
    }, []);

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
            </HHeader>
        </HContainer>
    );
};

export default Header;
