// UsersList.jsx

import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, moveOrCreateChatUser } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

export const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

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
    <div className="home">
      <div className="container">
        <div className="usersListContainer">
          {users
            .filter((user) => user.uid !== currentUser.uid)
            .map((user) => (
              <div key={user.uid} className="userCard">
                <div className="userDetails">
                  <img
                    src={user.photoURL || ''}
                    alt={user.displayName || ''}
                    className="userImage"
                  />
                  <div>
                    <p className="userName">{user.displayName}</p>
                    <p className="userEmail">{user.email}</p>
                  </div>
                </div>
                <div className="userActions">
                  <button
                    className="button"
                    onClick={() => handleUserClick(user)}
                  >
                    Przejdź do czatu
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
