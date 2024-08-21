import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword,
} from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import basicUserImg from '../../assets/images/user.png';
import Button from '../../components/basics/Button';
import InputField from '../../components/basics/InputField';
import PageTitle from '../../components/basics/PageTitle';
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

    // Wczytanie danych użytkownika po załadowaniu komponentu
    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
            setPhotoURL(currentUser.photoURL || basicUserImg);
        }
    }, [currentUser]);

    // Obsługa wyboru avatara
    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setPhotoURL(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    // Aktualizacja profilu
    const handleUpdateProfile = async () => {
        if (!currentUser) return;

        setLoading(true);
        const userDocRef = doc(db, 'users', currentUser.uid);

        try {
            await updateDoc(userDocRef, {
                displayName,
                photoURL,
            });
            refreshUserData();

            toast.success('Profile updated successfully', { position: 'bottom-right' });
        } catch (error) {
            toast.error(`Failed to update profile: ${error.message}`, {
                position: 'bottom-right'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentUser) return;

        if (newPassword !== confirmNewPassword) {
            toast.error('Passwords do not match', { position: 'bottom-right' });
            return;
        }

        setLoading(true);

        try {
            const user = auth.currentUser;

            if (user.providerData[0].providerId === 'password') {
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                toast.success('Password updated successfully', { position: 'bottom-right' });
            } else {
                toast.error(
                    'Password change is only available for email/password accounts',
                    { position: 'bottom-right' }
                );
            }
        } catch (error) {
            toast.error(`Failed to update password: ${error.message}`, {
                position: 'bottom-right',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageTitle title="Account" />
            <div className="flex flex-col gap-2 bg-background-chatLight dark:bg-background-chatDark p-6 rounded-lg">
                <h2 className="text-xl font-bold flex items-center">Profile
                    <img
                        src={photoURL}
                        alt="Profile"
                        className="rounded-xl h-14 w-14 ml-2"
                    />
                </h2>

                {/* Sekcja wyboru avatara */}
                <div>
                    <span className="block text-sm font-medium leading-6">Avatar</span>
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-10 h-10 mb-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleAvatar}
                        />
                    </label>
                </div>

                <InputField
                    id="displayName"
                    type="text"
                    value={displayName}
                    label="Display name"
                    placeholder="Enter display name"
                    onChange={(e) => setDisplayName(e.target.value)}
                />

                <div className="mt-4">
                    <Button onClick={handleUpdateProfile} disabled={loading}>
                        {loading ? 'Loading...' : 'Save'}
                    </Button>
                </div>
            </div>

            {currentUser && currentUser.providerData[0].providerId === 'password' && (
                <div className="flex flex-col gap-2 bg-background-chatLight dark:bg-background-chatDark p-6 rounded-lg mt-8">
                    <h2 className="text-xl font-bold mb-4">Change password</h2>
                    <InputField
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Current password"
                        placeholder="Enter current password"
                    />
                    <InputField
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        label="New password"
                        placeholder="Enter new password"
                    />
                    <InputField
                        id="confirmNewPassword"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        label="Confirm new password"
                        placeholder="Enter password"
                    />
                    <div className="mt-4">
                        <Button onClick={handleChangePassword} disabled={loading}>
                            {loading ? 'Loading...' : 'Save'}
                        </Button>
                    </div>
                    {currentUser &&
                        currentUser.providerData[0].providerId !== 'password' && (
                            <p className="text-center mt-4 text-gray-600">
                                Password change is not available for Google login. Please change
                                your password through your Google account settings.
                            </p>
                        )}
                </div>
            )}
        </>
    );
};

export default UpdateProfile;
