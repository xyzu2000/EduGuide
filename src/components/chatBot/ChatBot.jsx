import { useState } from 'react';

import Clear from './Clear';
import History from './History';
import Input from './Input';
import Message from './Message';

import '../../assets/css/App.css';

import React from 'react';

export const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);

  const handleSubmit = async () => {
    const prompt = {
      role: 'user',
      content: input,
    };

    setMessages([...messages, prompt]);

    console.log({
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [...messages, prompt],
      }),
    });

    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [...messages, prompt],
      }),
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error(`HTTP error! Status: ${data.status}`);
        }
        return data.json();
      })
      .then((data) => {
        const res =
          data.choices && data.choices.length > 0
            ? data.choices[0].message.content
            : '';
        setMessages((messages) => [
          ...messages,
          {
            role: 'assistant',
            content: res,
          },
        ]);
        setHistory((history) => [...history, { question: input, answer: res }]);
        setInput('');
      })
      .catch((error) => {
        console.error('Error during fetch:', error);
      });
  };

  const clear = () => {
    setMessages([]);
    setHistory([]);
  };

  return (
    <div className="App">
      <div className="Column">
        <h3 className="Title">Chat Messages</h3>
        <div className="Content">
          {messages.map((el, i) => {
            return <Message key={i} role={el.role} content={el.content} />;
          })}
        </div>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={input ? handleSubmit : undefined}
          onEnter={input ? handleSubmit : undefined}
        />
      </div>
      <div className="Column">
        <h3 className="Title">History</h3>
        <div className="Content">
          {history.map((el, i) => {
            return (
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
            );
          })}
        </div>
        <Clear onClick={clear} />
      </div>
    </div>
  );
}

export default ChatBot;
