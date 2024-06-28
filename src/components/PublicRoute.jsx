import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './loadingPage/LoadingSpinner';

const PublicRoute = () => {
    const { currentUser } = useContext(AuthContext) || {};
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuthStatus = () => {
            setTimeout(() => {
                setCheckingAuth(false);
            }, 500);
        };

        checkAuthStatus();
    }, [currentUser]);

    if (checkingAuth) {
        return <LoadingSpinner />;
    }

    if (currentUser) {
        return <Navigate to="/logged" />;
    }

    return <Outlet />;
};


export default PublicRoute;
