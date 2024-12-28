import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PiX, PiPaperPlaneTilt } from 'react-icons/pi';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface ChatModalProps {
  user: { id: string; name: string };
  messages: Message[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ user, messages, onSendMessage, onClose }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <PiX size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.senderId === 'currentUser' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.senderId === 'currentUser'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <PiPaperPlaneTilt size={20} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatModal;

