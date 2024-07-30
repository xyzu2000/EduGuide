import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { ChatContext } from '../context/ChatContext';
import Message from './Message';

const Messages = ({ photoURL }) => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data.chatId) return; // Sprawdzenie, czy chatId istnieje

    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []); // Użycie pustej tablicy, jeśli messages nie istnieje
      } else {
        console.error("Czat nie istnieje!");
        setMessages([]); // Ustaw pustą tablicę, jeśli czat nie istnieje
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="center">
      {messages.length > 0 ? (
        messages.map((m) => (
          <Message message={m} key={m.id} photoURL={photoURL} />
        ))
      ) : (
        <div className=' flex items-center justify-center'>
          <p>Rozpocznij czat</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
