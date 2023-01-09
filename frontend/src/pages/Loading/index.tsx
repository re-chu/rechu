import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import Spinner from 'assets/images/Spinner.gif';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from 'utils/api';

const Div = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1280;
    margin: 2% auto 0;
    text-align: center;
    align-items: center;
    opacity: 0.8;
    border-radius: 10px;
`;
const H1 = styled.h1`
    margin: 20px;
    font-size: 64px;
    font-weight: bold;
`;
const H2 = styled.h1`
    font-size: 32px;
    font-weight: bold;
`;
const Background = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: #ffffffb7;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const LoadingText = styled.div`
    font: 1rem 'Noto Sans KR';
    text-align: center;
`;

const Loading = () => {
    const navigate = useNavigate();
    const locaiton = useLocation();
    useEffect(() => {
        console.log('locaiton.search', locaiton.search);
        getToken();
    }, []);

    const getCode = new URLSearchParams(window.location.search).get('code');

    const getToken = async () => {
        try {
            const res = await axios.get(`${API.BASE_URL}/sosial/kakao/auth?code=${getCode}`);
            console.log(res);
            const accessToken = res.data.accessToken;
            const refreshToken = res.data.refreshToken;
            const userId = res.data.userId;
            const isAdmin = res.data.isAdmin;
            localStorage.setItem('isAdmin', isAdmin);
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', userId);
            window.location.href = '/';
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Background>
            <LoadingText>잠시만 기다려 주세요.</LoadingText>
            <img src={Spinner} alt="로딩중" width="5%" />
        </Background>
    );
};

export default Loading;
