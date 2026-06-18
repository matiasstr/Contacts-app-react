import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(token?: string) {
  const base = (process && (process.env as any).VITE_API_URL) || 'http://localhost:3000';
  socket = io(base, { auth: { token } });
  return socket;
}

export function getSocket() {
  return socket;
}
