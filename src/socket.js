import {io} from 'socket.io-client';

const URL = 'http://localhost:7071';

export const socket = io(URL, {
    autoConnect: true,
});