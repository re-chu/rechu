import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import API from 'utils/api';
import { IOtherUser } from './index';
import { chatSocket } from 'services/socket';

import { setChatState, resetChatState } from 'store/slices/chatSlice';
import { useAppDispatch, useAppSelector } from 'store/config';
import { formatTimeToAMPM } from 'utils/format';

const Container = styled.div`
    display: grid;
    grid-template-rows: 1fr 8rem;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
`;

const MessageWrapper = styled.div`
    width: 100%;
    height: 100%;

    // Scrollbar Design
    overflow-x: hidden;
    align-items: center;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #999999;
        border-radius: 5px;
    }
    &::-webkit-scrollbar-track {
        border-radius: 5px;
    }
`;

const ChatMessageContainer = styled.div`
    width: 100%;
    margin: 1rem 0;
`;

const ChatMessageWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    font-size: 1.6rem;
    padding: 0.5rem 0;
    &.my {
        justify-content: flex-end;
    }
    &.other {
    }
`;

const ChatMessage = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
`;

const MyChatMessage = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    p:last-child {
        margin-right: 1.5rem;
    }
`;

const MyChatMessageText = styled.p`
    background-color: #ffe224;
    max-width: 26rem;
    padding: 1.8rem 2rem;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    line-height: 2rem;
    white-space: normal;
    margin-right: 1rem;
`;

const ChatDate = styled.p`
    margin-top: 0.5rem;
    font-size: 1.2rem;
    color: #666;
`;

const FormWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 8rem;
    width: 100%;
    height: 100%;
`;

const MessageInput = styled.textarea`
    width: 100%;
    margin-right: 20px;
    padding: 1rem 1rem;
    font-size: 1.6rem;
    border: none;
    outline: none;
    resize: none;
    font-family: sans-serif;
`;

const ButtonMessageSend = styled.button`
    width: 100%;
    height: 100%;
    border: none;
    font-family: 'Roboto';
    color: #fff;
    font-size: 16px;
    background-color: #6dae6d;
    cursor: pointer;
`;

const OtherChatMessageWrapper = styled.div`
    display: grid;
    grid-template-columns: 6rem 1fr;
`;

const OtherUserProfile = styled.div`
    display: flex;
    justify-content: center;
`;

const OtherUserProfileImg = styled.img`
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
`;

const OtherUserName = styled.p`
    font-size: 1.6rem;
`;

const OtherChatMessageText = styled.p`
    background-color: #6dae6d;
    color: white;
    max-width: 26rem;
    padding: 1.8rem 2rem;
    border-radius: 1.2rem;
    font-size: 1.4rem;
    line-height: 2rem;
    white-space: normal;
`;

interface IPropData {
    otherChatUserData: IOtherUser | null;
    setOtherChatUserData: React.Dispatch<React.SetStateAction<IOtherUser | null>>;
}

interface IChatSocketData {
    senderId: number;
    created: Date;
    text: string;
}

