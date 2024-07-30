import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, moveOrCreateChatUser } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

export const UsersList = ({ handleModal, modal }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState(''); // Stan do zarządzania tekstem wyszukiwania
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
      handleModal(modal)
      // navigate('/chats');
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.uid !== currentUser.uid &&
    (user.displayName?.toLowerCase().includes(searchInput.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchInput.toLowerCase()))
  );

  return (
    <div className="fixed inset-20 max-w-max max-h-[80%] h-screen flex flex-col mx-auto p-5">
      <div className="flex flex-col text-white bg-gray-900 p-5 rounded-xl overflow-auto">
        <h3 className="mb-5 text-xl font-bold bg-violet-400 p-4 rounded-xl ">
          Lista Użytkowników
        </h3>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Szukaj..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
          />
        </div>
        <div className=" flex-1 overflow-auto mb-5">
          {filteredUsers.map((user) => (
            <div key={user.uid} className=" flex items-center justify-between p-4 mb-4 bg-gray-800 rounded-xl">
              <div className="userDetails flex items-center space-x-4">
                <img
                  src={user.photoURL || ''}
                  alt={user.displayName || ''}
                  className="userImage w-16 h-16 rounded-full"
                />
                <div>
                  <p className="userName text-lg font-semibold">{user.displayName}</p>
                  <p className="userEmail text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="userActions">
                <button
                  className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
