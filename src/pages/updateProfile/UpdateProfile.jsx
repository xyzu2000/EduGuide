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
        const userDocRef = doc(db, 'users', currentUser.uid);

        try {
            await updateDoc(userDocRef, {
                displayName,
                photoURL,
            });

            // Refresh user data in AuthContext
            refreshUserData();

            toast.success('Profile updated successfully', { position: 'top-center' });
        } catch (error) {
            toast.error(`Failed to update profile: ${error.message}`, {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentUser) return;

        if (newPassword !== confirmNewPassword) {
            toast.error('Passwords do not match', { position: 'bottom-center' });
            return;
        }

        setLoading(true);

        try {
            const user = auth.currentUser;

            if (user.providerData[0].providerId === 'password') {
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                toast.success('Password updated successfully', {
                    position: 'top-center',
                });
            } else {
                toast.error(
                    'Password change is only available for email/password accounts',
                    { position: 'bottom-center' }
                );
            }
        } catch (error) {
            toast.error(`Failed to update password: ${error.message}`, {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageTitle title="Account" />
            <div className="flex flex-col gap-2 bg-background-chatLight dark:bg-background-chatDark p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Profile</h2>
                {/* {photoURL && (
          <div className="mb-4">
            <img
              src={photoURL}
              alt="Profile"
              className="rounded-full h-32 w-32 mx-auto"
            />
          </div>
        )} */}
                <InputField
                    id="displayName"
                    type="text"
                    value={displayName}
                    label="Display name"
                    placeholder="Enter display name"
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <InputField
                    id="photoURL"
                    type="text"
                    label="Avatar"
                    placeholder="Enter avatar url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
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
