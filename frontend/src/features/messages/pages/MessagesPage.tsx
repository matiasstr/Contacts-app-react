import React, { useEffect, useState } from 'react'
import { initMessaging, messagesStream, presenceStream, sendMessage } from '../services/messages.stream'
import { messagesSignal, presenceSignal } from '../state/messages.signals'

export default function MessagesPage() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    initMessaging('demo-user-id');
    const sub = messagesStream().subscribe((msgs) => (messagesSignal.value = msgs));
    const psub = presenceStream().subscribe((p) => (presenceSignal.value = p));
    return () => {
      sub.unsubscribe();
      psub.unsubscribe();
    }
  }, [])

  function handleSend() {
    sendMessage('other-user-id', message)
    setMessage('')
  }

  return (
    <div>
      <h2>Messages</h2>
      <div style={{ border: '1px solid #ccc', padding: 8, height: 300, overflow: 'auto' }}>
        {messagesSignal.value.map((m) => (
          <div key={m._id || Math.random()}>
            <strong>{m.from}</strong>: {m.content}
          </div>
        ))}
      </div>
      <div>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleSend}>Send</button>
      </div>
      <div>
        <h4>Presence</h4>
        {Object.entries(presenceSignal.value).map(([id, online]) => (
          <div key={id}>{id} - {online ? 'online' : 'offline'}</div>
        ))}
      </div>
    </div>
  )
}
