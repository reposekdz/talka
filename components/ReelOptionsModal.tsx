
import React from 'react';
import { motion } from 'framer-motion';
import { Reel } from '../types';
import { BookmarkIcon, ShareIcon, TrashIcon } from './Icon';

interface ReelOptionsModalProps {
  reel: Reel;
  onClose: () => void;
  showToast: (message: string) => void;
}

const ReelOptionsModal: React.FC<ReelOptionsModalProps> = ({ reel, onClose, showToast }) => {
  
  const options = [
    { icon: <BookmarkIcon />, text: 'Save', action: () => showToast('Saved to device (simulated).') },
    { icon: <ShareIcon />, text: 'Copy link', action: () => showToast('Link copied (simulated).') },
    { icon: <TrashIcon />, text: 'Not interested', action: () => showToast("We'll show fewer reels like this.") },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="bg-light-bg dark:bg-twitter-light-dark w-full rounded-t-2xl p-2 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-light-border dark:bg-twitter-border rounded-full mx-auto mb-4" />
        <ul>
          {options.map((opt, index) => (
            <li key={index}>
              <button 
                onClick={() => { opt.action(); onClose(); }}
                className="w-full flex items-center gap-4 p-4 text-lg hover:bg-light-hover dark:hover:bg-white/10 rounded-lg"
              >
                {opt.icon}
                <span>{opt.text}</span>
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="w-full mt-2 p-4 font-bold text-lg bg-light-hover dark:bg-white/10 rounded-lg">
            Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ReelOptionsModal;
