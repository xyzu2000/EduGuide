import { doc, getDoc } from 'firebase/firestore';
import { createContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userTheme, setUserTheme] = useState(null)
  const fetchUserData = async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentUser({ ...user, ...docSnap.data() });
        setUserTheme(docSnap.data().darkMode)
      } else {
        console.log("User document not found in Firestore");
      }
    } else {
      setCurrentUser(null);
    }
  };

  const refreshUserData = () => {
    const user = auth.currentUser;
    fetchUserData(user);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      fetchUserData(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, refreshUserData, userTheme }}>
      {children}
    </AuthContext.Provider>
  );
};