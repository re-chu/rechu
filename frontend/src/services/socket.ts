import io from 'socket.io-client';

const socket = io('localhost:8080', { transports: ['websocket'] });

const chatSocket = io('localhost:8080/chat', { transports: ['websocket'] });

export default socket;

export { chatSocket };
