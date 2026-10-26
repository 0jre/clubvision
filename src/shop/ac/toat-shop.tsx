'use client';

import NotificationUI from '@/components/notification/card.mnc';
import React, { createContext, useContext, useState, ReactNode } from 'react';

import styled, { css } from 'styled-components';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};


 
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
        {toasts.map((toast) => (
          <NotificationUI key={toast.id} message={toast.message} type={toast.type} />
        ))}
    </ToastContext.Provider>
  );
};


 
 

//  const ToastItem = styled.div<{ $type: string }>`
//   padding: 0.4em;
//   border-radius: 12px;
//   width: 100%;
//   max-width: 350px;
//   text-align: center;
//   animation: fadeIn 0.5s ease-in-out, fadeOut 0.5s ease-in-out 4.5s forwards;
//   border: 1px solid ${({ $type }) => $type === 'error' ? '#e92c1363' : $type === 'success' ? '#27ae60' : '#1d1f1e'};


//   .borc{
//     border-radius: 8px;
//     font-size: 12px;
//     padding: 0.5em 1em 0.5em;
//     color: white;
//     font-family: 'InterSemiBold', sans-serif;
//     box-shadow: 0 0 10px rgba(0,0,0,0.15);
//     background: ${({ $type }) => $type === 'error' ? '#e92c1363' : $type === 'success' ? '#27ae60' : '#1d1f1e'};
//   } 

   
//     @keyframes fadeIn {
//         from {
//         opacity: 0;
//         transform: translateY(-20px);
//         }
//         to {
//         opacity: 1;
//         transform: translateY(0);
//         }
//     }

//     @keyframes fadeOut {
//         from {
//         opacity: 1;
//         transform: translateY(0);
//         }
//         to {
//         opacity: 0;
//         transform: translateY(-20px);
//         }
//     }
// `;
