import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane } from "react-icons/fa";


const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/messages`);
      //agr refresh kroge toh by default ek bot message aaega !!
      if (res.data.length === 0) {
      setMessages([
        {
          sender: "Bot",
          content: "Hey! What is Striking your mind ? 🤔"
        }
      ]);
    } else {
      setMessages(res.data);
    }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: 'User', content: input };

    try {
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
      setIsTyping(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/messages`, newMessage);
      setMessages((prev) => [...prev.slice(0, -1), ...res.data]);
      setIsTyping(false);
    } catch (err) {
      console.error('Failed to send message', err);
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to delete all messages?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/messages`);
      setMessages([
        {
          sender:"Bot",
          content: "Hey! What is Striking your mind ? 🤔"
        }
      ]);
    } catch (err) {
      console.error('Failed to clear chat', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white px-2 sm:px-4">
      <div className="w-full max-w-2xl p-4 sm:p-6 bg-white shadow-xl rounded-2xl border h-[90vh] flex flex-col">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4 text-blue-600">GyaanBot 🤖</h2>
          <br />
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 mb-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start space-x-2 ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'Bot' && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712107.png"//chat bot image
                  alt="bot"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                />
              )}
              <div
                className={`px-4 py-2 rounded-xl text-sm sm:text-base max-w-[75%] ${
                  msg.sender === 'User'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
              {msg.sender === 'User' && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"//user image
                  alt="user"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712107.png"
                alt="typing bot"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
              />
              <div className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm animate-pulse">Typing...</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg w-full max-w-2xl mx-auto mt-4 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="text"
            value={input}
            placeholder="Type something smart . . ."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent outline-none text-black placeholder:text-gray-500 text-base"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:scale-105"
          >
            <FaPaperPlane />

          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleClearChat}
            className="text-sm text-red-500 hover:underline hover:text-red-700"
          >
            🧹 Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
