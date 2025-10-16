import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  actionText?: string;
  onAction?: () => void;
}

const Toast: FC<ToastProps> = ({ message, onClose, duration, actionText, onAction }) => {
  const [countdown, setCountdown] = useState(100);

  useEffect(() => {
    if (duration) {
        setCountdown(100);
        const intervalTime = 50; // ms
        const totalSteps = (duration * 1000) / intervalTime;
        const decrement = 100 / totalSteps;

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    onClose();
                    return 0;
                }
                return prev - decrement;
            });
        }, intervalTime);
        return () => clearInterval(interval);
    }
  }, [duration, onClose]);

  const handleActionClick = () => {
    onAction?.();
    onClose();
  };
  
  return (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.5 }}
        transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-8 sm:bottom-4 left-1/2 -translate-x-1/2 bg-twitter-blue text-white rounded-full shadow-lg z-50 overflow-hidden flex items-center"
    >
        <div className="px-6 py-3">{message}</div>
        {actionText && (
            <button
                onClick={handleActionClick}
                className="font-bold pr-6 py-3 hover:bg-white/20 pl-4"
            >
                {actionText}
            </button>
        )}
        {duration && (
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                <motion.div 
                    className="h-1 bg-white" 
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration, ease: 'linear' }}
                />
            </div>
        )}
    </motion.div>
  );
};

export default Toast;