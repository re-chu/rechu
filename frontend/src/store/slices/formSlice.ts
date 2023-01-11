import { createSlice } from '@reduxjs/toolkit';

type initialStateType = {
    id: string | number;
    workFormToggle: boolean;
    projectFormToggle: boolean;
};

const initialState: initialStateType = {
    id: '',
    workFormToggle: false,
    projectFormToggle: false,
};

export const slice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        toggle: (state, action) => {
            console.log(state, action, 'action', action.payload);
            state.workFormToggle = action.payload;
        },
    },
});

export const { toggle } = slice.actions;
export default slice;
