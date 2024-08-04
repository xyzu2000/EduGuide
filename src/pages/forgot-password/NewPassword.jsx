import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthTitle from '../../components/basics/AuthTitle';
import InputField from '../../components/basics/InputField';

const NewPassword = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    const handleResetPassword = async (e) => {
        e.preventDefault()
        const email = e.target.email.value;
        console.log(email)
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


    return (
        <div className="flex min-h-[100vh] flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="px-4 py-12 lg:px-8 bg-zinc-100 rounded-lg mt-8 w-full md:max-w-[500px]">

                <AuthTitle title="Remind password" />

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-2 rounded-md p-8 shadow-2xl backdrop-blur-md">
                    <form className="space-y-4" onSubmit={handleResetPassword}>
                        <InputField
                            id="email"
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="Enter email"
                            autoComplete="email"
                            required
                        />

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
