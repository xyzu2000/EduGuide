import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import basicUserImg from '../../../assets/images/user.png';
import { db } from '../../../config/firebase';
import { AuthContext } from '../../../context/AuthContext';
import { ChatContext } from '../../../context/ChatContext';
import { UserContext } from '../../../context/UserContext';
import UsersList from '../../../pages/users/UsersList';
import './chatList.css';

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
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="Search" />
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <img
                    src={addMode ? "./minus.png" : "./plus.png"}
                    alt="Add"
                    className="add"
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

            {/* {addMode && <AddUser />} */}
            {addMode && <UsersList handleModal={handleAddMode} modal={addMode} />}
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
            className="item"
            onClick={() => handleSelect(chatData.userInfo)}
        >
            <img
                src={photoURL || basicUserImg}
                alt={chatData?.userInfo?.displayName || 'User'}
            />
            <div className="texts">
                <span>{chatData.userInfo?.displayName || 'Nieznany użytkownik'}</span>
                <p className='lastMsg'>{chatData.lastMessage?.text || 'Brak wiadomości'}</p>
            </div>
        </div>
    );
};

export default ChatList;
