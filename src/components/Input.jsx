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
import { FaMicrophoneAlt, FaPhotoVideo } from 'react-icons/fa';
import { GrEmoji } from 'react-icons/gr';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { v4 as uuid } from 'uuid';
import { db, storage } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Input = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [imgs, setImgs] = useState([]);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImgs((prevImgs) => [...prevImgs, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImgs((prevImgs) => prevImgs.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!data.chatId) {
      console.error('No chatId found');
      return;
    }

    if (text.trim() === '' && imgs.length === 0) {
      console.warn('Cannot send an empty message without an image');
      return;
    }

    const messageId = uuid();
    let imageUrls = [];

    try {
      for (const img of imgs) {
        const storageRef = ref(storage, `${messageId}/${uuid()}`);
        const uploadTask = uploadBytesResumable(storageRef, img);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => {
              console.error('Error uploading image: ', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              imageUrls.push(downloadURL);
              resolve();
            }
          );
        });
      }

      const message = {
        id: messageId,
        text: text.trim() || null,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        img: imageUrls.length > 0 ? imageUrls : null,
      };

      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion(message),
      });

      await updateUserChats();
      resetInput();
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  const updateUserChats = async () => {
    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text: text.trim() || (imgs.length > 0 ? 'Image(s)' : ''),
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text: text.trim() || (imgs.length > 0 ? 'Image(s)' : ''),
      },
      [data.chatId + '.date']: serverTimestamp(),
    });
  };

  const resetInput = () => {
    setText('');
    setImgs([]);
  };

  return (
    <div className="bottom flex items-center justify-between p-4 border-t border-gray-300 gap-4 flex-wrap">
      <div className="icons flex gap-4 text-black dark:text-white">
        <input
          type="file"
          style={{ display: 'none' }}
          id="file"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="file">
          <FaPhotoVideo className="cursor-pointer" />
        </label>
        <MdOutlinePhotoCamera className="cursor-pointer" />
        <FaMicrophoneAlt className="cursor-pointer" />
      </div>

      {imgs.length > 0 && (
        <div className="flex gap-2">
          {imgs.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt={`Selected ${index + 1}`}
                className="w-10 h-10 object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="text"
        value={text}
        placeholder="Type a message..."
        onKeyDown={handleKeyDown}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-indigo-600 text-white p-3 rounded-lg outline-none"
      />
      <div className="emoji relative text-black dark:text-white cursor-pointer">
        <GrEmoji
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        />
        {open && (
          <div className="picker absolute bottom-12 right-0">
            <EmojiPicker onEmojiClick={handleEmoji} />
          </div>
        )}
      </div>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default Input;
