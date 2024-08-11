import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from '../src/context/AuthContext';
import { ChatContextProvider } from '../src/context/ChatContext';
import TimerProvider from '../src/context/TimerContext'; // Sprawdź poprawność ścieżki
import { UserProvider } from '../src/context/UserContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <UserProvider>
        <TimerProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </TimerProvider>
      </UserProvider>
    </ChatContextProvider>
  </AuthContextProvider>
);
