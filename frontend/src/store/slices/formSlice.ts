import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
        changeWorkFormToggle: (state, action: PayloadAction<boolean>) => {
            state.workFormToggle = action.payload;
        },
        changeProjectFormToggle: (state, action: PayloadAction<boolean>) => {
            state.projectFormToggle = action.payload;
        },
    },
});

export const { changeWorkFormToggle, changeProjectFormToggle } = slice.actions;
export default slice;
