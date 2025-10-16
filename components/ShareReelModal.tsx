import React from 'react';
import { motion } from 'framer-motion';
import { Reel, Conversation } from '../types';
import { CloseIcon, SearchIcon, SendIcon } from './Icon';
import AvatarWithStatus from './AvatarWithStatus';

interface ShareReelModalProps {
  reel: Reel;
  conversations: Conversation[];
  onClose: () => void;
  onShare: (reelId: string, conversationId: string) => void;
}

const ShareReelModal: React.FC<ShareReelModalProps> = ({ reel, conversations, onClose, onShare }) => {

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg w-full max-w-md rounded-2xl flex flex-col h-[70vh] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
          <h2 className="font-bold text-lg">Share Reel</h2>
          <div className="w-10"></div>
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
          {conversations.map(conv => (
            <div key={conv.id} className="p-3 flex items-center justify-between hover:bg-light-hover dark:hover:bg-white/5">
              <div className="flex items-center gap-3">
                <AvatarWithStatus user={conv.participant} size="medium" />
                <div>
                  <p className="font-bold">{conv.participant.displayName}</p>
                  <p className="text-sm text-light-secondary-text dark:text-twitter-gray">@{conv.participant.username}</p>
                </div>
              </div>
              <button 
                onClick={() => onShare(reel.id, conv.id)}
                className="bg-twitter-blue text-white font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90"
              >
                Send
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ShareReelModal;
