import React, { useContext, useEffect, useState } from 'react'
import { CiCircleInfo, CiVideoOn } from "react-icons/ci"
import { FaRocketchat } from "react-icons/fa"
import { MdOutlinePhoneInTalk } from "react-icons/md"
import Input from '../../components/Input'
import Messages from '../../components/Messages'
import { ChatContext } from '../../context/ChatContext'
import { UserContext } from '../../context/UserContext'
import "./completeChat.css"

const CompleteChat = ({ toggleDetail }) => {
    const { data } = useContext(ChatContext);
    const { getUserPhotoURL } = useContext(UserContext);
    const [photoURL, setPhotoURL] = useState(null);
    const basicUserImg = 'avatar.png'
    useEffect(() => {
        const fetchPhotoURL = async () => {
            if (data.user && data.user.uid) {
                const url = await getUserPhotoURL(data.user.uid);
                setPhotoURL(url);
            }
        };

        fetchPhotoURL();
    }, [data.user, getUserPhotoURL]);

    return (
        <div className='chat'>
            {data.user ? (
                <>
                    <div className="top">
                        <div className="user">
                            <img src={photoURL || basicUserImg} alt="" />
                            <div className="texts">
                                <span>{data.user.displayName}</span>
                                <p>xd</p>
                            </div>
                        </div>

                        <div className="icons">
                            <MdOutlinePhoneInTalk className='cursor-pointer' />
                            <CiVideoOn className='cursor-pointer' />
                            <CiCircleInfo className='cursor-pointer' onClick={toggleDetail} />
                        </div>
                    </div>
                    <div className="center">
                        <Messages photoURL={photoURL} />
                    </div>
                    <Input />
                </>
            ) : (
                <div className="h-screen flex flex-col items-center justify-center">
                    <div className="text-center p-6 rounded-lg shadow-lg ">
                        <FaRocketchat className="text-6xl text-indigo-800 mb-4 mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-100 mb-2">Wybierz czat</h2>
                        <p className="text-gray-400">Aby rozpocząć konwersację, wybierz czat z listy</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompleteChat