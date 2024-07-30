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
  const basicUserImg = 'avatar.png'

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const fetchPhotoURL = async () => {
      if (message.senderId) {
        const photoURL1 = message.senderId === currentUser.uid
          ? currentUser.photoURL
          : photoURL
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

  if (!message || !message.senderId || !message.date) return null; // Sprawdzenie, czy wiadomość istnieje

  return (
    <div
      ref={ref}
      // className={`message ${message.senderId === currentUser.uid ? "own" : ""}`}
      className={clsx('message', message.senderId === currentUser.uid && 'own')}
    >
      <div className="messageInfo">
        <img src={senderPhotoURL || basicUserImg} alt="" />
      </div>
      <div className={clsx('texts', message.senderId === currentUser.uid ? 'items-end' : 'items-start')}>
        <p>
          {message.text || ''}
          {message.img && <img src={message.img} className="m-auto p-3" alt="" onClick={() => handleImageClick(message.img)} />}
        </p>
        <span>{getMessageDate(message.date)}</span>
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
