import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SideNav from './SideNav';

export const ProtectedRoute = () => {
  const { currentUser } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  if (!currentUser) {
    return navigate('/login');
  }

  return (
    <>
      <SideNav />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
