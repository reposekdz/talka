
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversation, Message, User, ChatTheme, Reel } from '../types';
import { mockUser } from '../data/mockData';
import { CloseIcon, VideoCallIcon, PhoneIcon, ChevronLeftIcon, SearchIcon, PinFillIcon } from './Icon';
import AvatarWithStatus from './AvatarWithStatus';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

type MessageContent = 
    | { type: 'text'; text: string }
    | { type: 'voice'; audioUrl: string; duration: number }
    | { type: 'gif'; gifUrl: string }
    | { type: 'wave' }
    | { type: 'image'; imageUrl: string; text?: string }
    | { type: 'reel-share', reelId: string };

interface MobileChatViewProps {
  conversation: Conversation;
  messages: Message[];
  reels: Reel[];
  onClose: () => void;
  onSendMessage: (conversationId: string, content: MessageContent, replyTo?: Message) => void;
  onEditMessage: (conversationId: string, messageId: string, newText: string) => void;
  onDeleteMessage: (conversationId: string, messageId: string) => void;
  onAddReaction: (conversationId: string, messageId: string, emoji: string) => void;
  onPinMessage: (conversationId: string, messageId: string) => void;
  onStartVideoCall: (user: User) => void;
  onStartAudioCall: (user: User) => void;
  onUpdateChatTheme: (conversationId: string, theme: ChatTheme) => void;
}

const MobileChatView: React.FC<MobileChatViewProps> = (props) => {
  const { conversation, messages, reels, onClose, onSendMessage, onEditMessage, onDeleteMessage, onAddReaction, onPinMessage, onStartVideoCall, onStartAudioCall } = props;
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showWave, setShowWave] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const pinnedMessage = useMemo(() => messages.find(m => m.isPinned), [messages]);

  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages;
    return messages.filter(m => m.text && m.text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [messages, searchTerm]);

  useEffect(() => {
    if(!isSearching) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSearching]);

  const handleSendMessage = (content: MessageContent, replyTo?: Message) => {
    if (editingMessage && content.type === 'text') {
        onEditMessage(conversation.id, editingMessage.id, content.text);
    } else {
        onSendMessage(conversation.id, content, replyTo);
    }
    setReplyingTo(null);
    setEditingMessage(null);
    if (content.type === 'wave') {
        setShowWave(true);
        setTimeout(() => setShowWave(false), 1500);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40, duration: 0.3 }}
      className="fixed inset-0 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg z-40 flex flex-col"
    >
      <header className="p-2 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><ChevronLeftIcon /></button>
            <AvatarWithStatus user={conversation.participant} size="small" />
            <span className="font-bold">{conversation.participant.displayName}</span>
        </div>
        <div className="flex items-center">
            <button onClick={() => setIsSearching(!isSearching)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><SearchIcon /></button>
            <button onClick={() => onStartAudioCall(conversation.participant)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><PhoneIcon /></button>
            <button onClick={() => onStartVideoCall(conversation.participant)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><VideoCallIcon /></button>
        </div>
      </header>

      <AnimatePresence>
        {isSearching && (
          <motion.div initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }} className="p-2 border-b border-light-border dark:border-twitter-border">
            <input 
              type="text"
              placeholder="Search in conversation"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-light-hover dark:bg-white/5 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-twitter-blue"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-2 space-y-2 overflow-y-auto relative">
         <AnimatePresence>
            {showWave && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 3, y: -50 }}
                    exit={{ opacity: 0, scale: 0, y: -100 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                >
                    <span className="text-9xl drop-shadow-lg">👋</span>
                </motion.div>
            )}
            {pinnedMessage && (
                <motion.div layout className="sticky top-0 z-10 bg-light-hover/80 dark:bg-white/10 backdrop-blur-sm p-2 rounded-lg mb-2 text-sm cursor-pointer">
                    <div className="flex items-center gap-1 text-twitter-blue">
                        <PinFillIcon className="w-4 h-4" />
                        <span className="font-bold">Pinned</span>
                    </div>
                    <p className="truncate text-light-secondary-text dark:text-dim-secondary-text mt-1">{pinnedMessage.text || "Pinned message"}</p>
                </motion.div>
            )}
        </AnimatePresence>

        {filteredMessages.map(msg => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            reels={reels}
            isOwnMessage={msg.senderId === mockUser.id} 
            onReply={setReplyingTo}
            onStartEdit={setEditingMessage}
            onDeleteMessage={(messageId) => onDeleteMessage(conversation.id, messageId)}
            onAddReaction={(messageId, emoji) => onAddReaction(conversation.id, messageId, emoji)}
            onPinMessage={(messageId) => onPinMessage(conversation.id, messageId)}
            chatTheme={conversation.chatTheme || 'default-blue'}
          />
        ))}
        {searchTerm && filteredMessages.length === 0 && (
            <div className="text-center text-sm text-light-secondary-text dark:text-twitter-gray p-4">No results found.</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput 
        onSendMessage={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        editingMessage={editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
      />
    </motion.div>
  );
};

export default MobileChatView;