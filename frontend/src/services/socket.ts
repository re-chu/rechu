import io from 'socket.io-client';
const BASEURL = 'rechu.jinytree.shop';
const socket = io(`${BASEURL}`, { transports: ['websocket'] });

const chatSocket = io(`${BASEURL}/chat`, { transports: ['websocket'] });

export default socket;

export { chatSocket };
