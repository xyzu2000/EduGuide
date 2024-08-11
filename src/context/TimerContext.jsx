import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase'; // Sprawdź poprawność ścieżki
import { AuthContext } from './AuthContext'; // Sprawdź poprawność ścieżki

export const TimerContext = createContext();

const TimerProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const [pomodoros, setPomodoros] = useState([]);
    const [activePomodoro, setActivePomodoro] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            const timerRef = doc(db, 'usersPomodoros', currentUser.uid);

            const unsubscribe = onSnapshot(timerRef, (doc) => {
                const fetchedPomodoros = doc.data()?.pomodoros || [];
                setPomodoros(fetchedPomodoros);

                // Find the active pomodoro
                const active = fetchedPomodoros.find(p => p.isActive);
                setActivePomodoro(active || null);
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    useEffect(() => {
        if (activePomodoro) {
            const intervalId = setInterval(() => {
                setPomodoros(prevPomodoros => {
                    const updatedPomodoros = prevPomodoros.map(pomodoro => {
                        if (pomodoro.id === activePomodoro.id) {
                            if (pomodoro.timeLeft > 0) {
                                return { ...pomodoro, timeLeft: pomodoro.timeLeft - 1 };
                            } else {
                                // Timer finished
                                return { ...pomodoro, isActive: false };
                            }
                        }
                        return pomodoro;
                    });

                    // Update the time left in Firebase
                    if (currentUser) {
                        const timerRef = doc(db, 'usersPomodoros', currentUser.uid);
                        setDoc(timerRef, { pomodoros: updatedPomodoros }, { merge: true }).catch(error => {
                            console.error('Error updating document in Firebase:', error);
                        });
                    }

                    // Update the active pomodoro state
                    const newActivePomodoro = updatedPomodoros.find(p => p.isActive);
                    setActivePomodoro(newActivePomodoro || null);

                    return updatedPomodoros;
                });
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [activePomodoro, currentUser]);

    const startTimer = async (timerId) => {
        if (!currentUser) return;

        const timerRef = doc(db, 'usersPomodoros', currentUser.uid);

        const updatedPomodoros = pomodoros.map(pomodoro =>
            pomodoro.id === timerId
                ? { ...pomodoro, isActive: true }
                : pomodoro
        );

        try {
            await setDoc(timerRef, { pomodoros: updatedPomodoros }, { merge: true });
            setPomodoros(updatedPomodoros);
        } catch (error) {
            console.error('Error starting timer:', error);
        }
    };

    const stopTimer = async (timerId) => {
        if (!currentUser) return;

        const timerRef = doc(db, 'usersPomodoros', currentUser.uid);

        const updatedPomodoros = pomodoros.map(pomodoro =>
            pomodoro.id === timerId
                ? { ...pomodoro, isActive: false }
                : pomodoro
        );

        try {
            await setDoc(timerRef, { pomodoros: updatedPomodoros }, { merge: true });
            setPomodoros(updatedPomodoros);
        } catch (error) {
            console.error('Error stopping timer:', error);
        }
    };

    const resetTimer = async (timerId) => {
        if (!currentUser) return;

        const timerRef = doc(db, 'usersPomodoros', currentUser.uid);

        const updatedPomodoros = pomodoros.map(pomodoro =>
            pomodoro.id === timerId
                ? { ...pomodoro, timeLeft: pomodoro.duration * 60, isActive: false }
                : pomodoro
        );

        try {
            await setDoc(timerRef, { pomodoros: updatedPomodoros }, { merge: true });
            setPomodoros(updatedPomodoros);
        } catch (error) {
            console.error('Error resetting timer:', error);
        }
    };

    return (
        <TimerContext.Provider value={{ pomodoros, activePomodoro, startTimer, stopTimer, resetTimer, loading }}>
            {children}
        </TimerContext.Provider>
    );
};

export default TimerProvider;
