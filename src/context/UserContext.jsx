import { doc, getDoc } from 'firebase/firestore';
import { createContext, useState } from 'react';
import { db } from '../config/firebase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState({});

    const fetchUserPhotoURL = async (uid) => {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.photoURL;
        }
        return null;
    };

    const getUserPhotoURL = async (uid) => {
        if (!users[uid]) {
            const photoURL = await fetchUserPhotoURL(uid);
            setUsers(prev => ({ ...prev, [uid]: { photoURL } }));
            return photoURL;
        }
        return users[uid].photoURL;
    };

    return (
        <UserContext.Provider value={{ getUserPhotoURL }}>
            {children}
        </UserContext.Provider>
    );
};
