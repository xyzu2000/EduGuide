import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ChatPage from './components/chat/ChatPage';
import { ChatBot } from './components/chatBot/ChatBot';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import FlashcardList from './pages/flashcards/FlashcardList';
import NewPassword from './pages/forgot-password/NewPassword';
import { LoggedPage } from './pages/logged-page/LoggedPage';
import { Scheduler } from './pages/scheduler/Scheduler';
import { UpdateProfile } from './pages/updateProfile/UpdateProfile';

const App = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-dvh">
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/new-password" element={<NewPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<LoggedPage />} />
            <Route path="/chats" element={<ChatPage />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/flashcards" element={<FlashcardList />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/logout" element={<Navigate to="/" />} />
          </Route>
        </Routes>
        <ToastContainer
          position="bottom-right"
          theme="colored"
          autoClose={2000}
        />
      </BrowserRouter>
    </div>
  );
};

export default App;