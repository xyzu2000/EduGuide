import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { db } from '../../config/firebase'; // Upewnij się, że ścieżka jest poprawna
import { AuthContext } from '../../context/AuthContext'; // Upewnij się, że masz taki kontekst

const TOGGLE_CLASSES =
    "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const Toggle = () => {
    const { currentUser } = useContext(AuthContext);
    const [darkMode, setDarkMode] = useState(null); // Używamy `null` jako początkowego stanu

    useEffect(() => {
        const fetchTheme = async () => {
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const userDarkMode = data.darkMode !== undefined ? data.darkMode : false; // Ustaw domyślnie na `false`, jeśli brak pola
                    setDarkMode(userDarkMode);
                    document.documentElement.classList.toggle('dark', userDarkMode);
                } else {
                    await setDoc(userRef, { darkMode: false }, { merge: true });
                    setDarkMode(false);
                    document.documentElement.classList.remove('dark');
                }
            }
        };

        fetchTheme();
    }, [currentUser]);

    const handleToggleTheme = async (newTheme) => {
        if (currentUser) {
            const newDarkMode = newTheme === 'dark';
            setDarkMode(newDarkMode);

            // Ustaw klasę na stronie
            document.documentElement.classList.toggle('dark', newDarkMode);

            // Aktualizuj motyw w Firebase
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(userRef, { darkMode: newDarkMode }, { merge: true });
        }
    };

    if (darkMode === null) return null; // Poczekaj, aż motyw zostanie załadowany

    return (
        <div className="grid place-content-center px-4 transition-colors">
            <SliderToggle
                currentTheme={darkMode ? 'dark' : 'light'}
                onToggle={handleToggleTheme}
            />
        </div>
    );
};

const SliderToggle = ({ currentTheme, onToggle }) => {
    return (
        <div className="relative flex w-fit items-center rounded-full">
            <motion.div
                className={`absolute inset-0 z-0 flex ${currentTheme === 'dark' ? "justify-end" : "justify-start"}`}
                transition={{ type: "spring", damping: 15, stiffness: 250 }}
            >
                <motion.span
                    layout
                    className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                />
            </motion.div>
            <button
                className={`text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10 ${currentTheme === 'light' ? "text-white" : "text-slate-300"}`}
                onClick={() => onToggle('light')}
            >
                <FiMoon className="relative z-10 text-lg md:text-sm" />
                <span className="relative z-10">Light</span>
            </button>
            <button
                className={`text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10 ${currentTheme === 'dark' ? "text-white" : "text-slate-800"}`}
                onClick={() => onToggle('dark')}
            >
                <FiSun className="relative z-10 text-lg md:text-sm" />
                <span className="relative z-10">Dark</span>
            </button>
        </div>
    );
};


export default Toggle;
