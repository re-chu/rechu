import Router from 'Router';
import GlobalStyle from 'styles/GlobalStyle';
import theme from 'styles/theme';
import { ThemeProvider } from '@emotion/react';
import { Provider } from 'react-redux';
import store from 'context/store';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
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
