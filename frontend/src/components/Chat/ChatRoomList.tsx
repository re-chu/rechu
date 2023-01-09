import styled from '@emotion/styled';
import { useState, useEffect } from 'react';

const Container = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ChatRoom = styled.div`
    font-size: 1.8rem;
    width: 85%;
    height: 7rem;
    background: rgb(255, 255, 255);
    border-bottom: 1px solid rgb(240, 241, 243);
    padding: 1.2rem 2.4rem;
    cursor: pointer;
`;

interface IChatRoomItem {
    roomId: number;
    lastText: string;
    created: string;
    // created: Date;
    mentoId: number;
    menteeId: number;
    fromConnectId: number;
    noCheckoutMessages: number | null;
}

interface IPropData {
    setIsEnter: React.Dispatch<React.SetStateAction<boolean>>;
    setOtherChatUser: React.Dispatch<React.SetStateAction<string>>;
    setOtherChatUserId: React.Dispatch<React.SetStateAction<number | null>>;
}

const ChatRoomList = ({ setIsEnter, setOtherChatUser, setOtherChatUserId }: IPropData) => {
    const [chatRoomList, setChatRoomList] = useState<IChatRoomItem[]>([]);

    const handleEnterRoom = (item: IChatRoomItem) => {
        setIsEnter(true);
        setOtherChatUser('123');
    };

    useEffect(() => {
        setChatRoomList(data);
    }, []);

    return (
        <Container>
            {chatRoomList.length !== 0 &&
                chatRoomList.map((item, index) => (
                    <ChatRoom key={index} onClick={() => handleEnterRoom(item)}>
                        {item.lastText}
                    </ChatRoom>
                ))}
        </Container>
    );
};

export default ChatRoomList;

const data: IChatRoomItem[] = [
    {
        roomId: 1,
        lastText: '안녕하세요',
        created: '2023-01-01',
        mentoId: 1,
        menteeId: 2,
        fromConnectId: 1,
        noCheckoutMessages: 1,
    },
    {
        roomId: 3,
        lastText: 'ㅎㅇㅎㅇ',
        created: '2023-01-01',
        mentoId: 1,
        menteeId: 3,
        fromConnectId: 1,
        noCheckoutMessages: 1,
    },
    {
        roomId: 4,
        lastText: 'ㄴㅇㄹㅁㄹㅁㄴㅇㄹ',
        created: '2023-01-01',
        mentoId: 1,
        menteeId: 4,
        fromConnectId: 1,
        noCheckoutMessages: 1,
    },
    {
        roomId: 5,
        lastText: 'ㅎㄴㅇㅇㅎㄴ',
        created: '2023-01-01',
        mentoId: 1,
        menteeId: 5,
        fromConnectId: 1,
        noCheckoutMessages: 1,
    },
    {
        roomId: 6,
        lastText: '안녕하세요',
        created: '2023-01-01',
        mentoId: 1,
        menteeId: 6,
        fromConnectId: 1,
        noCheckoutMessages: 1,
    },
    {
        roomId: 7,
        lastText: '안녕하세요',
        created: '2023-01-01',
        mentoId: 1,
        menteeId: 7,
        fromConnectId: 1,
        noCheckoutMessages: 1,
    },
    {
        roomId: 8,
        lastText: '안녕하세요',
        created: '2023-01-01',
        mentoId: 1,
        menteeId: 8,
        fromConnectId: 1,
        noCheckoutMessages: 1,
    },
    {
        roomId: 9,
        lastText: '안녕하세요',
        created: '2023-01-01',
        mentoId: 1,
        menteeId: 9,
        fromConnectId: 1,
        noCheckoutMessages: 1,
    },
];
