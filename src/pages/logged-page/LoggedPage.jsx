import React, { useContext } from 'react';
import { FaCalendarAlt, FaComments, FaRobot } from 'react-icons/fa';
import { LuListTodo } from 'react-icons/lu';
import { MdCreditCard } from 'react-icons/md';
import { TbChevronRight } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import basicUserImg from '../../assets/images/user.png';
import LoadingSpinner from '../../components/loadingPage/LoadingSpinner';
import { moveOrCreateChatUser } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { UsersList } from '../../pages/users/UsersList';

export const LoggedPage = () => {
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    const navigate = useNavigate();
    const availableWidgets = [
        {
            id: 'chats',
            name: 'Chats',
            path: '/chats',
            icon: <FaComments />,
            description: 'Chat with other users',
        },
        {
            id: 'chatBot',
            name: 'ChatBot',
            path: '/chatBot',
            icon: <FaRobot />,
            description: 'Get assistance from the ChatBot',
        },
        {
            id: 'calendar',
            name: 'Scheduler',
            path: '/scheduler',
            icon: <FaCalendarAlt />,
            description: 'Manage your events and meetings',
        },
        {
            id: 'flashcards',
            name: 'Flashcards',
            path: '/flashcards',
            icon: <MdCreditCard />,
            description: 'Create and share your flashcards',
        },
        {
            id: 'pomodoro',
            name: 'Pomodoros',
            path: '/pomodoro',
            icon: <LuListTodo />,
            description: 'Track your study time',
        },
    ];

    if (!currentUser) {
        return <LoadingSpinner />;
    }

    const handleUserClick = async (user) => {
        try {
            await moveOrCreateChatUser(currentUser, user);
            dispatch({ type: 'CHANGE_USER', payload: user });
            navigate('/chats');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen  text-gray-900 dark:text-gray-100 flex flex-col items-center">
            <div className="grid gird-cols-1 lg:grid-cols-2 w-full gap-8">
                <div className="bg-zinc-50 dark:bg-gray-800 shadow-lg rounded-lg lg:p-6 w-full mb-8 justify-items-stretch">
                    <div className="flex flex-col items-center">
                        <img
                            src={currentUser.photoURL || basicUserImg}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mb-4 border-4 border-indigo-500"
                        />
                        <h1 className="text-2xl font-semibold mb-2">{`Welcome, ${currentUser.displayName}!`}</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{`Email: ${currentUser.email}`}</p>
                        <Link
                            to="/update-profile"
                            className="text-indigo-600 hover:underline"
                        >
                            Edit profile
                        </Link>
                    </div>
                    <div className="flex flex-col gap-6 w-full  mb-8">
                        {availableWidgets.map((widget) => (
                            <Link
                                key={widget.path}
                                to={widget.path}
                                className="bg-zinc-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                            >
                                <div className="flex items-center mb-4">
                                    <span className="text-2xl text-indigo-600 mr-2">
                                        {widget.icon}
                                    </span>
                                    <h2 className="text-xl font-bold">{widget.name}</h2>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {widget.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="bg-zinc-50 dark:bg-gray-800 shadow-lg rounded-lg w-full lg:mb-8 justify-items-stretch">
                    <UsersList
                        className="relative top-0 left-0 w-full max-h-full overflow-y-auto bg-none p-0 mx-0 max-w-none"
                        buttonLabel={<TbChevronRight />}
                        onUserClick={(user) => handleUserClick(user)}
                        btnProps="min-w-4"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoggedPage;
