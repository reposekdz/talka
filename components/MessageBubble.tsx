import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatTheme, Reel } from '../types';
import { ReplyIcon, AddReactionIcon, ReadReceiptIcon, PinIcon, PlayIcon, MoreIcon, EditIcon, TrashIcon } from './Icon';
import AudioPlayer from './AudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import ReactionPicker from './ReactionPicker';
import LinkPreview from './LinkPreview';

interface MessageBubbleProps {
  message: Message;
  reels: Reel[];
  isOwnMessage: boolean;
  onReply: (message: Message) => void;
  onStartEdit: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onPinMessage: (messageId: string) => void;
  chatTheme: ChatTheme;
}

const themeClasses: Record<ChatTheme, string> = {
    'default-blue': 'bg-twitter-blue text-white',
    'sunset-orange': 'bg-gradient-to-br from-orange-500 to-red-500 text-white',
    'ocean-green': 'bg-gradient-to-br from-green-400 to-teal-500 text-white',
    'minty-fresh': 'bg-gradient-to-br from-emerald-400 to-lime-400 text-black',
};

const ReelShareContent: React.FC<{ reel: Reel, text?: string }> = ({ reel, text }) => (
    <div className="w-56 cursor-pointer group">
        {text && <p className="whitespace-pre-wrap break-words mb-2">{text}</p>}
        <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-black">
            <video src={reel.videoUrl} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <PlayIcon className="w-8 h-8 text-white/80" />
            </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
            <img src={reel.user.avatarUrl} alt={reel.user.displayName} className="w-6 h-6 rounded-full" />
            <div>
                <p className="text-xs font-bold leading-tight">{reel.user.displayName}</p>
                <p className="text-xs opacity-80 leading-tight truncate">{reel.caption}</p>
            </div>
        </div>
    </div>
);

const MessageOptionsMenu: React.FC<{onEdit: () => void; onDelete: () => void; onClose: () => void;}> = ({ onEdit, onDelete, onClose }) => {
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
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-full mb-1 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-lg shadow-lg border border-light-border dark:border-twitter-border z-20 text-sm w-28"
        >
            <button onClick={onEdit} className="w-full text-left flex items-center gap-2 p-2 hover:bg-light-hover dark:hover:bg-white/10">
                <EditIcon/> Edit
            </button>
            <button onClick={onDelete} className="w-full text-left flex items-center gap-2 p-2 text-red-500 hover:bg-red-500/10">
                <TrashIcon/> Delete
            </button>
        </motion.div>
    );
}


