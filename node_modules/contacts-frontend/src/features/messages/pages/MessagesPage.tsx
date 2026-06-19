import { FormEvent, useEffect, useMemo, useState } from 'react';
import Button from '../../../shared/components/Button';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import Input from '../../../shared/components/Input';
import { useSignalValue } from '../../../shared/hooks/useSignalValue';
import {
  appendMessage,
  closeMessaging,
  initMessaging,
  messagesStream,
  presenceStream,
  sendMessage,
} from '../services/messages.stream';
import {
  messagesSignal,
  messagingConnectedSignal,
  messagingErrorSignal,
  presenceSignal,
} from '../state/messages.signals';
import { authTokenSignal, authUserSignal } from '../../auth/state/auth.signals';

export default function MessagesPage() {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const token = useSignalValue(authTokenSignal);
  const user = useSignalValue(authUserSignal);
  const messages = useSignalValue(messagesSignal);
  const presence = useSignalValue(presenceSignal);
  const isConnected = useSignalValue(messagingConnectedSignal);
  const error = useSignalValue(messagingErrorSignal);
  const currentIdentity = useMemo(() => token || user?.id || user?.email || 'current-user', [token, user]);

  useEffect(() => {
    const socket = initMessaging(currentIdentity);
    const messageSubscription = messagesStream().subscribe((messages) => (messagesSignal.value = messages));
    const presenceSubscription = presenceStream().subscribe((presence) => (presenceSignal.value = presence));

    function handleConnect() {
      messagingConnectedSignal.value = true;
      messagingErrorSignal.value = null;
    }

    function handleDisconnect() {
      messagingConnectedSignal.value = false;
    }

    function handleError(error: Error) {
      messagingErrorSignal.value = error.message || 'Unable to connect to messaging gateway.';
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
      messageSubscription.unsubscribe();
      presenceSubscription.unsubscribe();
      closeMessaging();
    };
  }, [currentIdentity]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    messagingErrorSignal.value = null;

    if (!recipient.trim() || !message.trim()) {
      messagingErrorSignal.value = 'Recipient and message are required.';
      return;
    }

    const optimistic = {
      id: `pending-${Date.now()}`,
      from: currentIdentity,
      to: recipient.trim(),
      content: message.trim(),
      createdAt: new Date().toISOString(),
      pending: true,
    };

    appendMessage(optimistic);
    setMessage('');

    try {
      await sendMessage(recipient.trim(), optimistic.content);
    } catch (error) {
      messagingErrorSignal.value = error instanceof Error ? error.message : 'Unable to send message.';
    }
  }

  const onlineEntries = Object.entries(presence);

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Messages</p>
          <h1 className="mt-1 text-3xl font-bold text-ink">Real-time messaging</h1>
          <p className="mt-2 text-sm text-muted">Send messages through the Socket.io gateway and watch presence updates.</p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
          }`}
        >
          {isConnected ? 'Connected' : 'Connecting'}
        </div>
      </div>

      <ErrorMessage message={error} />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-md border border-line bg-white shadow-sm">
          <div className="h-[420px] overflow-y-auto p-4">
            {messages.length ? (
              <div className="grid gap-3">
                {messages.map((item) => {
                  const isMine = item.from === currentIdentity;
                  return (
                    <div key={item.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[82%] rounded-md px-4 py-3 text-sm ${
                          isMine ? 'bg-brand text-white' : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <p className="text-xs font-semibold opacity-80">{isMine ? 'You' : item.from}</p>
                        <p className="mt-1 whitespace-pre-wrap">{item.content}</p>
                        {item.pending ? <p className="mt-1 text-xs opacity-70">Sending...</p> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-sm text-muted">
                No messages yet. Pick a recipient identity and send the first one.
              </div>
            )}
          </div>

          <form className="grid gap-3 border-t border-line p-4" onSubmit={handleSend}>
            <Input
              label="Recipient identity"
              placeholder="Socket user id or token"
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="min-h-10 flex-1 rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-blue-100"
                placeholder="Write a message..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <Button type="submit" className="sm:w-28">
                Send
              </Button>
            </div>
          </form>
        </div>

        <aside className="rounded-md border border-line bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Presence</h2>
          <p className="mt-1 text-sm text-muted">Online events from the gateway.</p>
          <div className="mt-4 grid gap-2">
            {onlineEntries.length ? (
              onlineEntries.map(([id, online]) => (
                <div key={id} className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-2 text-sm">
                  <span className="truncate text-slate-700">{id}</span>
                  <span className={online ? 'font-semibold text-emerald-700' : 'font-semibold text-slate-500'}>
                    {online ? 'online' : 'offline'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No presence events yet.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
