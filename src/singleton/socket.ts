import { io, Socket } from 'socket.io-client';

export let socketClient = (() :Socket => {
    return io('ws://localhost:3000', {
        transports: ['websocket'],
        reconnectionDelayMax: 10000
    });
})();