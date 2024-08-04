import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import GoogleButton from 'react-google-button';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthTitle from '../../components/basics/AuthTitle';
import Button from '../../components/basics/Button';
import InputField from '../../components/basics/InputField';
import { auth, getFirebaseAuthErrorMessage } from '../../config/firebase';

export const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('User login successfull');
            navigate('/dashboard');
            e.target.reset();
        } catch (error) {
            const message = getFirebaseAuthErrorMessage(error);
            toast.error(message);
            setErrorMessage(message);
        }
    };

    const handleSignInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (!userDocSnap.exists()) {
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                    });
                }

                const userChatsDocRef = doc(db, 'userChats', user.uid);
                const userChatsDocSnap = await getDoc(userChatsDocRef);
                if (!userChatsDocSnap.exists()) {
                    await setDoc(userChatsDocRef, {});
                }
                toast.success('Logged in with Google');
                navigate('/dashboard');
            }
        } catch (error) {
            const errorMessage = getFirebaseAuthErrorMessage(error);
            toast.error(errorMessage);
        }
    };


    return (
        <div className="flex min-h-[100vh] flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="px-4 py-12 lg:px-8 bg-zinc-100 rounded-lg mt-8 w-full md:max-w-[500px]">
                <AuthTitle title="Sign in to your account" />
                <form className="space-y-4" onSubmit={handleSignIn}>
                    <InputField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="Enter email"
                        autoComplete="email"
                        required
                    />
                    <InputField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="Enter password"
                        autoComplete="current-password"
                        required
                    />
                    <Link
                        to="/new-password"
                        className=" text-zinc-600 hover:text-indigo-500 text-xs"
                    >
                        Forgot password?
                    </Link>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                    <div>
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                    </div>
                </form>
                <span className="block text-center my-2 text-sm font-medium leading-6 ">
                    Or
                </span>
                {/* //todo: mozna stworzyc custom button zeby passowal wygladem i uzyc tej funkcji handleSignInWithGoogle */}
                <GoogleButton
                    onClick={handleSignInWithGoogle}
                    style={{
                        width: '100%',
                        borderRadius: '0.375rem',
                        overflow: 'hidden',
                    }}
                />
            </div>
            <p className="mt-10 text-center text-sm text-gray-400">
                Not a member?{' '}
                <Link
                    to="/register"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                    Register now
                </Link>
            </p>
        </div>
    );
};
