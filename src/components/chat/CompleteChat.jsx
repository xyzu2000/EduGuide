import React, { useContext, useEffect, useState } from 'react'
import { CiCircleInfo, CiVideoOn } from "react-icons/ci"
import { FaRocketchat } from "react-icons/fa"
import { MdOutlinePhoneInTalk } from "react-icons/md"
import Input from '../../components/Input'
import Messages from '../../components/Messages'
import { ChatContext } from '../../context/ChatContext'
import { UserContext } from '../../context/UserContext'

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
        <div className="flex-[3] border-l border-r border-[#dddddd35] h-full flex flex-col">
            {data.user ? (
                <>
                    <div className="p-5 flex items-center justify-between border-b border-[#dddddd35] text-text-light dark:text-text-dark">
                        <div className="flex items-center gap-3">
                            <img src={photoURL || basicUserImg} alt="" className='w-14 h-14 object-fill rounded-full' />
                            <div className="flex flex-col gap-1.5 items-center justify-center">
                                <span className="text-lg font-bold">{data.user.displayName}</span>
                            </div>
                        </div>
                        <div className="flex gap-5">
                            <MdOutlinePhoneInTalk className="cursor-pointer" />
                            <CiVideoOn className="cursor-pointer" />
                            <CiCircleInfo className="cursor-pointer" />
                            {/* <CiCircleInfo className="cursor-pointer" onClick={toggleDetail} /> */}
                        </div>
                    </div>
                    <div className="p-5 flex-1 overflow-auto flex flex-col gap-5">
                        <Messages photoURL={photoURL} />
                    </div>
                    <Input />
                </>
            ) : (
                <div className="h-screen flex flex-col items-center justify-center">
                    <div className="text-center p-6 rounded-lg shadow-lg bg-background-chatLight dark:bg-background-chatDark">
                        <FaRocketchat className="text-6xl text-indigo-800 mb-4 mx-auto" />
                        <h2 className="text-2xl font-bold text-text-light dark:text-gray-100  mb-2">Wybierz czat</h2>
                        <p className="text-text-dark/50">Aby rozpocząć konwersację, wybierz czat z listy</p>
                    </div>
                </div>
            )}
        </div>
    );

};

export default CompleteChat