const MessageBubble: React.FC<MessageBubbleProps> = (props) => {
  const { message, reels, isOwnMessage, onReply, onStartEdit, onDeleteMessage, onAddReaction, onPinMessage, chatTheme } = props;
  const { text, type, replyTo, reactions, audioUrl, duration, gifUrl, imageUrl, isRead, reelId, isEdited } = message;
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  const renderContent = () => {
    switch(type) {
        case 'wave':
            return <motion.div initial={{scale:0.5, rotate:-20}} animate={{scale:1, rotate:0}} transition={{type: 'spring', stiffness: 300, damping:10}} className="text-6xl p-2">👋</motion.div>;
        case 'voice':
            return <AudioPlayer src={audioUrl!} duration={duration!} isOwnMessage={isOwnMessage} />;
        case 'gif':
            return <img src={gifUrl} alt="gif" className="rounded-lg max-w-sm h-auto" />;
        case 'image':
            return (
                <div className="max-w-xs">
                    <img src={imageUrl} alt="attached" className="rounded-lg max-w-full h-auto" />
                    {text && <p className="whitespace-pre-wrap break-words mt-2">{text}</p>}
                </div>
            );
        case 'reel-share':
            const reel = reels.find(r => r.id === reelId);
            if (!reel) return <p className="italic text-sm opacity-80">This reel is unavailable.</p>;
            return <ReelShareContent reel={reel} text={text} />;
        case 'text':
        default:
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = text?.match(urlRegex);
            const firstUrl = urls?.[0];

            return (
                <div>
                    <p className="whitespace-pre-wrap break-words">{text}</p>
                    {firstUrl && <LinkPreview url={firstUrl} />}
                </div>
            )
    }
  }
  
  const handleSelectReaction = (emoji: string) => {
    onAddReaction(message.id, emoji);
    setIsReactionPickerOpen(false);
  }

  const bubbleThemeClass = isOwnMessage 
    ? themeClasses[chatTheme] || themeClasses['default-blue']
    : 'bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border';

  const paddingClass = (type === 'wave' || type === 'reel-share' || (type === 'text' && text?.match(/(https?:\/\/[^\s]+)/g))) ? 'p-2' : 'p-3';

  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
        className={`flex items-end gap-2 group ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`relative max-w-xs md:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div className={`${paddingClass} rounded-2xl ${isOwnMessage ? `${bubbleThemeClass} rounded-br-lg` : `${bubbleThemeClass} rounded-bl-lg`}`}>
            {replyTo && (
                <div className={`border-l-2 ${isOwnMessage ? 'border-white/50' : 'border-twitter-blue'} pl-2 opacity-80 mb-2`}>
                    <p className="text-xs font-bold">
                        {replyTo.senderId === 'u1' ? 'You' : 'Them'}
                    </p>
                    <p className="text-sm italic truncate">
                        {replyTo.type === 'text' ? replyTo.text : 'Media message'}
                    </p>
                </div>
            )}

            {renderContent()}
            
             {isEdited && <span className="text-xs opacity-70 italic ml-2">(edited)</span>}
        </div>
         {reactions && reactions.length > 0 && (
            <div className="absolute -bottom-3 right-2 flex gap-1 z-10">
                {reactions.filter(r => r.users.length > 0).map((reaction, index) => (
                    <div key={index} className="bg-light-bg dark:bg-twitter-light-dark dim:bg-dim-bg px-2 py-0.5 rounded-full text-xs shadow border border-light-border dark:border-twitter-border dim:border-dim-border cursor-pointer">
                        {reaction.emoji} {reaction.users.length}
                    </div>
                ))}
            </div>
        )}
      </div>

       <div className={`relative flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isOwnMessage ? 'order-1' : 'order-2'}`}>
            <AnimatePresence>
                {isOptionsMenuOpen && isOwnMessage && (
                    <MessageOptionsMenu 
                        onEdit={() => { onStartEdit(message); setIsOptionsMenuOpen(false); }}
                        onDelete={() => onDeleteMessage(message.id)}
                        onClose={() => setIsOptionsMenuOpen(false)}
                    />
                )}
            </AnimatePresence>
            <button onClick={() => onPinMessage(message.id)} className="p-1.5 bg-light-hover dark:bg-white/10 dim:bg-dim-hover rounded-full text-light-secondary-text dark:text-twitter-gray"><PinIcon /></button>
            <button onClick={() => setIsReactionPickerOpen(true)} className="p-1.5 bg-light-hover dark:bg-white/10 dim:bg-dim-hover rounded-full text-light-secondary-text dark:text-twitter-gray"><AddReactionIcon /></button>
            <button onClick={() => onReply(message)} className="p-1.5 bg-light-hover dark:bg-white/10 dim:bg-dim-hover rounded-full text-light-secondary-text dark:text-twitter-gray"><ReplyIcon /></button>
            {isOwnMessage && <button onClick={() => setIsOptionsMenuOpen(true)} className="p-1.5 bg-light-hover dark:bg-white/10 dim:bg-dim-hover rounded-full text-light-secondary-text dark:text-twitter-gray"><MoreIcon /></button>}
            {isReactionPickerOpen && (
                <ReactionPicker 
                    onSelect={handleSelectReaction}
                    onClose={() => setIsReactionPickerOpen(false)}
                />
            )}
        </div>

        {isOwnMessage && isRead && (
            <div className="text-twitter-blue mb-1 order-3">
                <ReadReceiptIcon />
            </div>
        )}
    </motion.div>
  );
};

export default MessageBubble;