import React from 'react';
import { motion } from 'framer-motion';
import { PiCheckCircle, PiX } from 'react-icons/pi';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center"
    >
      <PiCheckCircle className="mr-2" size={20} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200 transition-colors duration-300">
        <PiX size={20} />
      </button>
    </motion.div>
  );
};

