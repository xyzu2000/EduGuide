import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import basicUserImg from '../../../assets/images/user.png';
import { db } from '../../../config/firebase';
import { AuthContext } from '../../../context/AuthContext';
import { ChatContext } from '../../../context/ChatContext';
import { UserContext } from '../../../context/UserContext';
import UsersList from '../../../pages/users/UsersList';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState('');
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    const { getUserPhotoURL } = useContext(UserContext);

    const handleSelect = (userInfo) => {
        dispatch({ type: 'CHANGE_USER', payload: userInfo });
    };

    const handleAddMode = () => {
        setAddMode(prevState => !prevState)
    }

    useEffect(() => {
        if (currentUser) {
            const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
                if (doc.exists()) {
                    setChats(doc.data());
                } else {
                    setChats([]);
                }
            });

            return () => {
                unsub();
            };
        }
    }, [currentUser]);

    const filteredChats = Object.entries(chats).filter(
        ([chatId, chatData]) => chatData.userInfo && chatData.userInfo.displayName.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-auto text-black">
            <div className="flex items-center gap-5 p-5">
                <div className="flex items-center flex-1 gap-5 bg-indigo-600 p-2 rounded-lg">
                    <img src="./search.png" alt="Search" className="w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white"
                    />
                </div>
                <img
                    src={addMode ? "./minus.png" : "./plus.png"}
                    alt="Add"
                    className="w-9 h-9 bg-indigo-600 p-2 rounded-lg cursor-pointer"
                    onClick={() => setAddMode((prev) => !prev)}
                />
            </div>

            {filteredChats.length > 0 ? (
                filteredChats
                    .sort((a, b) => b[1].date - a[1].date)
                    .map(([chatId, chatData]) => (
                        <ChatListItem
                            key={chatId}
                            chatData={chatData}
                            handleSelect={handleSelect}
                            getUserPhotoURL={getUserPhotoURL}
                        />
                    ))
            ) : (
                'Nie znaleziono czatu'
            )}

            {addMode && <UsersList handleModal={handleAddMode} buttonLabel={`Przejdz do czatu`} modal={addMode} />}
        </div>
    );
};

const ChatListItem = ({ chatData, handleSelect, getUserPhotoURL }) => {
    const [photoURL, setPhotoURL] = useState(basicUserImg);

    useEffect(() => {
        const fetchPhotoURL = async () => {
            const url = await getUserPhotoURL(chatData.userInfo.uid);
            if (url) setPhotoURL(url);
        };

        fetchPhotoURL();
    }, [chatData.userInfo.uid, getUserPhotoURL]);

    return (
        <div
            className="flex group items-center gap-5 p-5 cursor-pointer hover:bg-indigo-500 transition-colors duration-300"
            onClick={() => handleSelect(chatData.userInfo)}
        >
            <img
                src={photoURL || basicUserImg}
                alt={chatData?.userInfo?.displayName || 'User'}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col gap-2">
                <span className="font-bold">{chatData.userInfo?.displayName || 'Nieznany użytkownik'}</span>
                <div
                    className="text-sm text-gray-600 dark:text-slate-300 group-hover:text-slate-300 max-w-[200px] max-h-5 overflow-hidden text-ellipsis whitespace-nowrap"
                    dangerouslySetInnerHTML={{ __html: chatData.lastMessage?.text.substring(0, 50) || 'Brak wiadomości' }}
                />
            </div>
        </div>
    );
};

export default ChatList;
