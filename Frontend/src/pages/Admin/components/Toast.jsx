// src/components/Toast.js
import React from 'react';

export const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
      <div className="text-white">{message}</div>
      <button onClick={onClose} className="ml-4 text-white underline">
        Cerrar
      </button>
    </div>
  );
};
