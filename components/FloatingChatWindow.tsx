import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversation, Message, User } from '../types';
import { mockUser } from '../data/mockData';
import { CloseIcon, WaveIcon, VideoCallIcon, PinFillIcon } from './Icon';
import AvatarWithStatus from './AvatarWithStatus';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

type MessageContent = 
    | { type: 'text'; text: string }
    | { type: 'voice'; audioUrl: string; duration: number }
    | { type: 'gif'; gifUrl: string }
    | { type: 'wave' };

interface FloatingChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onClose: () => void;
  onFocus: () => void;
  onMaximize: () => void;
  isFocused: boolean;
  positionRight: number;
  onSendMessage: (conversationId: string, content: MessageContent, replyTo?: Message) => void;
  onAddReaction: (conversationId: string, messageId: string, emoji: string) => void;
  onPinMessage: (conversationId: string, messageId: string) => void;
  onStartVideoCall: (user: User) => void;
}

const FloatingChatWindow: React.FC<FloatingChatWindowProps> = (props) => {
  const { conversation, messages, onClose, onFocus, onMaximize, isFocused, positionRight, onSendMessage, onAddReaction, onPinMessage, onStartVideoCall } = props;
  const [isMinimized, setIsMinimized] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pinnedMessage = useMemo(() => messages.find(m => m.isPinned), [messages]);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages, isMinimized]);

  const handleSendMessage = (content: MessageContent, replyTo?: Message) => {
    onSendMessage(conversation.id, content, replyTo);
    setReplyingTo(null);
  };
  
  const handleAddReaction = (messageId: string, emoji: string) => {
    onAddReaction(conversation.id, messageId, emoji);
  };
  
  const handleHeaderClick = () => {
    if (isMinimized) {
      setIsMinimized(false);
    }
    onFocus();
  }

  if (isMinimized) {
    return (
        <motion.div 
            className="pointer-events-auto fixed group"
            style={{ zIndex: isFocused ? 110 : 100, right: positionRight + 16, bottom: 4 }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, x: 0 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        >
            <button onClick={handleHeaderClick} className={`relative w-64 h-20 bg-light-bg dark:bg-twitter-light-dark dim:bg-dim-bg rounded-2xl shadow-lg p-3 flex items-center gap-3 text-left focus:outline-none transition-all duration-300 ${isFocused ? 'ring-2 ring-twitter-blue ring-offset-2 dark:ring-offset-twitter-dark' : ''}`}>
                <AvatarWithStatus user={conversation.participant} size="medium" />
                <div className="flex-1 overflow-hidden">
                    <p className="font-bold truncate text-light-text dark:text-dim-text">{conversation.participant.displayName}</p>
                    <p className="text-sm truncate text-light-secondary-text dark:text-twitter-gray">
                      {conversation.isTyping ? <span className="text-twitter-blue italic">typing...</span> : (messages.at(-1)?.text || '...')}
                    </p>
                </div>
                 <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-1 right-1 p-1 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <CloseIcon />
                </button>
                 {conversation.unreadCount > 0 && 
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                    </div>
                 }
            </button>
        </motion.div>
    );
  }

  return (
    <motion.div
      onDragStart={onFocus}
      className="w-80 h-[450px] bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-t-lg shadow-2xl flex flex-col pointer-events-auto"
      style={{ zIndex: isFocused ? 110 : 100, right: positionRight, bottom: 0, position: 'fixed' }}
      initial={{ y: "100%", opacity: 0.8 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <header onDoubleClick={() => setIsMinimized(true)} onClick={onFocus} className="p-2 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border cursor-pointer">
        <div className="flex items-center gap-2">
          <AvatarWithStatus user={conversation.participant} size="small" />
          <div className="flex flex-col">
            <span className="font-bold leading-tight">{conversation.participant.displayName}</span>
            {conversation.isTyping && <span className="text-twitter-blue text-xs italic leading-tight">typing...</span>}
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={() => handleSendMessage({type: 'wave'})} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><WaveIcon /></button>
          <button onClick={() => onStartVideoCall(conversation.participant)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><VideoCallIcon /></button>
          <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full text-lg font-bold">⎯</button>
          <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
        </div>
      </header>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto relative">
        <AnimatePresence>
            {pinnedMessage && (
                <motion.div layout initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} className="sticky top-0 z-10 bg-light-hover/80 dark:bg-white/10 backdrop-blur-sm p-2 rounded-lg mb-2 text-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-twitter-blue">
                           <PinFillIcon className="w-4 h-4" />
                           <span className="font-bold">Pinned</span>
                        </div>
                        <button onClick={() => onPinMessage(conversation.id, pinnedMessage.id)} className="font-bold text-lg p-1">&times;</button>
                    </div>
                    <p className="truncate text-light-secondary-text dark:text-dim-secondary-text mt-1">{pinnedMessage.text || "Pinned message"}</p>
                </motion.div>
            )}
        </AnimatePresence>

        {messages.map(msg => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwnMessage={msg.senderId === mockUser.id} 
            onReply={setReplyingTo} 
            onAddReaction={handleAddReaction} 
            onPinMessage={(messageId) => onPinMessage(conversation.id, messageId)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </motion.div>
  );
};

export default FloatingChatWindow;