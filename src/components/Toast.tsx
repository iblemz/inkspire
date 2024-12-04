import React, { useEffect } from 'react';
import { Toast as ToastType } from '../types';

interface ToastProps extends Omit<ToastType, 'id'> {
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
    >
      {message}
    </div>
  );
};
