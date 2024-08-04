import React, { useContext } from 'react';
import { CiEdit, CiVideoOn } from "react-icons/ci";
import { IoIosMore } from "react-icons/io";
import { AuthContext } from "../../../context/AuthContext";
import "./userInfo.css";

const UserInfo = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <div className='userInfo'>
            <div className="user">
                <img src={currentUser.photoURL || "./avatar.png"} />
                <h2>{currentUser.displayName}</h2>
            </div>
            <div className="icons">
                <IoIosMore />
                <CiVideoOn />
                <CiEdit />
            </div>

        </div>
    )
}

export default UserInfo