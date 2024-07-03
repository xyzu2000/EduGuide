import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useState } from "react"
import { GoogleButton } from 'react-google-button'
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import logo from '../../assets/images/logo.svg'
import { auth, db, provider } from '../../config/firebase'


export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate()

    const handleSignIn = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("User login successfull", { position: "top-center" })
            navigate("/logged");
            e.target.reset();
        } catch (error) {
            console.error("Error signing in:", error);
            let message = '';
            switch (error.code) {
                case 'auth/invalid-email':
                    message = 'Invalid email address.';
                    break;
                case 'auth/user-not-found':
                    message = 'User not found. Please check your email.';
                    break;
                case 'auth/wrong-password':
                    message = 'Incorrect password. Please try again.';
                    break;
                default:
                    message = 'An error occurred. Please try again later.';
            }
            toast.error(message, { position: "bottom-center" })
            setErrorMessage(message);
        }
    }

    const handleEmailChange = (e) => { setEmail(e.target.value) }
    const handlePasswordChange = (e) => { setPassword(e.target.value) }

    const handleSignInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
            const user = auth.currentUser;
            console.log("user:", user.uid, ",", user.email, ",", user.displayName, ",", user.photoURL);
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (!userDocSnap.exists()) {
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL
                    });
                }
            }
            toast.success("Logged with Google", { position: "top-center" });
            navigate("/logged");
        } catch (error) {
            toast.error(error.message, { position: "bottom-center" });
        }
    };


    return (
        <div className="flex min-h-[100vh] flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-16 w-auto"
                    src={logo} />
                <h2
                    className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-2 rounded-md p-8 shadow-2xl">
                <form className="space-y-6" onSubmit={handleSignIn}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                onChange={handleEmailChange}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <Link
                                    to="/new-password"
                                    className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={handlePasswordChange}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Sign in
                        </button>
                    </div>
                </form>

                <label className="block text-center my-4 text-sm font-medium leading-6 text-gray-900">Or</label>
                <div className="flex justify-center">
                    <div className="max-w-[240px] m-auto py-2" >
                        <GoogleButton onClick={handleSignInWithGoogle} />
                    </div>
                </div>
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?
                <Link
                    to="/register"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Register now
                </Link>
            </p>
        </div>
    )
}
