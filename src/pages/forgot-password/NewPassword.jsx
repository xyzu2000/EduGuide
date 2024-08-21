import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthTitle from '../../components/basics/AuthTitle';
import InputField from '../../components/basics/InputField';
import { getFirebaseAuthErrorMessage } from '../../config/firebase';

const NewPassword = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    const handleResetPassword = async (e) => {
        e.preventDefault()
        const email = e.target.email.value;
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent. Check your inbox.', { position: 'bottom-right' });

            navigate('/');
        } catch (error) {
            const message = getFirebaseAuthErrorMessage(error);
            toast.error(message, { position: 'bottom-right' });
            setErrorMessage(message);
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
