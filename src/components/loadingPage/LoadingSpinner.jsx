import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <AiOutlineLoading3Quarters className="animate-spin text-6xl text-indigo-600" />
        </div>
    );
};

export default LoadingSpinner