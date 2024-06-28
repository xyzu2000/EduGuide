import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SideNav from './SideNav';
import LoadingSpinner from './loadingPage/LoadingSpinner';

export const ProtectedRoute = () => {
  const { currentUser } = useContext(AuthContext) || {};
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      setTimeout(() => {
        if (!currentUser) {
          navigate('/');
        }
        setCheckingAuth(false);
      }, 500);
    };

    checkAuthStatus();
  }, [currentUser, navigate]);

  if (checkingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SideNav />
      <Outlet />
    </>
  );
};


export default ProtectedRoute;