const ChatRoom = ({ otherChatUserData, setOtherChatUserData }: IPropData) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const chatState = useAppSelector(state => state.chatState);
    const dispatch = useAppDispatch();

    const [text, setText] = useState<string>('');

    const myId = Number(localStorage.getItem('userId'));

    const fetchChatData = async () => {
        try {
            const res = await API.get(
                '/chat/message',
                `?roomId=${otherChatUserData?.roomId}&mark=`,
            );
            const result = res.reverse();
            if (result.length !== 0) dispatch(setChatState(result));
        } catch (err) {
            console.log(err);
        }
    };

    const fetchMoreChatData = async () => {
        try {
            const firstMark = chatState[0].MARK;
            const res = await API.get(
                '/chat/message',
                `?roomId=${otherChatUserData?.roomId}&mark=${firstMark}`,
            );
            const result = res.reverse();
            dispatch(setChatState([...result, ...chatState]));
        } catch (err) {
            console.log(err);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const sendMessage = async () => {
        if (text === '') return;
        try {
            const data = {
                fromRoomId: otherChatUserData?.roomId,
                text,
            };
            await API.post('/chat/message', data);

            const socketData = {
                text,
                senderId: myId,
                created: new Date(),
            };

            const newData = {
                MARK: '',
                chatId: 0,
                avatarUrl: '',
                senderId: myId,
                username: '',
                created: new Date(),
                text,
            };

            chatSocket.emit('sendMessage', otherChatUserData?.roomId, socketData);
            dispatch(setChatState([...chatState, newData]));
            moveScrollToBottom();
        } catch (err) {
            console.log(err);
        }
        setText('');
    };

    const sendMessageWithEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') sendMessage();
    };

    const appendNewMessage = (data: IChatSocketData) => {
        const newData = {
            MARK: '',
            chatId: 0,
            avatarUrl: '',
            username: '',
            senderId: data.senderId,
            created: data.created,
            text: data.text,
        };
        dispatch(setChatState([...chatState, newData]));

        moveScrollToBottom();
    };

    const leaveChatRoom = async () => {
        try {
            const data = {
                roomId: otherChatUserData?.roomId,
            };
            await API.patch('/chat/room', '', data);

            dispatch(resetChatState());
            setOtherChatUserData(null);
        } catch (err) {
            console.log(err);
        }
    };

    const moveScrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current && scrollRef.current.clientHeight)
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight * 9999;
        }, 0);
    };

    // const moveScrollToBottomFromNewChat = () => {
    //     console.log("미 구현")
    // }

    useEffect(() => {
        fetchChatData();

        return () => {
            leaveChatRoom();
        };
    }, []);

    useEffect(() => {
        chatSocket.on('newChatMessage', (data: IChatSocketData) => {
            appendNewMessage(data);
        });

        //채팅 시작 시 스크롤 맨 아래에서부터 시작
        moveScrollToBottom();
    }, [chatState]);

    useEffect(() => {
        scrollRef.current?.addEventListener('scroll', () => {
            if (scrollRef.current?.scrollTop === 0 && chatState.length >= 20) {
                fetchMoreChatData();
            }
        });
    }, []);

    useEffect(() => {
        //채팅 시작 시 스크롤 맨 아래에서부터 시작
        moveScrollToBottom();
    }, []);

    return (
        <Container>
            <MessageWrapper ref={scrollRef}>
                {chatState.map((item, index) => (
                    <ChatMessageContainer key={index}>
                        <ChatMessageWrapper
                            className={otherChatUserData?.userId === item.senderId ? 'other' : 'my'}
                        >
                            {otherChatUserData?.userId === item.senderId ? (
                                <OtherChatMessageWrapper>
                                    <OtherUserProfile>
                                        <OtherUserProfileImg src={otherChatUserData.avatarUrl} />
                                    </OtherUserProfile>
                                    <ChatMessage>
                                        <OtherUserName>{otherChatUserData.userName}</OtherUserName>
                                        <OtherChatMessageText>{item.text}</OtherChatMessageText>
                                        <ChatDate>{formatTimeToAMPM(item.created)}</ChatDate>
                                    </ChatMessage>
                                </OtherChatMessageWrapper>
                            ) : (
                                <>
                                    <MyChatMessage>
                                        <MyChatMessageText>{item.text}</MyChatMessageText>
                                        <ChatDate>{formatTimeToAMPM(item.created)}</ChatDate>
                                    </MyChatMessage>
                                </>
                            )}
                        </ChatMessageWrapper>
                    </ChatMessageContainer>
                ))}
            </MessageWrapper>
            <FormWrapper>
                <MessageInput value={text} onChange={onChange} onKeyUp={sendMessageWithEnter} />
                <ButtonMessageSend onClick={sendMessage}>전송</ButtonMessageSend>
            </FormWrapper>
        </Container>
    );
};

export default ChatRoom;
