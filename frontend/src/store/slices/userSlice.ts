import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CommonState {
    userId: string;
    isAdmin: boolean;
    hasNewAlarm: boolean;
}

const initialState: CommonState = {
    userId: '',
    isAdmin: false,
    hasNewAlarm: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAdmin(state, action: PayloadAction<boolean>) {
            console.log('admiadmiadmidamidamiad', action.payload);
            state.isAdmin = action.payload;
        },
        setAlarm(state, action: PayloadAction<boolean>) {
            state.hasNewAlarm = action.payload;
        },
    },
});

export const { setAdmin, setAlarm } = userSlice.actions;

export default userSlice;
