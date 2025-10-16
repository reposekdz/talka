
import React from 'react';
import { motion } from 'framer-motion';
import Composer from './Composer';
import { Tweet } from '../types';
import { CloseIcon } from './Icon';

interface ComposerModalProps {
  onClose: () => void;
  onPostTweet: (tweet: Partial<Tweet>) => void;
}

const ComposerModal: React.FC<ComposerModalProps> = ({ onClose, onPostTweet }) => {
  const handlePost = (tweet: Partial<Tweet>) => {
    onPostTweet(tweet);
    onClose();
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg z-50 flex flex-col"
    >
      <header className="p-2 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
          <CloseIcon />
        </button>
        {/* The Post button is inside the Composer component */}
      </header>
      <div className="flex-1 overflow-y-auto">
        <Composer onPostTweet={handlePost} />
      </div>
    </motion.div>
  );
};

export default ComposerModal;
