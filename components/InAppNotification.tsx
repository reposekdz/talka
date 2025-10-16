import React from 'react';
import { motion } from 'framer-motion';
import { Conversation, Message } from '../types';
import Avatar from './Avatar';
import { CloseIcon } from './Icon';

interface InAppNotificationProps {
  notification: {
    conversation: Conversation;
    message: Message;
  };
  onClose: () => void;
  onClick: () => void;
}

const InAppNotification: React.FC<InAppNotificationProps> = ({ notification, onClose, onClick }) => {
  const { conversation, message } = notification;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      onClick={onClick}
      className="fixed bottom-20 right-4 sm:right-8 md:right-16 z-50 w-80 bg-light-bg dark:bg-twitter-light-dark dim:bg-dim-bg rounded-2xl shadow-2xl cursor-pointer border border-light-border dark:border-twitter-border dim:border-dim-border"
    >
        <div className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar src={conversation.participant.avatarUrl} alt={conversation.participant.displayName} />
                    <span className="font-bold">{conversation.participant.displayName}</span>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="p-1 rounded-full hover:bg-light-hover dark:hover:bg-white/10"
                >
                    <CloseIcon />
                </button>
            </div>
            <p className="mt-2 text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
                {message.type === 'text' ? message.text : 'Sent you a message'}
            </p>
        </div>
    </motion.div>
  );
};

export default InAppNotification;