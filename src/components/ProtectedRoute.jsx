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
      <div className="pl-[148px]">
        <div className="p-4 sm:p-6 lg:p-20">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ProtectedRoute;