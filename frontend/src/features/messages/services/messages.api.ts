import { io, Socket } from 'socket.io-client';
import { getApiUrl } from '../../../shared/http/api-client';

let socket: Socket | null = null;

export function connectSocket(token?: string) {
  if (socket) {
    socket.disconnect();
  }

  socket = io(getApiUrl(), {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
  return socket;
}

export function getSocket() {
  return socket;
}
