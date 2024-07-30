import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import basicUserImg from '../../assets/images/user.png';
import { auth, db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
export const UpdateProfile = () => {
    const { currentUser, refreshUserData } = useContext(AuthContext);
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    //dodac warunek kiedy puste ktores jest - dodac required (form) onSubmit
    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
            setPhotoURL(currentUser.photoURL || basicUserImg);
        }
    }, [currentUser]);

    const handleUpdateProfile = async () => {
        if (!currentUser) return;

        setLoading(true);
        const userDocRef = doc(db, "users", currentUser.uid);

        try {
            await updateDoc(userDocRef, {
                displayName,
                photoURL,
            });

            // Refresh user data in AuthContext
            refreshUserData();

            toast.success("Profile updated successfully", { position: "top-center" });
        } catch (error) {
            toast.error(`Failed to update profile: ${error.message}`, { position: "bottom-center" });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentUser) return;

        if (newPassword !== confirmNewPassword) {
            toast.error("Passwords do not match", { position: "bottom-center" });
            return;
        }

        setLoading(true);

        try {
            const user = auth.currentUser;

            if (user.providerData[0].providerId === 'password') {
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                toast.success("Password updated successfully", { position: "top-center" });
            } else {
                toast.error("Password change is only available for email/password accounts", { position: "bottom-center" });
            }
        } catch (error) {
            toast.error(`Failed to update password: ${error.message}`, { position: "bottom-center" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen min-w-full p-5">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8 w-full max-w-5xl">
                <h1 className="text-2xl font-bold mb-4 text-center inline-block bg-violet-400 p-4 rounded-xl">
                    Update Profile
                </h1>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="displayName">
                        Display Name
                    </label>
                    <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photoURL">
                        Photo URL
                    </label>
                    <input
                        id="photoURL"
                        type="text"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                {photoURL && (
                    <div className="mb-4">
                        <img src={photoURL} alt="Profile" className="rounded-full h-32 w-32 mx-auto" />
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleUpdateProfile}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
                {currentUser && currentUser.providerData[0].providerId === 'password' && (
                    <>
                        <h2 className="text-xl font-bold mt-6 mb-4 text-center inline-block bg-violet-400 p-4 rounded-xl">
                            Change Password
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Current Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmNewPassword">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmNewPassword"
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleChangePassword}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Change Password"}
                            </button>
                        </div>
                    </>
                )}
                {currentUser && currentUser.providerData[0].providerId !== 'password' && (
                    <p className="text-center mt-4 text-gray-600">
                        Password change is not available for Google login. Please change your password through your Google account settings.
                    </p>
                )}
            </div>
        </div>
    );



};

export default UpdateProfile;
