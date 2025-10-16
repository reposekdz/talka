
import React, { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: FC<ToastProps> = ({ message, isVisible, onClose }) => {
  return (
    <AnimatePresence>
        {isVisible && (
            // FIX: Wrapped framer-motion props to bypass type errors.
            <motion.div
                {...{
                    initial: { opacity: 0, y: 50, scale: 0.3 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: 20, scale: 0.5 },
                    transition: { duration: 0.2 },
                }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-twitter-blue text-white px-6 py-3 rounded-full shadow-lg z-50"
            >
                {message}
            </motion.div>
        )}
    </AnimatePresence>
  );
};

export default Toast;
