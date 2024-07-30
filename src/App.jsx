import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ChatPage from "./components/chat/ChatPage";
import { ChatBot } from './components/chatBot/ChatBot';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import NewPassword from './pages/forgot-password/NewPassword';
import { LoggedPage } from './pages/logged-page/LoggedPage';
import { Scheduler } from './pages/scheduler/Scheduler';
import { UpdateProfile } from './pages/updateProfile/UpdateProfile';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/new-password" element={<NewPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/logged" element={<LoggedPage />} />
          <Route path="chats" element={<ChatPage />} />
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="chatBot" element={<ChatBot />} />
          <Route path="/updateProfile" element={<UpdateProfile />} />
          <Route path="/logout" element={<Navigate to="/" />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
