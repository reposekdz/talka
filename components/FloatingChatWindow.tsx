
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Conversation, Message, User } from '../types';
import { mockUser } from '../data/mockData';
import { CloseIcon, ExpandIcon, VideoCallIcon } from './Icon';
import AvatarWithStatus from './AvatarWithStatus';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

type MessageContent = 
    | { type: 'text'; text: string }
    | { type: 'voice'; audioUrl: string; duration: number }
    | { type: 'gif'; gifUrl: string };

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
  onStartVideoCall: (user: User) => void;
}

const FloatingChatWindow: React.FC<FloatingChatWindowProps> = (props) => {
  const { conversation, messages, onClose, onFocus, onMaximize, isFocused, positionRight, onSendMessage, onAddReaction, onStartVideoCall } = props;
  const [isMinimized, setIsMinimized] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

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
            className="pointer-events-auto fixed"
            style={{ zIndex: isFocused ? 110 : 100, right: positionRight + 16, bottom: 0 }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, x: 0 }}
            exit={{ y: 100, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        >
            <button onClick={handleHeaderClick} className={`w-16 h-16 rounded-full shadow-lg mb-2 focus:outline-none transition-all duration-200 ${isFocused ? 'ring-2 ring-twitter-blue ring-offset-2 dark:ring-offset-twitter-dark' : ''}`}>
                <AvatarWithStatus user={conversation.participant} size="large" />
            </button>
        </motion.div>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ top: -400, bottom: 0, left: -800, right: 400 }}
      onDragStart={onFocus}
      className="w-80 h-[450px] bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-t-lg shadow-2xl flex flex-col pointer-events-auto"
      style={{ zIndex: isFocused ? 110 : 100, right: positionRight, bottom: 0, position: 'fixed' }}
      initial={{ y: "100%", opacity: 0.8 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <header onDoubleClick={() => setIsMinimized(true)} onClick={onFocus} className="p-2 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <AvatarWithStatus user={conversation.participant} size="small" />
          <div className="flex flex-col">
            <span className="font-bold leading-tight">{conversation.participant.displayName}</span>
            {conversation.isTyping && <span className="text-twitter-blue text-xs italic leading-tight">typing...</span>}
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={() => onStartVideoCall(conversation.participant)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><VideoCallIcon /></button>
          <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full text-lg font-bold">⎯</button>
          <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
        </div>
      </header>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === mockUser.id} onReply={setReplyingTo} onAddReaction={handleAddReaction} />
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