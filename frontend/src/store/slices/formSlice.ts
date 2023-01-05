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
            state.workFormToggle = action.payload;
        },
    },
});

export default slice;
export const { toggle } = slice.actions;
