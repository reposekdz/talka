import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Conversation, Message, Page } from '../types';
import { mockMessages, mockUser } from '../data/mockData';
import { CloseIcon, MoreIcon, SendIcon } from './Icon';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';

interface FloatingChatWindowProps {
  conversation: Conversation;
  onClose: () => void;
  onMaximize: () => void;
  zIndex: number;
  initialX: number;
}

const FloatingChatWindow: React.FC<FloatingChatWindowProps> = ({ conversation, onClose, onMaximize, zIndex, initialX }) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>(mockMessages[conversation.id] || []);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: mockUser.id,
      text: inputText.trim(),
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: true,
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  if (isMinimized) {
    return (
        <motion.div 
            className="pointer-events-auto"
            style={{ zIndex }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
        >
            <button onClick={() => setIsMinimized(false)} className="w-16 h-16 rounded-full shadow-lg mb-2 focus:outline-none focus:ring-2 ring-twitter-blue ring-offset-2 dark:ring-offset-twitter-dark">
                <Avatar src={conversation.participant.avatarUrl} alt={conversation.participant.displayName} size="large" />
            </button>
        </motion.div>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ top: -400, bottom: 0, left: -800, right: 400 }}
      className="w-80 h-96 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-t-lg shadow-2xl flex flex-col pointer-events-auto"
      style={{ zIndex, x: initialX }}
      initial={{ y: "100%", opacity: 0.8 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <header onDoubleClick={() => setIsMinimized(true)} className="p-2 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <Avatar src={conversation.participant.avatarUrl} alt={conversation.participant.displayName} size="small" />
          <span className="font-bold">{conversation.participant.displayName}</span>
        </div>
        <div className="flex items-center">
          <button onClick={onMaximize} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full text-sm">⛶</button>
          <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full text-sm">⎯</button>
          <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
        </div>
      </header>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === mockUser.id} onReply={() => {}} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2 border-t border-light-border dark:border-twitter-border dim:border-dim-border">
         <div className="flex items-center gap-2 bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-4 py-1">
             <input
                type="text"
                placeholder="Message..."
                className="bg-transparent w-full focus:outline-none text-light-text dark:text-white dim:text-dim-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
             />
             <button onClick={handleSendMessage} className="p-2 text-twitter-blue" disabled={!inputText.trim()}><SendIcon /></button>
         </div>
      </div>
    </motion.div>
  );
};

export default FloatingChatWindow;
