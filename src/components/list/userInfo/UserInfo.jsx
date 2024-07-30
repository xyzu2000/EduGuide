import React, { useContext } from 'react';
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
                <img src="./more.png" alt="" />
                <img src="./video.png" alt="" />
                <img src="./edit.png" alt="" />
            </div>

        </div>
    )
}

export default UserInfo