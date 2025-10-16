import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tweet } from '../types';
import Avatar from './Avatar';

interface EditTweetModalProps {
  tweet: Tweet;
  onClose: () => void;
  onSave: (tweetId: string, newContent: string) => void;
}

const EditTweetModal: React.FC<EditTweetModalProps> = ({ tweet, onClose, onSave }) => {
    const [editText, setEditText] = useState(tweet.content);
    const isDisabled = editText.trim().length === 0 || editText.trim() === tweet.content;
    
    const handleSave = () => {
        if (!isDisabled) {
            onSave(tweet.id, editText);
        }
    }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg w-full max-w-[600px] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border">
            <div className="flex items-center">
                <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full">✕</button>
                <h2 className="font-bold text-lg ml-4">Edit Post</h2>
            </div>
            <button 
                onClick={handleSave}
                className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90 disabled:opacity-50"
                disabled={isDisabled}
            >
                Save
            </button>
        </div>
        
        <div className="p-4 flex gap-4">
            <Avatar src={tweet.user.avatarUrl} alt={tweet.user.displayName} />
            <div className="flex-1">
                <div className="flex items-center gap-1">
                    <span className="font-bold">{tweet.user.displayName}</span>
                    <span className="text-light-secondary-text dark:text-twitter-gray">@{tweet.user.username}</span>
                </div>

                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-transparent text-lg resize-y focus:outline-none placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text mt-2"
                    rows={5}
                    autoFocus
                />
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditTweetModal;