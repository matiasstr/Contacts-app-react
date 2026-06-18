import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getSocket, connectSocket } from './messages.api';

const messages$ = new BehaviorSubject<any[]>([]);
const presence$ = new BehaviorSubject<Record<string, boolean>>({});

export function initMessaging(token?: string) {
  const socket = connectSocket(token);
  const msgStream = fromEvent(socket, 'message').pipe(map((m: any) => ({ type: 'message', payload: m })));
  const presStream = fromEvent(socket, 'presence').pipe(map((p: any) => ({ type: 'presence', payload: p })));
  merge(msgStream, presStream).subscribe((evt: any) => {
    if (evt.type === 'message') {
      messages$.next([...messages$.value, evt.payload]);
    } else if (evt.type === 'presence') {
      presence$.next({ ...presence$.value, [evt.payload.userId]: evt.payload.online });
    }
  });
}

export function sendMessage(to: string, content: string) {
  const socket = getSocket();
  socket?.emit('message.send', { to, content });
}

export function messagesStream(): Observable<any[]> {
  return messages$.asObservable();
}

export function presenceStream(): Observable<Record<string, boolean>> {
  return presence$.asObservable();
}
