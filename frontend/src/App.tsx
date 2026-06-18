import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import MessagesPage from './features/messages/pages/MessagesPage'

export default function App() {
  return (
    <div className="p-4">
      <nav>
        <Link to="/messages">Messages</Link>
      </nav>
      <Routes>
        <Route path="/messages" element={<MessagesPage />} />
      </Routes>
    </div>
  )
}
