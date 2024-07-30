import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/images/logo.svg';

const NewPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent. Check your inbox.', { position: "top-center" });

            navigate('/');
        } catch (error) {
            console.error('Error sending password reset email:', error);
            let message = '';

            switch (error.code) {
                case 'auth/user-not-found':
                    message = 'User with this email address does not exist.';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address.';
                    break;
                case 'auth/missing-android-pkg-name':
                    message = 'An Android package name must be provided.';
                    break;
                case 'auth/missing-continue-uri':
                    message = 'A continue URL must be provided.';
                    break;
                case 'auth/missing-ios-bundle-id':
                    message = 'An iOS Bundle ID must be provided.';
                    break;
                case 'auth/invalid-continue-uri':
                    message = 'The continue URL provided is invalid.';
                    break;
                case 'auth/unauthorized-continue-uri':
                    message = 'The domain of the continue URL is not whitelisted.';
                    break;
                default:
                    message = 'An error occurred. Please try again later.';
            }

            toast.error(message, { position: "top-center" });
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    return (
        <div className="flex min-h-[100vh] flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-16 w-auto" src={logo} alt="Logo" />
                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-white">Remind password</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-2 rounded-md p-8 shadow-2xl backdrop-blur-md">
                <form className="space-y-6" onSubmit={handleResetPassword}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                onChange={handleEmailChange}
                                value={email}
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>

            <p className="mt-10 text-center text-sm text-gray-400">
                Already a member?
                <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default NewPassword;
