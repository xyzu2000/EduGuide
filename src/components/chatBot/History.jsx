import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { FaShare } from 'react-icons/fa';
import { v4 as uuid } from 'uuid';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import UsersList from '../../pages/users/UsersList';

export default function History({ question, answer, onClick, setModal, modal }) {
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);

  const handleShareQuestion = (e) => {
    e.stopPropagation();
    const messageContent = `
  <div>
    Wiadomosc z czatu ...
    <br />
  </div>
  <div style="
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    max-width: 500px;
    margin: 0 auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  ">
    <p style="
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
      color: rgb(228 228 231 / var(--tw-bg-opacity));
    ">To moje pytanie do bota:</p>
    <p style="
      font-size: 14px;
      margin-bottom: 16px;
      color: white;
    ">${question}</p>
    <p style="
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
      color:rgb(228 228 231 / var(--tw-bg-opacity));
    ">Odpowiedź:</p>
    <p style="
      font-size: 14px;
      color: white;
    ">${answer}</p>
  </div>
`;



    dispatch({ type: 'SET_SHARED_MESSAGE', payload: messageContent });
    setModal(prev => !prev);
  };

  const handleModal = (e) => {
    e.stopPropagation();  // Zatrzymanie propagacji zdarzenia kliknięcia podczas zamykania modalu
    setModal(prev => !prev);
  };

  const handleUserClick = async (user, e) => {
    e.stopPropagation();  // Zatrzymanie propagacji zdarzenia kliknięcia podczas wysyłania wiadomości
    const chatId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    const messageContent = data.sharedMessage;

    await updateDoc(doc(db, 'chats', chatId), {
      messages: arrayUnion({
        id: uuid(),
        text: messageContent,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [chatId + '.lastMessage']: {
        text: messageContent,
      },
      [chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', user.uid), {
      [chatId + '.lastMessage']: {
        text: messageContent,
      },
      [chatId + '.date']: serverTimestamp(),
    });

    handleModal(e);
  };

  return (
    <div className="p-5 mb-2.5 rounded-xl cursor-pointer font-semibold bg-slate-700 hover:bg-slate-800 flex justify-between items-center" onClick={onClick}>
      <p>{question}...</p>
      <div className="flex items-center gap-2">
        <FaShare className="hover:text-indigo-400 active:text-indigo-700 min-w-5 max-w-5 cursor-pointer" onClick={handleShareQuestion} />
        {modal && <UsersList handleModal={handleModal} buttonLabel={'Udostepnij'} onUserClick={(user) => handleUserClick(user, new Event('click'))} />}
      </div>
    </div>
  );
}
