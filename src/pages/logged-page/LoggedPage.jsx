import React, { useContext } from 'react';
import { FaCalendarAlt, FaComments, FaRobot } from 'react-icons/fa';
import { LuListTodo } from "react-icons/lu";
import { MdCreditCard } from 'react-icons/md';
import { Link } from 'react-router-dom';
import basicUserImg from "../../assets/images/user.png";
import LoadingSpinner from '../../components/loadingPage/LoadingSpinner';
import { AuthContext } from '../../context/AuthContext';

export const LoggedPage = () => {
    const { currentUser } = useContext(AuthContext);
    const availableWidgets = [
        { id: 'chats', name: 'Czaty', path: '/chats', icon: <FaComments />, description: 'Rozmawiaj z innymi użytkownikami' },
        { id: 'chatBot', name: 'ChatBot', path: '/chatBot', icon: <FaRobot />, description: 'Skorzystaj z pomocy ChatBota' },
        { id: 'calendar', name: 'Calendar', path: '/scheduler', icon: <FaCalendarAlt />, description: 'Zarządzaj swoimi wydarzeniami i spotkaniami' },
        { id: 'flashcards', name: 'Flashcards', path: '/flashcards', icon: <MdCreditCard />, description: 'Tworz oraz udostepniaj swoje fiszki' },
        { id: 'pomodoro', name: 'Pomodoros', path: '/pomodoro', icon: <LuListTodo />, description: 'Odliczaj czas swojej nauki' },
        // { id: 'users', name: 'Lista użytkowników', path: '/users', icon: <FaUserFriends />, description: 'Zobacz listę zarejestrowanych użytkowników' },
        // { id: 'notifications', name: 'Powiadomienia', path: '/notifications', icon: <FaBell />, description: 'Przeglądaj swoje powiadomienia' },
        // { id: 'activity', name: 'Ostatnie aktywności', path: '/activity', icon: <FaHistory />, description: 'Śledź swoje ostatnie aktywności' }
    ];
    if (!currentUser) {
        return <LoadingSpinner />
    }


    return (
        <div className="min-h-screen  text-gray-900 dark:text-gray-100 flex flex-col items-center p-6">
            <div className='grid grid-cols-2'>
                {/* Profile Section */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
                    <div className="flex flex-col items-center">
                        <img
                            src={currentUser.photoURL || basicUserImg}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mb-4 border-4 border-indigo-500"
                        />
                        <h1 className="text-2xl font-semibold mb-2">{`Witaj, ${currentUser.displayName}!`}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{`Email: ${currentUser.email}`}</p>
                        <Link to="/updateProfile" className="text-indigo-600 hover:underline">
                            Edytuj profil
                        </Link>
                    </div>
                    {/* Widgets Section */}
                    <div className="flex flex-col gap-6 w-full max-w-md mb-8">
                        {availableWidgets.map((widget) => (
                            <Link
                                key={widget.path}
                                to={widget.path}
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                            >
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl text-indigo-600 mr-2">{widget.icon}</span>
                                    <h2 className="text-xl font-bold">{widget.name}</h2>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">{widget.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
                    Users list
                </div>
            </div>
        </div>
    );
};

export default LoggedPage;
