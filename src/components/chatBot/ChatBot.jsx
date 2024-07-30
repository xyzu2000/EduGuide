import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import Clear from './Clear';
import History from './History';
import Input from './Input';
import Message from './Message';

export const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const docRef = doc(db, "userChatBot", currentUser.uid);
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
    setMessages(updatedMessages);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const res = data.choices && data.choices.length > 0 ? data.choices[0].message.content : '';

      const updatedMessagesWithResponse = [...updatedMessages, { role: 'assistant', content: res }];
      const updatedHistory = [...history, { question: input, answer: res }];

      setMessages(updatedMessagesWithResponse);
      setHistory(updatedHistory);

      if (currentUser) {
        await setDoc(doc(db, "userChatBot", currentUser.uid), {
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
      await setDoc(doc(db, "userChatBot", currentUser.uid), {
        messages: [],
        history: [],
      });
    }
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (<>

    <div className="grid grid-cols-7 gap-5 max-w-screen-lg m-auto p-5">
      <div className="col-span-5 flex flex-col text-white bg-gray-900 p-5 rounded-xl h-[95vh]">
        <h3 className=" mb-5 text-xl font-bold bg-violet-400 p-4 rounded-xl">Chat Messages</h3>
        <div className=" flex-1 mb-5 overflow-auto">
          {messages.map((el, i) => (
            <Message key={i} role={el.role} content={el.content} />
          ))}
        </div>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={input ? handleSubmit : undefined}
          onEnter={input ? handleSubmit : undefined}
        />
      </div>
      <div className="col-span-2 flex flex-col text-white bg-gray-900 p-5 rounded-xl">
        <h3 className=" mb-5 text-xl font-bold bg-violet-400 p-4 rounded-xl">History</h3>
        <div className=" flex-1 mb-5">
          {history.map((el, i) => (
            <History
              key={i}
              question={el.question}
              onClick={() =>
                setMessages([
                  { role: 'user', content: history[i].question },
                  { role: 'assistant', content: history[i].answer },
                ])
              }
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
