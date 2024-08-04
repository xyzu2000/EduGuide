// SelectUser.jsx

import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';

const SelectUser = ({ onSelect }) => {
    const { currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const usersData = usersSnapshot.docs
                    .map((doc) => doc.data())
                    .filter((user) => user.uid !== currentUser.uid); // Exclude current user
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [currentUser]);

    return (
        <select onChange={(e) => onSelect(e.target.value)} className="selectUser text-black">
            <option  >Wybierz użytkownika</option>
            {users.map((user) => (
                <option key={user.uid} value={user.uid} >
                    {user.displayName}
                </option>
            ))}
        </select>
    );
};

export default SelectUser;
