import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { setApiTokenGetter } from './shared/http/api-client'
import { authTokenSignal } from './features/auth/state/auth.signals'

setApiTokenGetter(() => authTokenSignal.value)

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
