import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthContextProvider } from '../src/context/AuthContext'
import { ChatContextProvider } from '../src/context/ChatContext'
import { UserProvider } from '../src/context/UserContext.jsx'
import App from './App.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <UserProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </UserProvider>
    </ChatContextProvider>
  </AuthContextProvider>
)
