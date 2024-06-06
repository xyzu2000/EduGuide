import React, { useContext } from 'react';
import { TbPhone, TbVideo, TbX } from 'react-icons/tb';
import { ChatContext } from '../context/ChatContext';
import Input from './Input';
import Messages from './Messages';

const Chat = () => {
  const { data } = useContext(ChatContext);
  console.log("Chat data:", data); // Dodaj ten wiersz

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatInfoDetails">
          {data.user?.photoURL ? (
            <>
              <img src={data.user.photoURL} alt="" />
              <span>{data.user.displayName}</span>
            </>
          ) : (
            <span>Wybierz czat z użytkownikiem</span>
          )}
        </div>
        {data.user?.photoURL && (
          <div className="chatIcons">
            <button className="unstyled-button">
              <TbVideo size={24} />
            </button>
            <button className="unstyled-button">
              <TbPhone size={24} />
            </button>
            <button className="unstyled-button">
              <TbX size={24} />
            </button>
          </div>
        )}
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
