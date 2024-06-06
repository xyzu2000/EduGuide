import { signOut } from 'firebase/auth';
import React, { useState } from 'react';
import { CiCalendar } from 'react-icons/ci';
import { FaBars, FaCommentAlt, FaHome, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { TbMessageChatbot } from 'react-icons/tb';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

const SideNav = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/',
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
      path: '/users',
      name: 'Users',
      icon: <FaUserAlt />,
    },
    {
      path: '/scheduler',
      name: 'Scheduler',
      icon: <CiCalendar />,
    },
  ];

  const logoutItem = {
    name: 'Wyloguj',
    icon: <FaSignOutAlt />,
  };
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };
  return (
    <div>
      <div style={{ width: isOpen ? '200px' : '50px' }} className={`sideNav ${isOpen ? 'open' : ''}`}>
        <div className="top_section">
          <h1 style={{ display: isOpen ? 'block' : 'none' }} className="logo">
            CHAT APP
          </h1>
          <div style={{ marginLeft: isOpen ? '50px' : '0px' }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuItems.map((item, index) => (
          <NavLink to={item.path} key={index} className="link" activeClassName="active">
            <div className="icon">{item.icon}</div>
            <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
              {item.name}
            </div>
          </NavLink>
        ))}
        <div className="bottom_section">
          <div className="link" onClick={handleLogout}>
            <div className="icon">{logoutItem.icon}</div>
            <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
              {logoutItem.name}
            </div>
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default SideNav;
