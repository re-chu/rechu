import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatRoomState {
    avatarUrl: string;
    created: Date;
    fromConnectId: number;
    lastText: string;
    menteeId: number;
    mentoId: number;
    noCheckoutMessages: number;
    roomId: number;
    username: string;
    otherUserId: number;
}

const initialState: ChatRoomState[] = [];

export const chatSlice = createSlice({
    name: 'chatRoom',
    initialState,
    reducers: {
        setChatRoomState(state, action: PayloadAction<ChatRoomState[]>) {
            return action.payload;
        },
        resetChatRoomState() {
            return initialState;
        },
    },
});

export const { setChatRoomState, resetChatRoomState } = chatSlice.actions;

export default chatSlice;
