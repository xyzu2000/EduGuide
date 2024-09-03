import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './loadingPage/LoadingSpinner';

const PublicRoute = () => {
    const { currentUser } = useContext(AuthContext) || {};
    const [checkingAuth, setCheckingAuth] = useState(true);
    const backgroundImg = './background.png';

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
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className=" bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImg})` }}>
            <Outlet />
        </div>
    );
};

export default PublicRoute;