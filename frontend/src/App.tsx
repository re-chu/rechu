import Router from 'Router';
import GlobalStyle from 'styles/GlobalStyle';
import theme from 'styles/theme';
import { ThemeProvider } from '@emotion/react';
import { Provider } from 'react-redux';
import store from 'context/store';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

export const socket = io('localhost:5000', { transports: ['websocket'] });
function App() {
    useEffect(() => {
        // 앱에 접속되면 socket 에 접속됨
        socket.on('connect', () => {
            // 로컬에 AT 가 있을경우 === 로그인한 상태기에,
            if (localStorage.getItem('accessToken') !== null) {
                // 서버에서 해당 userId 로 방을하나 판다.
                socket.emit('login', localStorage.getItem('userId'));
            }
            // 이 로직은 새로고침되어도 로그인상태라면 방이 계속 유지가 되는 장점이있다.(이방법만 가능할듯)
        });

        socket.on('disconnect', () => {
            socket.close();
        });
        // 게시글 좋아요, 댓글달기, 댓글좋아요 시 누가 눌럿던 간에 알림이울림!!
        socket.on('alaram', () => {
            console.log('오옷 누군가 나의 게시글/댓글에 좋아요 또는 댓글을 남겼다!!');
        });
    }, []);
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <Router />
            </ThemeProvider>
        </Provider>
    );
}

export default App;
