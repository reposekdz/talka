import React from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingChatWindow from './FloatingChatWindow';
import { Conversation, Page } from '../types';

interface FloatingChatManagerProps {
  chats: Conversation[];
  onCloseChat: (conversationId: string) => void;
  onNavigateToMessages: (page: Page) => void;
}

const FloatingChatManager: React.FC<FloatingChatManagerProps> = ({ chats, onCloseChat, onNavigateToMessages }) => {
  return (
    <div className="fixed bottom-0 right-4 lg:right-96 z-40 flex items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {chats.map((chat, index) => (
          <FloatingChatWindow
            key={chat.id}
            conversation={chat}
            onClose={() => onCloseChat(chat.id)}
            onMaximize={() => onNavigateToMessages(Page.Messages)}
            zIndex={100 + index}
            initialX={-index * 40}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatManager;
