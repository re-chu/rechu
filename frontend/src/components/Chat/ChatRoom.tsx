interface IPropData {
    setOtherChatUser: React.Dispatch<React.SetStateAction<string>>;
    setOtherChatUserId: React.Dispatch<React.SetStateAction<number | null>>;
}
const ChatRoom = ({ setOtherChatUser, setOtherChatUserId }: IPropData) => {
    return <div>chatroom</div>;
};

export default ChatRoom;
