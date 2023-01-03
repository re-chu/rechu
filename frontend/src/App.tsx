import Router from 'Router';
import GlobalStyle from 'styles/GlobalStyle';
import theme from 'styles/theme';
import { ThemeProvider } from '@emotion/react';
import { Provider } from 'react-redux';
import store from 'context/store';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('localhost:5000', { transports: ['websocket'] });

function App() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [lastPong, setLastPong] = useState(null);
    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            console.log('접속');
            socket.close();
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            socket.close();
        });

        socket.on('alarm', () => {
            console.log('오옷 누군가 좋아요를 눌렀따!!!');
            socket.close();
        });
    });
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
