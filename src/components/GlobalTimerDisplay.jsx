import React, { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { MdOpenInFull, MdOutlineCloseFullscreen } from 'react-icons/md';
import { PiSneakerMoveDuotone } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { TimerContext } from '../context/TimerContext';

const GlobalTimerDisplay = () => {
    const { activePomodoro } = useContext(TimerContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const handleClick = () => {
        navigate('/pomodoro');
    };

    const toggleVisibility = () => {
        setIsOpen(!isOpen);
    };

    if (!activePomodoro) {
        return null;
    }

    return (
        <Draggable>
            <div className="p-4 bg-zinc-50 border border-gray-300 rounded-lg shadow-lg absolute z-50 cursor-move transition-colors duration-300 hover:bg-zinc-50">
                {isOpen ? (
                    <div className="flex items-center justify-center ">
                        {activePomodoro.timeLeft == 0 ? (
                            <h2 className="text-lg font-semibold">DONE !!! </h2>
                        ) : (
                            <div>
                                <div className="flex items-center justify-center">
                                    <h2 className="text-lg font-semibold ">Active Timer:</h2>
                                    <p className="text-gray-700 ml-1">{activePomodoro.title}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">
                                        Time Left: {Math.floor(activePomodoro.timeLeft / 60)}:
                                        {('0' + (activePomodoro.timeLeft % 60)).slice(-2)}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="ml-2">
                            <MdOutlineCloseFullscreen
                                className="mb-2 cursor-pointer"
                                onClick={toggleVisibility}
                            />
                            <PiSneakerMoveDuotone
                                onClick={handleClick}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                ) : (
                    <MdOpenInFull className="cursor-pointer" onClick={toggleVisibility} />
                )}
            </div>
        </Draggable>
    );
};

export default GlobalTimerDisplay;
