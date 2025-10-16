
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tweet, User } from '../types';
import TweetCard from './TweetCard';
import Avatar from './Avatar';

interface ReplyModalProps {
  tweet: Tweet;
  currentUser: User;
  onClose: () => void;
  onPostReply: (replyContent: string, originalTweet: Tweet) => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ tweet, currentUser, onClose, onPostReply }) => {
    const [replyText, setReplyText] = useState('');
    const isDisabled = replyText.trim().length === 0;
    
    const handlePost = () => {
        if (!isDisabled) {
            onPostReply(replyText, tweet);
        }
    }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-0 sm:pt-10"
      onClick={onClose}
    >
      {/* FIX: Wrapped framer-motion props to bypass type errors. */}
      <motion.div
        {...{
            initial: { y: -50, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: -50, opacity: 0 },
            transition: { type: 'spring', stiffness: 400, damping: 40 },
        }}
        className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg w-full h-full sm:h-auto sm:max-w-[600px] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-2 pr-4 flex items-center border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full">✕</button>
        </div>
        
        <div className="p-4 flex gap-4 flex-1 sm:flex-none overflow-y-auto">
            <div className="flex flex-col items-center">
                 <Avatar src={tweet.user.avatarUrl} alt={tweet.user.displayName} />
                 <div className="w-0.5 h-full bg-light-border dark:bg-twitter-border my-2"></div>
                 <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="small"/>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-1">
                    <span className="font-bold">{tweet.user.displayName}</span>
                    <span className="text-light-secondary-text dark:text-twitter-gray">@{tweet.user.username}</span>
                </div>
                <p>{tweet.content}</p>
                <p className="mt-3 text-light-secondary-text dark:text-twitter-gray">Replying to <span className="text-twitter-blue">@{tweet.user.username}</span></p>

                <textarea
                    placeholder="Post your reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-transparent text-xl resize-none focus:outline-none placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text mt-2"
                    rows={3}
                    autoFocus
                />
            </div>
        </div>
        
        <div className="p-4 flex justify-end border-t border-light-border dark:border-twitter-border dim:border-dim-border">
             <button 
                onClick={handlePost}
                className="bg-twitter-blue text-white font-bold px-6 py-2 rounded-full hover:bg-opacity-90 disabled:opacity-50"
                disabled={isDisabled}
            >
                Reply
            </button>
        </div>
        
      </motion.div>
    </div>
  );
};

export default ReplyModal;
