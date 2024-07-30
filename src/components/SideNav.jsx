import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { FaBars, FaCommentAlt, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { IoSettingsSharp } from "react-icons/io5";
import { TbMessageChatbot } from 'react-icons/tb';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { auth } from '../config/firebase';


const SideNav = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/logged',
      name: 'Welcome',
      icon: <FaHome />,
    },
    {
      path: '/chats',
      name: 'Chats',
      icon: <FaCommentAlt />,
    },
    {
      path: '/chatBot',
      name: 'chatBot',
      icon: <TbMessageChatbot />,
    },
    {
      path: '/scheduler',
      name: 'Scheduler',
      icon: <CiCalendar />,
    },
    {
      path: '/updateProfile',
      name: 'Update Profile',
      icon: <IoSettingsSharp />,
    },
  ];

  const logoutItem = {
    name: 'Wyloguj',
    icon: <FaSignOutAlt />,
  };
  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("User logout", { position: "top-center" })
      navigate('/');
    } catch (error) {
      toast.error(`User logout failed, ${error}`, { position: "bottom-center" })
    }
  };
  return (
    <div className="flex">
      <div
        className={`fixed left-0 top-0 z-10 bg-black text-white h-screen overflow-x-hidden flex flex-col items-center transition-width duration-300 ${isOpen ? 'w-48' : 'w-12'
          }`}
      >
        <div className="flex flex-col items-center justify-center py-4 w-full">
          <h1 className={`text-2xl ${isOpen ? 'block' : 'hidden'}`}>Edu Guide</h1>
          <div className="mt-4">
            <FaBars className="text-xl cursor-pointer" onClick={toggle} />
          </div>
        </div>
        <div className={`flex-1 flex flex-col w-full`}>
          {menuItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="flex items-center justify-center text-white p-2 gap-3 w-full transition-colors duration-300 hover:bg-violet-200 hover:text-black"
            >
              <div className="text-xl">{item.icon}</div>
              <div className={`${isOpen ? 'block' : 'hidden'}`}>{item.name}</div>
            </NavLink>
          ))}
        </div>
        <div className="flex items-center justify-center p-2 gap-3 cursor-pointer w-full hover:bg-violet-200 hover:text-black transition-colors duration-300" onClick={handleLogout}>
          <div className="text-xl ">{logoutItem.icon}</div>
          <div className={`${isOpen ? 'block' : 'hidden'}`}>{logoutItem.name}</div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
