
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingChatWindow from './FloatingChatWindow';
import { Conversation, Message, User } from '../types';

type MessageContent = | { type: 'text'; text: string } | { type: 'voice'; audioUrl: string; duration: number } | { type: 'gif'; gifUrl: string };

interface FloatingChatManagerProps {
  chats: Conversation[];
  allMessages: Record<string, Message[]>;
  onCloseChat: (conversationId: string) => void;
  onFocusChat: (user: User) => void;
  onNavigateToMessages: () => void;
  onSendMessage: (conversationId: string, content: MessageContent, replyTo?: Message) => void;
  onAddReaction: (conversationId: string, messageId: string, emoji: string) => void;
  onStartVideoCall: (user: User) => void;
}

const FloatingChatManager: React.FC<FloatingChatManagerProps> = (props) => {
  const { chats, allMessages, onCloseChat, onFocusChat, onNavigateToMessages, onSendMessage, onAddReaction, onStartVideoCall } = props;
  const focusedIndex = chats.length - 1;

  return (
    <div className="fixed bottom-0 right-4 sm:right-8 md:right-16 z-40 flex items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {chats.map((chat, index) => (
          <FloatingChatWindow
            key={chat.id}
            conversation={chat}
            messages={allMessages[chat.id] || []}
            onClose={() => onCloseChat(chat.id)}
            onFocus={() => onFocusChat(chat.participant)}
            onMaximize={onNavigateToMessages}
            isFocused={index === focusedIndex}
            positionRight={(chats.length - 1 - index) * 80}
            onSendMessage={onSendMessage}
            onAddReaction={onAddReaction}
            onStartVideoCall={onStartVideoCall}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatManager;