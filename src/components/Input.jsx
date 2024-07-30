import EmojiPicker from 'emoji-picker-react';
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Input = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!data.chatId) {
      console.error('No chatId found');
      return;
    }

    if (text.trim() === '' && !img) {
      // Case 1: User tries to send an empty message without an image
      console.warn('Cannot send an empty message without an image');
      return;
    }

    try {
      if (img) {
        // Case 3: User is sending an image (with or without text)
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error("Error uploading image: ", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: text.trim() || null, // Use text or null if it's empty
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });

            await updateUserChats();
            resetInput();
          }
        );
      } else if (text.trim() !== '') {
        // Case 2: User is sending only text without an image
        await updateDoc(doc(db, 'chats', data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: text.trim(),
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });

        await updateUserChats();
        resetInput();
      } else {
        console.warn('Nothing to send');
      }
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const updateUserChats = async () => {
    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text: text.trim() || '',
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text: text.trim() || '',
      },
      [data.chatId + '.date']: serverTimestamp(),
    });
  };

  const resetInput = () => {
    setText('');
    setImg(null);
  };

  return (
    <div className="bottom">
      <div className="icons">
        <input
          type="file"
          style={{ display: 'none' }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src="./img.png" alt="" />
        </label>
        <img src="./camera.png" alt="" />
        <img src="./mic.png" alt="" />
      </div>
      <input
        type="text"
        value={text}
        placeholder='Type a message...'
        onKeyDown={handleKeyDown}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="emoji">
        <img
          src="./emoji.png"
          alt=""
          onClick={() => { setOpen(prev => !prev); }}
        />
        {open && (
          <div className="picker">
            <EmojiPicker onEmojiClick={handleEmoji} />
          </div>
        )}
      </div>
      <button className="sendButton" onClick={handleSend}>Send</button>
    </div>
  );
};

export default Input;
