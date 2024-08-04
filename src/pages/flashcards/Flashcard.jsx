import React, { useState } from 'react';
import Button from '../../components/basics/Button';

export default function Flashcard({ term, definition, onEdit, onDelete, creator }) {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    return (
        <div className="relative w-full h-48 perspective" onClick={handleFlip}>
            <div className={`absolute w-full h-full text-white transition-transform duration-1000 transform-style preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
                <div className="absolute w-full h-full backface-hidden bg-indigo-600 flex justify-center items-center rounded-lg p-4">
                    <h3 className="text-2xl font-bold">{term}</h3>
                    <Button type="submit" className="absolute top-2 left-2 "
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}>
                        Edit
                    </Button>
                    <Button type="submit" className="absolute top-2 right-2  "
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}>
                        X
                    </Button>
                    <p className='text-xs  m-1 right-0 bottom-0 fixed'>{creator}</p>
                </div>
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-zinc-500 flex justify-center items-center rounded-lg p-4">
                    <p className="text-xl">{definition}</p>
                </div>
            </div>
        </div>
    );
}
