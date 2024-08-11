import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { GoMute, GoUnmute } from "react-icons/go";
import 'tailwindcss/tailwind.css';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';

const POMODORO_DURATION = 25; // Standardowy czas trwania Pomodoro w minutach
const TIMER_SOUND_URL = './alarm.mp3'; // Ścieżka do pliku dźwiękowego

export const PomodoroTimer = () => {
    const { currentUser } = useContext(AuthContext);
    const [pomodoros, setPomodoros] = useState([]);
    const [currentPomodoro, setCurrentPomodoro] = useState({ title: '', duration: POMODORO_DURATION });
    const [editMode, setEditMode] = useState(null);
    const [editId, setEditId] = useState(null); // Przechowuje ID edytowanego pomodoro
    const [mute, setMute] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetchPomodoros();
        }
    }, [currentUser]);

    useEffect(() => {
        const intervalIds = [];
        pomodoros.forEach(pomodoro => {
            if (pomodoro.isActive) {
                const intervalId = setInterval(() => {
                    setPomodoros(prevPomodoros => {
                        const updatedPomodoros = prevPomodoros.map(p =>
                            p.id === pomodoro.id && p.timeLeft > 0
                                ? { ...p, timeLeft: p.timeLeft - 1 }
                                : p
                        );

                        // Update the time left in Firebase
                        if (currentUser) {
                            const userPomodoroRef = doc(db, 'usersPomodoros', currentUser.uid);
                            setDoc(userPomodoroRef, { pomodoros: updatedPomodoros }, { merge: true });
                        }

                        // Check if any pomodoro is finished
                        const finishedPomodoro = updatedPomodoros.find(p => p.timeLeft === 0 && p.isActive);
                        if (finishedPomodoro) {
                            playNotificationSound();
                        }

                        return updatedPomodoros;
                    });
                }, 1000);
                intervalIds.push(intervalId);
            }
        });

        return () => intervalIds.forEach(clearInterval);
    }, [pomodoros, currentUser?.uid]);

    const handleStart = async (id) => {
        setPomodoros(prevPomodoros => {
            const updatedPomodoros = prevPomodoros.map(pomodoro => {
                if (pomodoro.id === id) {
                    return {
                        ...pomodoro,
                        isActive: true
                    };
                } else if (pomodoro.isActive) {
                    // Stop any other active pomodoro when a new one starts
                    return {
                        ...pomodoro,
                        isActive: false
                    };
                }
                return pomodoro;
            });

            // Update the state and Firebase
            if (currentUser) {
                const userPomodoroRef = doc(db, 'usersPomodoros', currentUser.uid);
                setDoc(userPomodoroRef, { pomodoros: updatedPomodoros }, { merge: true });
            }

            return updatedPomodoros;
        });
    };

    const handleStop = async (id) => {
        setPomodoros(prevPomodoros => {
            const updatedPomodoros = prevPomodoros.map(pomodoro =>
                pomodoro.id === id ? { ...pomodoro, isActive: false } : pomodoro
            );

            if (currentUser) {
                const userPomodoroRef = doc(db, 'usersPomodoros', currentUser.uid);
                setDoc(userPomodoroRef, { pomodoros: updatedPomodoros }, { merge: true });
            }

            return updatedPomodoros;
        });
    };

    const handleReset = async (id) => {
        setPomodoros(prevPomodoros => {
            const updatedPomodoros = prevPomodoros.map(p =>
                p.id === id
                    ? { ...p, timeLeft: p.duration * 60, isActive: false }
                    : p
            );

            // Update the state and Firebase
            if (currentUser) {
                const userPomodoroRef = doc(db, 'usersPomodoros', currentUser.uid);
                setDoc(userPomodoroRef, { pomodoros: updatedPomodoros }, { merge: true });
            }

            return updatedPomodoros;
        });
    };

    const handleSavePomodoro = async () => {
        if (!currentUser) return;

        const userPomodoroRef = doc(db, 'usersPomodoros', currentUser.uid);

        if (editMode) {
            // Edytuj istniejące pomodoro
            const userPomodoroDoc = await getDoc(userPomodoroRef);
            const existingPomodoros = userPomodoroDoc.exists() ? userPomodoroDoc.data().pomodoros : [];

            const updatedPomodoros = existingPomodoros.map(pomodoro =>
                pomodoro.id === editId
                    ? { ...pomodoro, ...currentPomodoro, timeLeft: currentPomodoro.duration * 60 }
                    : pomodoro
            );

            await setDoc(userPomodoroRef, { pomodoros: updatedPomodoros });
            setPomodoros(updatedPomodoros);
            localStorage.setItem(`pomodoros_${currentUser.uid}`, JSON.stringify(updatedPomodoros));
            setEditMode(false);
            setEditId(null);
        } else {
            // Dodaj nowe pomodoro
            const userPomodoroDoc = await getDoc(userPomodoroRef);
            const existingPomodoros = userPomodoroDoc.exists() ? userPomodoroDoc.data().pomodoros : [];

            const newPomodoro = {
                ...currentPomodoro,
                id: new Date().getTime(),
                timeLeft: currentPomodoro.duration * 60, // Set timeLeft to duration in seconds
                isActive: false,
                mute: false
            };

            const updatedPomodoros = [...existingPomodoros, newPomodoro];

            await setDoc(userPomodoroRef, { pomodoros: updatedPomodoros });
            setPomodoros(updatedPomodoros);
            localStorage.setItem(`pomodoros_${currentUser.uid}`, JSON.stringify(updatedPomodoros));
            setCurrentPomodoro({ title: '', duration: POMODORO_DURATION });
        }
    };

    const handleEdit = (pomodoro) => {
        setCurrentPomodoro({ title: pomodoro.title, duration: pomodoro.duration });
        setEditMode(true);
        setEditId(pomodoro.id);
    };

    const handleDeletePomodoro = async (id) => {
        if (!currentUser) return;

        const userPomodoroRef = doc(db, 'usersPomodoros', currentUser.uid);
        const userPomodoroDoc = await getDoc(userPomodoroRef);
        const pomodoroData = userPomodoroDoc.data();

        const updatedPomodoros = pomodoroData.pomodoros.filter(pomodoro => pomodoro.id !== id);

        await setDoc(userPomodoroRef, { pomodoros: updatedPomodoros });
        setPomodoros(updatedPomodoros);
        localStorage.setItem(`pomodoros_${currentUser.uid}`, JSON.stringify(updatedPomodoros));
    };

    const fetchPomodoros = async () => {
        if (!currentUser) return;

        const userPomodoroRef = doc(db, 'usersPomodoros', currentUser.uid);
        const userPomodoroDoc = await getDoc(userPomodoroRef);

        if (userPomodoroDoc.exists()) {
            const fetchedPomodoros = userPomodoroDoc.data().pomodoros || [];
            setPomodoros(fetchedPomodoros);
            localStorage.setItem(`pomodoros_${currentUser.uid}`, JSON.stringify(fetchedPomodoros));

            // Ustaw stan mute na podstawie aktywnego pomodoro
            const activePomodoro = fetchedPomodoros.find(p => p.isActive);
            if (activePomodoro) {
                setMute(activePomodoro.mute || false);
            }
        } else {
            setPomodoros([]);
            localStorage.removeItem(`pomodoros_${currentUser.uid}`);
        }
    };

    const handleMute = async () => {
        const newMuteState = !mute; // Przełącz stan mute

        setMute(newMuteState); // Ustaw lokalny stan mute

        if (currentUser) {
            // Aktualizuj stan mute w Firebase
            const userPomodoroRef = doc(db, 'usersPomodoros', currentUser.uid);

            const updatedPomodoros = pomodoros.map(pomodoro =>
                pomodoro.isActive
                    ? { ...pomodoro, mute: newMuteState }
                    : pomodoro
            );

            await setDoc(userPomodoroRef, { pomodoros: updatedPomodoros }, { merge: true });
        }
    };

    const playNotificationSound = () => {
        if (!mute) {
            const audio = new Audio(TIMER_SOUND_URL); // Zastąp TIMER_SOUND_URL odpowiednim URL
            audio.play();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold mb-6">Pomodoro Timer</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Pomodoro' : 'Add Pomodoro'}</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        value={currentPomodoro.title}
                        onChange={(e) => setCurrentPomodoro(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Title"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="number"
                        value={currentPomodoro.duration}
                        onChange={(e) => setCurrentPomodoro(prev => ({ ...prev, duration: Number(e.target.value) }))}
                        placeholder="Duration (minutes)"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button
                    onClick={handleSavePomodoro}
                    className={`px-4 py-2 ${editMode ? 'bg-yellow-500' : 'bg-green-500'} text-white rounded-md`}
                >
                    {editMode ? 'Save Changes' : 'Add Pomodoro'}
                </button>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4">Your Pomodoros</h2>
                <ul>
                    {pomodoros.map(pomodoro => (
                        <li key={pomodoro.id} className="flex justify-between items-center mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div>
                                <h3 className="text-lg font-semibold">{pomodoro.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Time Left: {Math.floor(pomodoro.timeLeft / 60)}:{('0' + (pomodoro.timeLeft % 60)).slice(-2)}
                                </p>
                            </div>
                            <div className='flex items-center'>
                                {pomodoro.isActive && (
                                    <div onClick={handleMute} className="mr-2 cursor-pointer">
                                        {mute ? <GoMute /> : <GoUnmute />}
                                    </div>
                                )}
                                {pomodoro.isActive ? (
                                    <button
                                        onClick={() => handleStop(pomodoro.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                                    >
                                        Stop
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStart(pomodoro.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                    >
                                        Start
                                    </button>
                                )}
                                <button
                                    onClick={() => handleReset(pomodoro.id)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => handleEdit(pomodoro)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-md ml-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeletePomodoro(pomodoro.id)}
                                    className="px-4 py-2 bg-red-700 text-white rounded-md ml-2"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PomodoroTimer;
