import React, { useContext } from 'react';
import { CiEdit, CiVideoOn } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";
import { AuthContext } from "../../../context/AuthContext";

const UserInfo = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className='p-5 flex items-center justify-between text-text-light dark:text-text-dark'>
            <div className="flex items-center gap-[20px] font-bold">
                <img src={currentUser.photoURL || "./avatar.png"} className='w-14 h-14 object-fill rounded-full' />
                <h2>{currentUser.displayName}</h2>
            </div>
            <div className="flex gap-5 justify-end">
                <IoIosMore />
                <CiVideoOn />
                <CiEdit />
            </div>

        </div>
    )
}

export default UserInfo