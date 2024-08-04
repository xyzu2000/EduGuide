import clsx from 'clsx';
import { signOut } from 'firebase/auth';
import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdCreditCard } from "react-icons/md";
import {
  TbCalendar,
  TbHome,
  TbMessage,
  TbMessageChatbot,
  TbSettings,
} from 'react-icons/tb';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/images/logo.svg';
import { auth } from '../config/firebase';
import Toggle from './toggle/Toggle';

const menuItems = [
  {
    path: '/dashboard',
    name: 'Welcome',
    icon: <TbHome />,
  },
  {
    path: '/chats',
    name: 'Chats',
    icon: <TbMessage />,
  },
  {
    path: '/chatbot',
    name: 'chatBot',
    icon: <TbMessageChatbot />,
  },
  {
    path: '/scheduler',
    name: 'Scheduler',
    icon: <TbCalendar />,
  },
  {
    path: '/flashcards',
    name: 'Flashcards',
    icon: <MdCreditCard />,
  }
];

const downMenuItems = [
  {
    path: '/update-profile',
    name: 'Profile',
    icon: <TbSettings />,
  },
];

const SideNav = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location.pathname);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('User logout', { position: 'top-center' });
      navigate('/');
    } catch (error) {
      toast.error(`User logout failed, ${error}`, {
        position: 'bottom-center',
      });
    }
  };

  return (
    <div
      className={clsx(
        'fixed left-0 top-0 h-dvh bg-background-sideLight dark:bg-background-sideDark shadow-sm',
        className
      )}
    >
      <div className="space-y-4 py-4 h-full">
        <div className="flex flex-col py-2 h-full">
          <Link to="/dashboard" className="px-6 mb-12">
            <img src={logo} className="w-8 mb-2" alt="" />
            <h2 className="mb-2 text-xl font-bold tracking-tight">Edu Guide</h2>
          </Link>
          <div className='mb-2'>
            <Toggle />
          </div>
          <div className="flex-1 flex flex-col">
            {menuItems.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={clsx(
                  'flex items-center px-6 py-3 gap-3 w-full transition-colors duration-300 ',
                  location.pathname === item.path
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'hover:bg-zinc-200'
                )}
              >
                <div className="text-lg">{item.icon}</div>
                <p className="text-sm font-medium">{item.name}</p>
              </NavLink>
            ))}
            <div className="mt-auto flex-col">
              {downMenuItems.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className={clsx(
                    'flex items-center px-6 py-3 gap-3 w-full transition-colors duration-300 ',
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'hover:bg-zinc-200'
                  )}
                >
                  <div className="text-lg">{item.icon}</div>
                  <p className="text-sm font-medium">{item.name}</p>
                </NavLink>
              ))}
              <button
                className="flex items-center px-6 py-3 gap-3 w-full transition-colors duration-300 hover:bg-zinc-200 mt-auto"
                onClick={handleLogout}
              >
                <div className="text-lg">
                  <FaSignOutAlt />
                </div>
                <p className="text-sm font-medium">Sign out</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;