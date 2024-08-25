import clsx from 'clsx';
import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import Button from '../../components/basics/Button';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';

export const UsersList = ({
  onUserClick,
  buttonLabel,
  className,
  btnProps,
  isModal,
}) => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const { currentUser } = useContext(AuthContext);

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

  const handleUserClick = (user) => {
    onUserClick(user);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.uid !== currentUser.uid &&
      (user.displayName?.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchInput.toLowerCase()))
  );

  return (
    <div className={clsx('flex flex-col mx-auto p-5', className)}>
      <div
        className={clsx(
          'flex flex-col text-white bg-zinc-50 dark:bg-gray-800 p-5 rounded-xl overflow-auto max-h-dvh',
          isModal && 'max-h-[80dvh]'
        )}
      >
        <h3 className="mb-5 text-xl font-bold bg-violet-400 p-4 rounded-xl">
          Users List
        </h3>
        <div className="mb-5">
          <input
            type="text"
            placeholder="Szukaj..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-700 bg-zinc-50 dark:bg-gray-800 text-black dark:text-white"
          />
        </div>
        <div className="flex-1 mb-5 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.uid}
              className="flex items-center justify-between p-4 mb-4 bg-zinc-50 dark:bg-gray-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-gray-700 flex-wrap"
            >
              <div className="flex items-center space-x-1 md:space-x-2 overflow-hidden">
                <img
                  src={user.photoURL || './avatar.png'}
                  alt={user.displayName || ''}
                  className="w-10 md:w-16 h-10 md:h-16 rounded-full mr-2"
                />
                <div className="overflow-hidden">
                  <p className="text-lg text-black dark:text-white font-semibold truncate ">
                    {user.displayName}
                  </p>
                  <p className="text-sm text-gray-400  truncate ">
                    {user.email}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => handleUserClick(user)}
                className={btnProps}
              >
                {buttonLabel}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersList;
