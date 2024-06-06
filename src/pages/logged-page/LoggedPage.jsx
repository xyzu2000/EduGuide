import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export const LoggedPage = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className='min-h-[100vh] w-full flex items-center justify-center'>
            <div className='border-2 border-blue-300 p-5 m-2 rounded-md'>
                <p>User: {currentUser.displayName}</p>
                <img src={currentUser.photoURL} />
                <p>Email: {currentUser.email}</p>
            </div>
        </div>
    );
}

export default LoggedPage