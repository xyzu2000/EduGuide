import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaRocketchat } from 'react-icons/fa';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../loadingPage/LoadingSpinner';
import Clear from './Clear';
import History from './History';
import Input from './Input';
import Message from './Message';

export const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [prevMessages, setPrevMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const docRef = doc(db, 'userChatBot', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMessages(data.messages || []);
          setHistory(data.history || []);
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  const handleSubmit = async () => {
    const prompt = {
      role: 'user',
      content: input,
    };

    const updatedMessages = [...messages, prompt];

    setPrevMessages(messages);
    setMessages(updatedMessages);

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY
              }`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: updatedMessages,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const res =
        data.choices && data.choices.length > 0
          ? data.choices[0].message.content
          : '';

      const updatedMessagesWithResponse = [
        ...updatedMessages,
        { role: 'assistant', content: res },
      ];
      const updatedHistory = [...history, { question: input, answer: res }];

      setMessages(updatedMessagesWithResponse);
      setHistory(updatedHistory);

      if (currentUser) {
        await setDoc(doc(db, 'userChatBot', currentUser.uid), {
          messages: updatedMessagesWithResponse,
          history: updatedHistory,
        });
      }

      setInput('');
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const clear = async () => {
    setMessages([]);
    setHistory([]);
    if (currentUser) {
      await setDoc(doc(db, 'userChatBot', currentUser.uid), {
        messages: [],
        history: [],
      });
    }
  };

  const handleHistoryClick = (question, answer) => {
    setPrevMessages(messages);
    setMessages([
      { role: 'user', content: question },
      { role: 'assistant', content: answer },
    ]);
  };

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-2 h-[83vh] max-lg:overflow-auto">
        <div className="col-span-7 lg:col-span-5 flex flex-col text-white bg-background-chatLight dark:bg-background-chatDark p-5 rounded-xl order-2 lg:order-1">
          <h3 className=" mb-5 text-xl font-bold bg-indigo-600 p-4 rounded-xl">
            Chat Messages
          </h3>
          <div className=" flex-1 mb-5 overflow-auto max-h-[66vh]">
            {messages.length === 0 ? (
              <div className="flex min-h-[100%] flex-col items-center justify-center">
                <div className="text-center p-6 rounded-lg  bg-background-chatLight dark:bg-background-chatDark">
                  <FaRocketchat className="text-6xl text-indigo-800 mb-4 mx-auto" />
                  <h2 className="text-2xl font-bold text-text-light dark:text-gray-100 mb-2">
                    Start a conversation{' '}
                  </h2>
                </div>
              </div>
            ) : (
              <>
                {messages.map((el, i) => (
                  <Message key={i} role={el.role} content={el.content} />
                ))}
                <div ref={ref}></div>
              </>
            )}
          </div>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClick={input ? handleSubmit : undefined}
            onEnter={input ? handleSubmit : undefined}
          />
        </div>
        <div className="col-span-7 lg:col-span-2 flex flex-col text-white bg-background-chatLight dark:bg-background-chatDark p-5 rounded-xl order-1 lg:order-2">
          <h3 className=" mb-5 text-xl font-bold bg-indigo-600 p-4 rounded-xl">
            History
          </h3>
          <div className=" flex-1 mb-5 overflow-auto max-h-[66vh]">
            {history.map((el, i) => (
              <History
                key={i}
                question={el.question}
                answer={el.answer}
                onClick={() => handleHistoryClick(el.question, el.answer)}
              />
            ))}
          </div>
          <Clear onClick={clear} />
        </div>
      </div>
    </>
  );
};

export default ChatBot;
