import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SideNav from './SideNav';
import LoadingSpinner from './loadingPage/LoadingSpinner';

export const ProtectedRoute = () => {
  const { currentUser } = useContext(AuthContext) || {};
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    const checkAuthStatus = () => {
      setTimeout(() => {
        if (!currentUser) {
          navigate(location.pathname, { replace: true })
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
      {/* dodac klase na kontener */}
      <Outlet />
    </>
  );
};


export default ProtectedRoute;
