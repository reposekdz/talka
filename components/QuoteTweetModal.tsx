import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tweet, User } from '../types';
import Avatar from './Avatar';

interface QuoteTweetModalProps {
  tweet: Tweet;
  currentUser: User;
  onClose: () => void;
  onPostTweet: (tweet: Partial<Tweet>) => void;
}

const QuoteTweetModal: React.FC<QuoteTweetModalProps> = ({ tweet, currentUser, onClose, onPostTweet }) => {
    const [quoteText, setQuoteText] = useState('');
    const isDisabled = quoteText.trim().length === 0;
    
    const handlePost = () => {
        if (!isDisabled) {
            onPostTweet({
                content: quoteText,
                quotedTweet: tweet
            });
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
        <div className="p-2 pr-4 flex items-center border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full">✕</button>
        </div>
        
        <div className="p-4 flex gap-4">
             <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} />
            <div className="flex-1">
                <textarea
                    placeholder="Add a comment..."
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    className="w-full bg-transparent text-xl resize-none focus:outline-none placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text"
                    rows={4}
                    autoFocus
                />

                <div className="mt-2 border border-light-border dark:border-twitter-border dim:border-dim-border rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <img src={tweet.user.avatarUrl} alt={tweet.user.displayName} className="w-5 h-5 rounded-full" />
                        <span className="font-bold text-sm">{tweet.user.displayName}</span>
                    </div>
                    <p className="text-sm">{tweet.content}</p>
                </div>
            </div>
        </div>
        
        <div className="p-4 flex justify-end border-t border-light-border dark:border-twitter-border dim:border-dim-border">
             <button 
                onClick={handlePost}
                className="bg-twitter-blue text-white font-bold px-6 py-2 rounded-full hover:bg-opacity-90 disabled:opacity-50"
                disabled={isDisabled}
            >
                Post
            </button>
        </div>
        
      </motion.div>
    </div>
  );
};

export default QuoteTweetModal;
