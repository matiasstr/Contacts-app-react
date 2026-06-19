import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { getSocket, connectSocket } from './messages.api';
import type { Message } from '../state/messages.signals';

const messages$ = new BehaviorSubject<Message[]>([]);
const presence$ = new BehaviorSubject<Record<string, boolean>>({});
let socketSubscription: Subscription | null = null;

function normalizeMessage(raw: any): Message {
  return {
    id: String(raw.id || raw._id || `${raw.from}-${raw.to}-${Date.now()}`),
    _id: raw._id,
    from: String(raw.from || ''),
    to: String(raw.to || ''),
    content: String(raw.content || ''),
    createdAt: raw.createdAt,
    pending: raw.pending,
  };
}

export function initMessaging(token?: string) {
  const socket = connectSocket(token);

  socketSubscription?.unsubscribe();

  const msgStream = fromEvent(socket, 'message').pipe(map((m: any) => ({ type: 'message', payload: m })));
  const presStream = fromEvent(socket, 'presence').pipe(map((p: any) => ({ type: 'presence', payload: p })));

  socketSubscription = merge(msgStream, presStream).subscribe((evt: any) => {
    if (evt.type === 'message') {
      messages$.next([...messages$.value, normalizeMessage(evt.payload)]);
    } else if (evt.type === 'presence') {
      presence$.next({ ...presence$.value, [evt.payload.userId]: evt.payload.online });
    }
  });

  return socket;
}

export function appendMessage(message: Message) {
  messages$.next([...messages$.value, message]);
}

export function sendMessage(to: string, content: string): Promise<Message | null> {
  const socket = getSocket();

  return new Promise((resolve) => {
    if (!socket || !content.trim()) {
      resolve(null);
      return;
    }

    socket.emit('message.send', { to, content }, (response: any) => {
      const message = response ? normalizeMessage(response) : null;
      if (message) appendMessage(message);
      resolve(message);
    });
  });
}

export function closeMessaging() {
  socketSubscription?.unsubscribe();
  socketSubscription = null;
  getSocket()?.disconnect();
}

export function messagesStream(): Observable<Message[]> {
  return messages$.asObservable();
}

export function presenceStream(): Observable<Record<string, boolean>> {
  return presence$.asObservable();
}
