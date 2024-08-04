import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthTitle from '../../components/basics/AuthTitle';
import Button from '../../components/basics/Button';
import InputField from '../../components/basics/InputField';
import { auth, db } from '../../config/firebase';

export const Register = () => {
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState('');

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            //todo: dodać sprawdzenie czy jest to plik graficzny i czy nie jest za duży jesli jest błąd to wyświetlic powiadomenie

            reader.onloadend = () => {
                setAvatar(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log('current user at Register: ', user);
            console.log('User registered successfully');
            if (user) {
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    displayName: displayName,
                    email: email,
                    photoURL: avatar || './avatar.png',
                    blocked: [],
                });
                await setDoc(doc(db, 'userChats', user.uid), {
                    chats: [],
                });
            }
            toast.success('User registered successfully', { position: 'top-center' });
            navigate('/dashboard');
        } catch (error) {
            console.error('Error registering user:', error);
            let message = '';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'Email is already in use. Please use a different email.';
                    break;
                case 'auth/weak-password':
                    message =
                        'The password is too weak. Please choose a stronger password.';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address.';
                    break;
                default:
                    message = 'An error occurred. Please try again later.';
            }
            toast.error(message, { position: 'bottom-center' });

            setErrorMessage(message);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handleDisplayNameChange = (e) => {
        setDisplayName(e.target.value);
        console.log('displayName:', displayName);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className="flex min-h-[100vh] flex-col justify-center items-center px-6 py-12 lg:px-8 ">
            <div className="p-4 lg:p-8 bg-zinc-100 rounded-lg mt-8 w-full md:max-w-[600px]">
                <AuthTitle title="Register a new account" />
                <form className="space-y-6" onSubmit={handleSignUp}>
                    <div>
                        <span className="block text-sm font-medium leading-6 ">Avatar</span>
                        <label
                            for="dropzone-file"
                            class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 "
                        >
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt=""
                                        className="w-32 h-32 rounded-full border-indigo-800 border-1"
                                    />
                                ) : (
                                    <>
                                        <svg
                                            class="w-10 h-10 mb-3 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            ></path>
                                        </svg>
                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="font-semibold">Klinij aby dodać</span> lub
                                            przenieś plik i upuść go.
                                        </p>
                                    </>
                                )}
                            </div>
                            <input
                                id="dropzone-file"
                                type="file"
                                class="hidden"
                                onChange={handleAvatar}
                            />
                        </label>
                    </div>

                    <InputField
                        id="email"
                        onChange={handleEmailChange}
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="Enter email"
                        autoComplete="email"
                        required
                    />
                    <InputField
                        id="displayName"
                        onChange={handleDisplayNameChange}
                        name="displayName"
                        type="text"
                        autoComplete="displayName"
                        required
                        label="Display name"
                        placeholder="Enter display name"
                    />

                    <InputField
                        id="password"
                        onChange={handlePasswordChange}
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        label="Password"
                        placeholder="Enter password"
                    />
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <div>
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </div>
                </form>
            </div>
            <p className="mt-10 text-center text-sm text-gray-400">
                Already a member?{' '}
                <Link
                    to="/"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default Register;
