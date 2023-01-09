import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import API from 'utils/api';
import { IOtherUser } from './index';
import { chatSocket } from 'services/socket';

const Container = styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ChatRoom = styled.div`
    display: grid;
    grid-template-columns: 6rem calc(100% - 8.5rem) 2.5rem;
    font-size: 1.8rem;
    width: 100%;
    height: 7rem;
    background: rgb(255, 255, 255);
    border-bottom: 1px solid rgb(240, 241, 243);
    padding: 1.2rem 2.4rem;
    cursor: pointer;
`;

const ChatRoomContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
`;

const LatestChatMessage = styled.p`
    width: 100%;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    margin-left: 2rem;
`;

const ProfileImg = styled.img`
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
`;

const ProfileName = styled.div`
    display: flex;
    width: 100%;
    margin-left: 2rem;
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
    font-weight: 600;
`;

const ChatNewMessageNumWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #f66;
`;

const ChatNewMessageNum = styled.p`
    font-size: 1.4rem;
    color: white;
`;

interface IChatRoomItem {
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

interface IPropData {
    setOtherChatUserData: React.Dispatch<React.SetStateAction<IOtherUser | null>>;
    setOtherChatUser: React.Dispatch<React.SetStateAction<string>>;
    setOtherChatUserId: React.Dispatch<React.SetStateAction<number>>;
}

interface IChatSocketData {
    senderId: number;
    created: Date;
    text: string;
}

const ChatRoomList = ({
    setOtherChatUserData,
    setOtherChatUser,
    setOtherChatUserId,
}: IPropData) => {
    const [chatRoomList, setChatRoomList] = useState<IChatRoomItem[]>([]);

    const handleEnterRoom = (item: IChatRoomItem) => {
        setOtherChatUserData({
            userId: item.otherUserId,
            userName: item.username,
            avatarUrl: item.avatarUrl,
            roomId: item.roomId,
        });
        setOtherChatUserId(item.otherUserId);
        setOtherChatUser(item.username);
    };

    const fetchChatRoomList = async () => {
        try {
            const res = await API.get('/chat/room');
            res.forEach((item: IChatRoomItem) => {
                chatSocket.emit('enterChatRoom', item?.roomId);
            });
            setChatRoomList(res);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchChatRoomList();
        chatSocket.on('newChatMessage', (data: IChatSocketData) => {
            console.log('채팅 JKL!JKL', data);
        });
    }, []);

    return (
        <Container>
            {chatRoomList.length !== 0 &&
                chatRoomList.map((item, index) => (
                    <ChatRoom key={index} onClick={() => handleEnterRoom(item)}>
                        <ChatRoomContent>
                            <ProfileImg src={item.avatarUrl} />
                        </ChatRoomContent>
                        <ChatRoomContent>
                            <ProfileName>{item.username}</ProfileName>
                            <LatestChatMessage>{item.lastText}</LatestChatMessage>
                        </ChatRoomContent>
                        <ChatRoomContent>
                            {item.noCheckoutMessages !== 0 && (
                                <ChatNewMessageNumWrapper>
                                    <ChatNewMessageNum>{item.noCheckoutMessages}</ChatNewMessageNum>
                                </ChatNewMessageNumWrapper>
                            )}
                        </ChatRoomContent>
                    </ChatRoom>
                ))}
        </Container>
    );
};

export default ChatRoomList;
