import io from 'socket.io-client';
const BASE_URL = 'https://rechu.jinytree.shop';
// const BASE_URL = 'localhost:8080';

const socket = io(`${BASE_URL}`, { transports: ['websocket'] });

const chatSocket = io(`${BASE_URL}/chat`, { transports: ['websocket'] });

export default socket;

export { chatSocket };
