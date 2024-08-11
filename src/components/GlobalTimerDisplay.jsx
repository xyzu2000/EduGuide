import React, { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { useNavigate } from 'react-router-dom';
import { TimerContext } from '../context/TimerContext';

const GlobalTimerDisplay = () => {
    const { activePomodoro } = useContext(TimerContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true); // Stan do zarządzania widocznością

    const handleClick = () => {
        navigate('/pomodoro');
    };

    const toggleVisibility = () => {
        setIsOpen(!isOpen);
    };

    if (!activePomodoro || !isOpen) {
        return null; // Jeśli nie ma aktywnego pomodoro lub komponent jest ukryty, nic nie renderuj
    }

    return (
        <Draggable>
            <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg absolute z-50 cursor-move transition-colors duration-300 hover:bg-gray-100">
                <div>
                    {activePomodoro.timeLeft == 0 ?
                        <h2 className="text-lg font-semibold mb-2">DONE !!! </h2> :
                        <>
                            <h2 className="text-lg font-semibold mb-2">Active Timer:</h2>
                            <p className="text-gray-700 mb-2">{activePomodoro.title}</p>
                            <p className="text-gray-500">
                                Time Left: {Math.floor(activePomodoro.timeLeft / 60)}:
                                {('0' + (activePomodoro.timeLeft % 60)).slice(-2)}
                            </p></>}
                    <button
                        onClick={handleClick}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Go to Pomodoro
                    </button>
                    <button
                        onClick={toggleVisibility}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        {isOpen ? 'Hide' : 'Show'} Timer
                    </button>
                </div>
            </div>
        </Draggable>
    );
};

export default GlobalTimerDisplay;
