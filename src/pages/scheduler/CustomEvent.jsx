// CustomEvent.js
import React from 'react';
import { MdDeleteForever, MdEditDocument } from "react-icons/md";

const CustomEvent = ({ event, handleEdit, handleDelete }) => {
    const handleEditClick = (e) => {
        e.stopPropagation();
        handleEdit(event);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        handleDelete(event);
    };

    return (
        <div className="flex items-center justify-between">
            <span>{event.title}</span>
            <div className="options flex gap-2">
                <MdEditDocument onClick={handleEditClick} className='hover:text-indigo-300' />
                <MdDeleteForever onClick={handleDeleteClick} className='hover:text-indigo-300' />
            </div>
        </div>
    );
};

export default CustomEvent;
