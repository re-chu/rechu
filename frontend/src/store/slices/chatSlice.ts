import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
    MARK: string;
    chatId: number;
    avatarUrl: string;
    senderId: number;
    username: string;
    created: Date;
    text: string;
}

const initialState: ChatState[] = [];

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatState(state, action: PayloadAction<ChatState[]>) {
            return action.payload;
        },
        resetChatState() {
            return initialState;
        },
    },
});

export const { setChatState, resetChatState } = chatSlice.actions;

export default chatSlice;
