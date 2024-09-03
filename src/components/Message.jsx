import clsx from 'clsx';
import { formatDistanceToNow } from "date-fns";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { UserContext } from "../context/UserContext";

const Message = ({ message, photoURL }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { getUserPhotoURL } = useContext(UserContext);
  const ref = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [senderPhotoURL, setSenderPhotoURL] = useState("");
  const basicUserImg = 'avatar.png';

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const fetchPhotoURL = async () => {
      if (message.senderId) {
        const photoURL1 = message.senderId === currentUser.uid
          ? currentUser.photoURL
          : photoURL;
        setSenderPhotoURL(photoURL1);
      }
    };

    fetchPhotoURL();
  }, [message.senderId, currentUser, getUserPhotoURL]);

  const getMessageDate = (timestamp) => {
    const date = new Date(timestamp.toDate());
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
  };

  if (!message || !message.senderId || !message.date) return null;

  return (
    <div
      ref={ref}
      className={clsx('flex gap-3', message.senderId === currentUser.uid && 'justify-end')}
    >
      <div className={clsx('texts flex flex-col gap-2', message.senderId === currentUser.uid ? 'items-end' : 'items-start')}>
        <div className='flex gap-3 items-start'>
          <img src={senderPhotoURL || basicUserImg} alt="" className="w-8 h-8 rounded-full object-cover" />
          <p className={clsx('p-3 rounded-lg max-w-xs break-words', message.senderId === currentUser.uid ? 'dark:bg-slate-500 bg-background-light dark:text-text-dark' : 'dark:bg-zinc-800 bg-zinc-500 text-text-dark')}>
            <div dangerouslySetInnerHTML={{ __html: message.text }} />
            {message.img && Array.isArray(message.img) && message.img.map((img, index) => (
              <img
                key={index}
                src={img}
                className="m-auto p-3 cursor-pointer"
                alt={`Image ${index + 1}`}
                onClick={() => handleImageClick(img)}
              />
            ))}
          </p>
        </div>
        <span className="text-sm text-gray-500 dark:text-white">{getMessageDate(message.date)}</span>
      </div>
      {isModalOpen && (
        <ImageModal imageUrl={modalImage} closeModal={closeModal} />
      )}
    </div>
  );
};

const ImageModal = ({ imageUrl, closeModal }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 overflow-auto"
    onClick={closeModal}
  >
    <div
      className="relative max-w-90 max-h-90 w-full h-full flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <span
        className="absolute top-4 right-4 text-white text-3xl font-bold cursor-pointer hover:text-gray-300"
        onClick={closeModal}
      >
        &times;
      </span>
      <img
        className='object-contain'
        src={imageUrl}
        alt="Full size"
      />
    </div>
  </div>
);

export default Message;
