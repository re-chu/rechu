import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import API from 'utils/api';
import { IOtherUser } from './index';
import { chatSocket } from 'services/socket';

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
    padding: 2rem 0;
    &.my {
        justify-content: flex-end;
        background-color: skyblue;
    }

    &.other {
        background-color: yellowgreen;
    }
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

interface IPropData {
    otherChatUserData: IOtherUser | null;
}

interface IChatData {
    MARK: string;
    chatId: number;
    avatarUrl: string;
    senderId: number;
    username: string;
    created: Date;
    text: string;
}

const ChatRoom = ({ otherChatUserData }: IPropData) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [chatData, setChatData] = useState<IChatData[]>([]);
    const [text, setText] = useState<string>('');

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const sendMessage = async () => {
        try {
            const data = {
                fromRoomId: 24,
                text: text,
            };
            await API.post('/chat/message', data);
        } catch (err) {
            console.log(err);
        }
        setText('');
    };

    const fetchChatData = async () => {
        try {
            const res = await API.get(
                '/chat/message',
                `?roomId=${otherChatUserData?.roomId}&mark=`,
            );
            setChatData(res.reverse());
            console.log('chat data', res);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        console.log(otherChatUserData);
        console.log(chatSocket);
        fetchChatData();

        // socket.on('alarm', () => {
        //     console.log('오옷 누군가 나의 게시글/댓글에 좋아요 또는 댓글을 남겼다!!');
        //     setHasNewAlarmState(true);
        // });
    }, []);

    useEffect(() => {
        //채팅 시작 시 스크롤 맨 아래에서부터 시작
        if (scrollRef.current && scrollRef.current.clientHeight)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [chatData]);

    return (
        <Container>
            <MessageWrapper ref={scrollRef}>
                {chatData.map((item, index) => (
                    <ChatMessageContainer key={index}>
                        <ChatMessageWrapper
                            className={otherChatUserData?.userId === item.senderId ? 'other' : 'my'}
                        >
                            {item.text}
                        </ChatMessageWrapper>
                    </ChatMessageContainer>
                ))}
            </MessageWrapper>
            <FormWrapper>
                <MessageInput value={text} onChange={onChange} />
                <ButtonMessageSend onClick={sendMessage}>전송</ButtonMessageSend>
            </FormWrapper>
        </Container>
    );
};

export default ChatRoom;
