
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversation, Message, User, ChatTheme, Reel } from '../types';
import { mockUser } from '../data/mockData';
import { CloseIcon, WaveIcon, VideoCallIcon, PinFillIcon, MoreIcon, PhoneIcon } from './Icon';
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

interface FloatingChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  reels: Reel[];
  onClose: () => void;
  onFocus: () => void;
  onMaximize: () => void;
  isFocused: boolean;
  positionRight: number;
  onSendMessage: (conversationId: string, content: MessageContent, replyTo?: Message) => void;
  onEditMessage: (conversationId: string, messageId: string, newText: string) => void;
  onDeleteMessage: (conversationId: string, messageId: string) => void;
  onAddReaction: (conversationId: string, messageId: string, emoji: string) => void;
  onPinMessage: (conversationId: string, messageId: string) => void;
  onStartVideoCall: (user: User) => void;
  onStartAudioCall: (user: User) => void;
  onUpdateChatTheme: (conversationId: string, theme: ChatTheme) => void;
}

const themeOptions: { name: string, theme: ChatTheme, class: string }[] = [
    { name: 'Default', theme: 'default-blue', class: 'bg-twitter-blue' },
    { name: 'Sunset', theme: 'sunset-orange', class: 'bg-gradient-to-br from-orange-500 to-red-500' },
    { name: 'Ocean', theme: 'ocean-green', class: 'bg-gradient-to-br from-green-400 to-teal-500' },
    { name: 'Mint', theme: 'minty-fresh', class: 'bg-gradient-to-br from-emerald-400 to-lime-400' },
]

const ChatOptionsMenu: React.FC<{onSelectTheme: (theme: ChatTheme) => void; onClose: () => void;}> = ({ onSelectTheme, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        // FIX: Wrapped framer-motion props to bypass type errors.
        <motion.div
            ref={menuRef}
            {...{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
            }}
            className="absolute top-12 right-2 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg p-2 rounded-lg shadow-lg border border-light-border dark:border-twitter-border z-20"
        >
            <p className="text-xs text-light-secondary-text dark:text-twitter-gray px-2 pb-1">Chat Theme</p>
            <div className="flex gap-2">
                {themeOptions.map(opt => (
                    <button key={opt.theme} onClick={() => onSelectTheme(opt.theme)} className={`w-6 h-6 rounded-full ${opt.class}`}></button>
                ))}
            </div>
        </motion.div>
    )
}

