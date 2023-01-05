import io from 'socket.io-client';

const socket = io('localhost:8080', { transports: ['websocket'] });

export default socket;
