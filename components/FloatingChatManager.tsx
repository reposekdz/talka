
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingChatWindow from './FloatingChatWindow';
import { Conversation, Message, User, ChatTheme, Reel } from '../types';

type MessageContent = | { type: 'text'; text: string } | { type: 'voice'; audioUrl: string; duration: number } | { type: 'gif'; gifUrl: string } | { type: 'wave' } | { type: 'image', imageUrl: string, text?: string } | { type: 'reel-share', reelId: string };

interface FloatingChatManagerProps {
  chats: Conversation[];
  allMessages: Record<string, Message[]>;
  reels: Reel[];
  onCloseChat: (conversationId: string) => void;
  onFocusChat: (user: User) => void;
  onNavigateToMessages: () => void;
  onSendMessage: (conversationId: string, content: MessageContent, replyTo?: Message) => void;
  onAddReaction: (conversationId: string, messageId: string, emoji: string) => void;
  onPinMessage: (conversationId: string, messageId: string) => void;
  onStartVideoCall: (user: User) => void;
  onStartAudioCall: (user: User) => void;
  onUpdateChatTheme: (conversationId: string, theme: ChatTheme) => void;
}

const FloatingChatManager: React.FC<FloatingChatManagerProps> = (props) => {
  const { chats, allMessages, reels, onCloseChat, onFocusChat, onNavigateToMessages, onSendMessage, onAddReaction, onPinMessage, onStartVideoCall, onStartAudioCall, onUpdateChatTheme } = props;
  const focusedIndex = chats.length - 1;

  return (
    <div className="fixed bottom-0 right-4 sm:right-8 md:right-16 z-40 hidden sm:flex items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {chats.map((chat, index) => (
          <FloatingChatWindow
            key={chat.id}
            conversation={chat}
            messages={allMessages[chat.id] || []}
            reels={reels}
            onClose={() => onCloseChat(chat.id)}
            onFocus={() => onFocusChat(chat.participant)}
            onMaximize={onNavigateToMessages}
            isFocused={index === focusedIndex}
            positionRight={(chats.length - 1 - index) * 100}
            onSendMessage={onSendMessage}
            onAddReaction={onAddReaction}
            onPinMessage={onPinMessage}
            onStartVideoCall={onStartVideoCall}
            onStartAudioCall={onStartAudioCall}
            onUpdateChatTheme={onUpdateChatTheme}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatManager;
