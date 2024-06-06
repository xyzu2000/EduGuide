import React, { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ChatBot } from './components/chatBot/ChatBot';
import { AuthContext } from './context/AuthContext';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Home } from './pages/home-page/Home';
import { LoggedPage } from './pages/logged-page/LoggedPage';
import { Scheduler } from './pages/scheduler/Scheduler';
import { UsersList } from './pages/users/UsersList';

const App = () => {
  const { currentUser } = useContext(AuthContext) || {};
  console.log('Current user:', currentUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LoggedPage />} />

          <Route path="chats" element={<Home />} />

          <Route path="users" element={<UsersList />} />
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="chatBot" element={<ChatBot />} />
          <Route path="/logout" element={<Navigate to="/login" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App