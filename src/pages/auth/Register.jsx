import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import logo from '../../assets/images/logo.svg'
import { auth, db, storage } from '../../config/firebase'
import { useNavigate, Link } from "react-router-dom"

export const Register = () => {
    const [email, setEmail] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            // Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            // Create user data in Firestore
            await db.collection('users').doc(res.user.uid).set({
                uid: res.user.uid,
                displayName,
                email,
            });

            // Redirect to home page after successful registration
            navigate('/');
        } catch (error) {
            console.error('Error registering user:', error);
            let message = '';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'Email is already in use. Please use a different email.';
                    break;
                case 'auth/weak-password':
                    message = 'The password is too weak. Please choose a stronger password.';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address.';
                    break;
                default:
                    message = 'An error occurred. Please try again later.';
            }
            setErrorMessage(message);
        }
    };

    const handleemailChange = (e) => { setEmail(e.target.value) }
    const handleDisplayNameChange = (e) => { setDisplayName(e.target.value) }
    const handlepasswordChange = (e) => { setPassword(e.target.value) }

    return (
        <div className="flex min-h-[100vh] flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-16 w-auto" src={logo} />
                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register a new account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-2 rounded-md p-8">
                <form className="space-y-6" onSubmit={handleSignUp}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                onChange={handleemailChange}
                                name="email"
                                type="email"
                                autoComplete="email"
                                required className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="displayName"
                            className="block text-sm font-medium leading-6 text-gray-900">
                            Display name
                        </label>
                        <div className="mt-2">
                            <input
                                id="displayName"
                                onChange={handleDisplayNameChange}
                                name="displayName"
                                type="text"
                                autoComplete="displayName"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input id="password"
                                onChange={handlepasswordChange}
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                    <div>
                        <button type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Register
                        </button>
                    </div>
                </form>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
                Already a member?
                <a
                    href="/"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Sign in
                </a>
            </p>
        </div>
    )
}

export default Register