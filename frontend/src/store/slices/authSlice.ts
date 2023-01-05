import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 인증 관련 정보 관리

interface CommonState {
    accessToken: string;
    refreshToken: string;
}

const initialState: CommonState = {
    accessToken: '',
    refreshToken: '',
};

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setToken(state, { payload: { accessToken, refreshToken } }) {
            return {
                ...state,
                accessToken,
                refreshToken,
            };
        },
        removeToken() {
            return initialState;
        },
    },
});

export const { setToken, removeToken } = authSlice.actions;

export default authSlice;