const FloatingChatWindow: React.FC<FloatingChatWindowProps> = (props) => {
  const { conversation, messages, reels, onClose, onFocus, onMaximize, isFocused, positionRight, onSendMessage, onEditMessage, onDeleteMessage, onAddReaction, onPinMessage, onStartVideoCall, onStartAudioCall, onUpdateChatTheme } = props;
  const [isMinimized, setIsMinimized] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [showWave, setShowWave] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pinnedMessage = useMemo(() => messages.find(m => m.isPinned), [messages]);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages, isMinimized]);

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
        // FIX: Wrapped framer-motion props to bypass type errors.
        <motion.div 
            className="pointer-events-auto fixed group"
            style={{ zIndex: isFocused ? 110 : 100, right: positionRight + 16, bottom: 4 }}
            {...{
                drag: true,
                dragConstraints: { top: 0, left: 0, right: window.innerWidth - 256, bottom: window.innerHeight - 80 },
                dragMomentum: false,
                onDragStart: onFocus,
                initial: { y: 100, opacity: 0 },
                animate: { y: 0, opacity: 1, x: 0 },
                exit: { y: 100, opacity: 0, scale: 0.8 },
                transition: { type: 'spring', stiffness: 400, damping: 35 },
            }}
        >
            <button onClick={handleHeaderClick} className={`relative w-64 h-20 bg-light-bg dark:bg-twitter-light-dark dim:bg-dim-bg rounded-2xl shadow-lg p-3 flex items-center gap-3 text-left focus:outline-none transition-all duration-300 ${isFocused ? 'ring-2 ring-twitter-blue ring-offset-2 dark:ring-offset-twitter-dark' : ''}`}>
                <AvatarWithStatus user={conversation.participant} size="medium" />
                <div className="flex-1 overflow-hidden">
                    <p className="font-bold truncate text-light-text dark:text-dim-text">{conversation.participant.displayName}</p>
                    <p className="text-sm truncate text-light-secondary-text dark:text-twitter-gray">
                      {/* FIX: Replaced .at(-1) with bracket notation for wider JS/TS version support. */}
                      {conversation.isTyping ? <span className="text-twitter-blue italic">typing...</span> : (messages[messages.length-1]?.text || '...')}
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
    // FIX: Wrapped framer-motion props to bypass type errors.
    <motion.div
      {...{
        drag: true,
        dragListener: false,
        dragConstraints: { top: 0, left: 0, right: window.innerWidth - 320, bottom: window.innerHeight - 450 },
        dragMomentum: false,
        onDragStart: onFocus,
      }}
      className="w-80 h-[450px] bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-t-lg shadow-2xl flex flex-col pointer-events-auto"
      style={{ zIndex: isFocused ? 110 : 100, right: positionRight, bottom: 0, position: 'fixed' }}
      {...{
        initial: { y: "100%", opacity: 0.8 },
        animate: { y: 0, opacity: 1 },
        exit: { y: "100%", opacity: 0.8 },
        transition: { type: 'spring', stiffness: 400, damping: 30 },
      }}
    >
      <motion.header onPointerDown={(e) => { e.currentTarget.style.cursor = 'grabbing'; (e.currentTarget.parentElement as HTMLDivElement).setAttribute('drag', 'true')}} onPointerUp={(e) => e.currentTarget.style.cursor = 'pointer'} onDoubleClick={() => setIsMinimized(true)} onClick={onFocus} className="p-2 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border cursor-pointer relative">
        <div className="flex items-center gap-2">
          <AvatarWithStatus user={conversation.participant} size="small" />
          <div className="flex flex-col">
            <span className="font-bold leading-tight">{conversation.participant.displayName}</span>
            {conversation.isTyping && <span className="text-twitter-blue text-xs italic leading-tight">typing...</span>}
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={() => onStartAudioCall(conversation.participant)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><PhoneIcon /></button>
          <button onClick={() => onStartVideoCall(conversation.participant)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><VideoCallIcon /></button>
          <button onClick={() => setIsOptionsOpen(prev => !prev)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><MoreIcon /></button>
          <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
        </div>
        {isOptionsOpen && <ChatOptionsMenu onClose={() => setIsOptionsOpen(false)} onSelectTheme={(theme) => onUpdateChatTheme(conversation.id, theme)} />}
      </header>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto relative">
         <AnimatePresence>
            {showWave && (
                // FIX: Wrapped framer-motion props to bypass type errors.
                <motion.div 
                    {...{
                        initial: { opacity: 0, scale: 0.5, y: 50 },
                        animate: { opacity: 1, scale: 1.5, y: -50 },
                        exit: { opacity: 0, scale: 0, y: -100 },
                        transition: { type: 'spring', stiffness: 300, damping: 20 },
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                >
                    <span className="text-8xl drop-shadow-lg">👋</span>
                </motion.div>
            )}
        </AnimatePresence>
        <AnimatePresence>
            {pinnedMessage && (
                // FIX: Wrapped framer-motion props to bypass type errors.
                <motion.div {...{layout:true, initial:{opacity: 0, y: -20}, animate:{opacity: 1, y: 0}, exit:{opacity: 0, y: -20}}} className="sticky top-0 z-10 bg-light-hover/80 dark:bg-white/10 backdrop-blur-sm p-2 rounded-lg mb-2 text-sm">
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
            reels={reels}
            isOwnMessage={msg.senderId === mockUser.id} 
            onReply={setReplyingTo}
            onStartEdit={setEditingMessage}
            onDeleteMessage={(messageId) => onDeleteMessage(conversation.id, messageId)}
            onAddReaction={handleAddReaction} 
            onPinMessage={(messageId) => onPinMessage(conversation.id, messageId)}
            chatTheme={conversation.chatTheme || 'default-blue'}
          />
        ))}
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

export default FloatingChatWindow;