import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Reel, Conversation } from '../types';
import { CloseIcon, SearchIcon, SendIcon, CheckmarkCircleIcon } from './Icon';
import AvatarWithStatus from './AvatarWithStatus';

interface ShareReelModalProps {
  reel: Reel;
  conversations: Conversation[];
  onClose: () => void;
  onShare: (reelId: string, conversationIds: string[], message?: string) => void;
}

const ShareReelModal: React.FC<ShareReelModalProps> = ({ reel, conversations, onClose, onShare }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleToggleSelection = (conversationId: string) => {
    setSelectedIds(prev =>
      prev.includes(conversationId)
        ? prev.filter(id => id !== conversationId)
        : [...prev, conversationId]
    );
  };

  const handleShare = () => {
    if (selectedIds.length > 0) {
      onShare(reel.id, selectedIds, message.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg w-full max-w-md h-full sm:h-[80vh] rounded-none sm:rounded-2xl flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
          <h2 className="font-bold text-lg">Share Reel</h2>
          <div className="w-10"></div>
        </div>

        <div className="p-4 flex gap-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
            <div className="w-20 h-32 rounded-lg overflow-hidden bg-black flex-shrink-0">
                <video src={reel.videoUrl} loop muted autoPlay className="w-full h-full object-cover" />
            </div>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message..."
                className="w-full bg-transparent focus:outline-none resize-none"
            />
        </div>

        <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-light-secondary-text dark:text-twitter-gray">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search people"
                    className="w-full bg-light-border dark:bg-twitter-light-dark rounded-full px-10 py-2 focus:outline-none"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => {
            const isSelected = selectedIds.includes(conv.id);
            return (
                <div 
                    key={conv.id} 
                    className="p-3 flex items-center justify-between hover:bg-light-hover dark:hover:bg-white/5 cursor-pointer"
                    onClick={() => handleToggleSelection(conv.id)}
                >
                    <div className="flex items-center gap-3">
                        <AvatarWithStatus user={conv.participant} />
                        <div>
                            <p className="font-bold">{conv.participant.displayName}</p>
                            <p className="text-sm text-light-secondary-text dark:text-twitter-gray">@{conv.participant.username}</p>
                        </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'bg-twitter-blue border-twitter-blue' : 'border-light-border dark:border-twitter-border'}`}>
                        {isSelected && <CheckmarkCircleIcon className="text-white" />}
                    </div>
                </div>
            );
          })}
        </div>
        
        <div className="p-4">
            <button
                onClick={handleShare}
                disabled={selectedIds.length === 0}
                className="w-full bg-twitter-blue text-white font-bold py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Send to {selectedIds.length > 0 ? selectedIds.length : ''}
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareReelModal;