// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: "G-ZCB7CM739T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const analytics = getAnalytics(app);
export const storage = getStorage();
export const db = getFirestore();
export const provider = new GoogleAuthProvider()

// export const signInWithGoogle = () => {
//     signInWithPopup(auth, provider).then((results) => {
//         console.log(results)
//         const authInfo = {
//             userID: results.user.uid,
//             name: results.user.displayName,
//             profilePhoto: results.user.photoURL,
//             isAuth: true
//         }
//     }).catch((error) => {
//         console.log(error)
//     })
// }

export function getFirebaseAuthErrorMessage(error) {
    let errorMessage;

    switch (error.code) {
        case 'auth/invalid-credential':
            errorMessage = 'Invalid credentials.';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
        case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.';
            break;
        case 'auth/user-not-found':
            errorMessage = 'No user found with this email address.';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
        case 'auth/email-already-in-use':
            errorMessage = 'This email address is already in use by another account.';
            break;
        case 'auth/operation-not-allowed':
            errorMessage = 'Signing in is currently disabled.';
            break;
        case 'auth/weak-password':
            errorMessage = 'The password is too weak.';
            break;
        default:
            errorMessage = 'An unknown error occurred.';
    }

    return errorMessage;
}

export const getUsersList = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = [];

    usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        usersList.push(userData.displayName);
    });

    return usersList;
};

export const moveOrCreateChatUser = async (currentUser, user) => {
    const combinedId =
        currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;
    try {
        const res = await getDoc(doc(db, 'chats', combinedId));
        if (!res.exists()) {
            await setDoc(doc(db, 'chats', combinedId), { messages: [] });
            await updateDoc(doc(db, 'userChats', currentUser.uid), {
                [combinedId + '.userInfo']: {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                },
                [combinedId + '.date']: serverTimestamp(),
            });

            await updateDoc(doc(db, 'userChats', user.uid), {
                [combinedId + '.userInfo']: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                },
                [combinedId + '.date']: serverTimestamp(),
            });
        }
    } catch (err) {
        throw new Error('Nie udało się utworzyć czatu');
    }
};
