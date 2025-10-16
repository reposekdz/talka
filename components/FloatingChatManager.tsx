
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingChatWindow from './FloatingChatWindow';
import MobileChatView from './MobileChatView';
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
  onEditMessage: (conversationId: string, messageId: string, newText: string) => void;
  onDeleteMessage: (conversationId: string, messageId: string) => void;
  onAddReaction: (conversationId: string, messageId: string, emoji: string) => void;
  onPinMessage: (conversationId: string, messageId: string) => void;
  onStartVideoCall: (user: User) => void;
  onStartAudioCall: (user: User) => void;
  handleUpdateChatTheme: (conversationId: string, theme: ChatTheme) => void;
}

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

const FloatingChatManager: React.FC<FloatingChatManagerProps> = (props) => {
  const { chats, allMessages, reels, onCloseChat, onFocusChat, onNavigateToMessages, onSendMessage, onEditMessage, onDeleteMessage, onAddReaction, onPinMessage, onStartVideoCall, onStartAudioCall, handleUpdateChatTheme } = props;
  const isMobile = useIsMobile();
  const focusedIndex = chats.length - 1;
  const focusedChat = chats[focusedIndex];

  if (isMobile) {
    return (
      <AnimatePresence>
        {focusedChat && (
          <MobileChatView
            key={focusedChat.id}
            conversation={focusedChat}
            messages={allMessages[focusedChat.id] || []}
            reels={reels}
            onClose={() => onCloseChat(focusedChat.id)}
            onSendMessage={onSendMessage}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            onAddReaction={onAddReaction}
            onPinMessage={onPinMessage}
            onStartVideoCall={onStartVideoCall}
            onStartAudioCall={onStartAudioCall}
            onUpdateChatTheme={handleUpdateChatTheme}
          />
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="fixed bottom-0 right-4 sm:right-8 md:right-16 z-40 flex items-end gap-4 pointer-events-none">
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
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            onAddReaction={onAddReaction}
            onPinMessage={onPinMessage}
            onStartVideoCall={onStartVideoCall}
            onStartAudioCall={onStartAudioCall}
            onUpdateChatTheme={handleUpdateChatTheme}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatManager;