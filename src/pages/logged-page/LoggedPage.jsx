import React, { useContext } from 'react';
import { FaBell, FaCalendarAlt, FaComments, FaHistory, FaRobot, FaUserFriends } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import basicUserImg from "../../assets/images/user.png";
import LoadingSpinner from '../../components/loadingPage/LoadingSpinner';
import { AuthContext } from '../../context/AuthContext';

export const LoggedPage = () => {
    const { currentUser } = useContext(AuthContext);
    const availableWidgets = [
        { id: 'calendar', name: 'Kalendarz', path: '/scheduler', icon: <FaCalendarAlt />, description: 'Zarządzaj swoimi wydarzeniami i spotkaniami' },
        { id: 'chats', name: 'Czaty', path: '/chats', icon: <FaComments />, description: 'Rozmawiaj z innymi użytkownikami' },
        { id: 'users', name: 'Lista użytkowników', path: '/users', icon: <FaUserFriends />, description: 'Zobacz listę zarejestrowanych użytkowników' },
        { id: 'chatBot', name: 'ChatBot', path: '/chatBot', icon: <FaRobot />, description: 'Skorzystaj z pomocy ChatBota' },
        { id: 'notifications', name: 'Powiadomienia', path: '/notifications', icon: <FaBell />, description: 'Przeglądaj swoje powiadomienia' },
        { id: 'activity', name: 'Ostatnie aktywności', path: '/activity', icon: <FaHistory />, description: 'Śledź swoje ostatnie aktywności' }
    ];
    if (!currentUser) {
        return <LoadingSpinner />
    }
    return (
        <div className='min-h-[100vh] w-full flex flex-col items-center justify-center p-5 text-black dark:text-white   '>
            <div className='border-2 border-indigo-700 p-5 m-2 rounded-md w-full max-w-lg text-center'>
                <h1 className='text-2xl mb-4'>Witaj, {currentUser.displayName}!</h1>
                <img
                    src={currentUser.photoURL || basicUserImg}
                    alt="Profile"
                    className='w-32 h-32 rounded-full mx-auto mb-4'
                />
                <p>Email: {currentUser.email}</p>
                <Link to="/updateProfile" className='text-blue-500 mt-4 inline-block'>Edytuj profil</Link>
            </div>

            <div className='mt-8 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {availableWidgets.map((widget) => (
                    <Link key={widget.path} to={widget.path} className='border p-4 rounded-lg shadow-lg hover:shadow-xl transition'>
                        <h2 className='text-xl font-bold flex items-center '>
                            {widget.icon} <span className="ml-2">{widget.name}</span>
                        </h2>
                        <p className='mt-2'>{widget.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LoggedPage;
