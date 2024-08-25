import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { FaShare } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { db, moveOrCreateChatUser } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import UsersList from '../../pages/users/UsersList';
import Modal from '../basics/Modal';

export default function History({ question, answer, onClick }) {
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);
  const [openModal, setOpenModal] = useState(false);

  const handleShareQuestion = () => {
    const messageContent = `
      <div>
        Message from chatBot ...
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
          color: black
        ">QUESTION:</p>
        <p style="
          font-size: 14px;
          margin-bottom: 16px;
          color: black;
        ">${question}</p>
        <p style="
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          color:black
        ">ANSWER:</p>
        <p style="
          font-size: 14px;
          color: black;
        ">${answer}</p>
      </div>
    `;
    dispatch({ type: 'SET_SHARED_MESSAGE', payload: messageContent });
    setOpenModal(true);
  };

  const handleUserClick = async (user) => {
    const chatId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    const messageContent = data.sharedMessage;

    try {
      await moveOrCreateChatUser(currentUser, user);

      const chatDocRef = doc(db, 'chats', chatId);
      await updateDoc(chatDocRef, {
        messages: arrayUnion({
          id: uuid(),
          text: messageContent,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      const lastMessageUpdate = {
        [chatId + '.lastMessage']: {
          text: messageContent,
        },
        [chatId + '.date']: Timestamp.now(),
      };
      await updateDoc(doc(db, 'userChats', currentUser.uid), lastMessageUpdate);
      await updateDoc(doc(db, 'userChats', user.uid), lastMessageUpdate);

      setOpenModal(false);
      toast.success('Message sent', { position: 'bottom-right' });
    } catch (err) {
      toast.error('Error sharing message:', { position: 'bottom-right' }, err);
    }
  };

  return (
    <div
      className="p-5 mb-2.5 rounded-xl cursor-pointer font-semibold bg-slate-700 hover:bg-slate-800 flex justify-between items-center"
      onClick={onClick}
    >
      <p>{question}...</p>
      <div className="flex items-center gap-2">
        <FaShare
          className="hover:text-indigo-400 active:text-indigo-700 min-w-5 max-w-5 cursor-pointer"
          onClick={handleShareQuestion}
        />
        <Modal open={openModal} setOpen={setOpenModal}>
          <UsersList
            buttonLabel={'Share'}
            onUserClick={(user) => handleUserClick(user)}
            isModal
          />
        </Modal>
      </div>
    </div>
  );
}
