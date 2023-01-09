import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { MessageOutlined, CloseOutlined, LeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import ChatRoom from './ChatRoom';

const WrapperClosed = styled.button`
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-box-pack: justify;
    -webkit-box-align: center;
    width: 6rem;
    height: 6rem;
    bottom: 4rem;
    right: 4rem;
    border: none;
    border-radius: 50%;
    overflow: hidden;
    transition: max-width 200ms;
    font-size: 3rem;
    box-shadow: rgb(255 255 255 / 12%) 0px 0px 2px 0px inset, rgb(0 0 0 / 5%) 0px 0px 2px 1px,
        rgb(0 0 0 / 30%) 0px 12px 60px;
    color: white;
    background-color: #6dae6d;
    cursor: pointer;
    z-index: 977;
`;

const appearAnimation = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const WrapperOpened = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40rem;
    height: 100%;
    max-height: 67rem;
    bottom: 4rem;
    right: 4rem;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 1rem;
    background-color: rgb(240, 241, 243);
    transform: translate(0px, 0px);
    z-index: 980;
    animation: 0.7s ${appearAnimation};
    box-shadow: rgb(255 255 255 / 12%) 0px 0px 2px 0px inset, rgb(0 0 0 / 5%) 0px 0px 2px 1px,
        rgb(0 0 0 / 30%) 0px 12px 60px;
`;

const ChatHeader = styled.div`
    width: 100%;
    height: 10%;
    display: flex;
    border-radius: 1rem 1rem 0 0;
    justify-content: space-between;
    background-color: #5f9e5f;
`;

const ChatHeaderElem = styled.div`
    display: flex;
    align-items: center;
    padding: 5px;
    margin: 0 20px;
    font-size: 1.6rem;
    color: white;
    margin-top: 10px;
    :last-child {
        cursor: pointer;
    }
`;

const ChatTitle = styled.h2`
    font-size: 2rem;
    margin-left: 1.4rem;
`;

const ChatBody = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: black;
    border-radius: 0 0 1rem 1rem;
    // Scrollbar Design
    overflow: auto;
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

const Dot = styled.span`
    width: 0.8rem;
    height: 0.8rem;
    margin: 0 0.3rem;
    border-radius: 50%;
    background-color: white;
`;

export interface IOtherUser {
    userId: number;
    userName: string;
    avatarUrl: string;
    roomId: number;
}

const Chat = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [otherChatUserData, setOtherChatUserData] = useState<IOtherUser | null>(null);
    const [otherChatUser, setOtherChatUser] = useState<string>('');
    const [otherChatUserId, setOtherChatUserId] = useState<number>(0);

    const handleAlarmBack = () => {
        setOtherChatUserId(0);
    };

    const handleAlarmWindow = () => {
        setIsOpen(!isOpen);
        setOtherChatUser('');
        setOtherChatUserId(0);
        setOtherChatUserData(null);
    };

    return (
        <>
            {!isOpen ? (
                <WrapperClosed onClick={handleAlarmWindow}>
                    <MessageOutlined />
                </WrapperClosed>
            ) : (
                <WrapperOpened>
                    <ChatHeader>
                        {/* 채팅방 리스트 or 채팅창에 따른 헤더 렌더링 */}
                        {otherChatUserId !== 0 ? (
                            <ChatHeaderElem>
                                <LeftOutlined onClick={handleAlarmBack} />
                                <ChatTitle>{otherChatUser}</ChatTitle>
                            </ChatHeaderElem>
                        ) : (
                            <ChatHeaderElem>
                                <Dot onClick={handleAlarmBack} />
                                <ChatTitle>채팅</ChatTitle>
                            </ChatHeaderElem>
                        )}
                        <ChatHeaderElem onClick={handleAlarmWindow}>
                            <CloseOutlined />
                        </ChatHeaderElem>
                    </ChatHeader>
                    <ChatBody>
                        {/* 채팅방 리스트 or 채팅창 */}
                        {otherChatUserId === 0 ? (
                            <ChatRoomList
                                setOtherChatUserData={setOtherChatUserData}
                                setOtherChatUser={setOtherChatUser}
                                setOtherChatUserId={setOtherChatUserId}
                            />
                        ) : (
                            <ChatRoom otherChatUserData={otherChatUserData} />
                        )}
                    </ChatBody>
                </WrapperOpened>
            )}
        </>
    );
};

export default Chat;
