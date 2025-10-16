import React from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingChatWindow from './FloatingChatWindow';
import { Conversation, Page, User } from '../types';

interface FloatingChatManagerProps {
  chats: Conversation[];
  onCloseChat: (conversationId: string) => void;
  onFocusChat: (user: User) => void;
  onNavigateToMessages: () => void;
}

const FloatingChatManager: React.FC<FloatingChatManagerProps> = ({ chats, onCloseChat, onFocusChat, onNavigateToMessages }) => {
  const focusedIndex = chats.length - 1;

  return (
    <div className="fixed bottom-0 right-4 sm:right-8 md:right-16 z-40 flex items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {chats.map((chat, index) => (
          <FloatingChatWindow
            key={chat.id}
            conversation={chat}
            onClose={() => onCloseChat(chat.id)}
            onFocus={() => onFocusChat(chat.participant)}
            onMaximize={onNavigateToMessages}
            isFocused={index === focusedIndex}
            positionRight={(chats.length - 1 - index) * 80}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatManager;