
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tweet, User } from '../types';
import { CloseIcon, PaperPlaneIcon } from './Icon';
import Avatar from './Avatar';
import { mockUser } from '../data/mockData';

interface ReelCommentsProps {
  reel: Tweet;
  onClose: () => void;
}

const ReelComments: React.FC<ReelCommentsProps> = ({ reel, onClose }) => {
  const [comments, setComments] = useState(reel.comments || []);
  const [newComment, setNewComment] = useState('');

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    const comment = {
        id: `c-${Date.now()}`,
        user: mockUser,
        text: newComment.trim(),
        timestamp: new Date().toISOString()
    };
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-30"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg z-40 flex flex-col"
      >
        <header className="flex items-center justify-between p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <h2 className="font-bold text-lg">Comments ({comments.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
            <CloseIcon />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3 items-start">
              <Avatar src={comment.user.avatarUrl} alt={comment.user.displayName} size="small" />
              <div>
                <div className="flex items-center gap-2 text-xs text-light-secondary-text dark:text-twitter-gray">
                  <span className="font-bold text-sm text-light-text dark:text-white">@{comment.user.username}</span>
                  <span>{formatTimestamp(comment.timestamp)}</span>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        <footer className="p-2 border-t border-light-border dark:border-twitter-border dim:border-dim-border">
          <div className="flex items-center gap-2">
            <Avatar src={mockUser.avatarUrl} alt={mockUser.displayName} size="small" />
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-4 py-2 focus:outline-none text-sm"
            />
            <button
                onClick={handleAddComment}
                className="p-2 text-twitter-blue disabled:opacity-50"
                disabled={!newComment.trim()}
            >
                <PaperPlaneIcon />
            </>
          </div>
        </footer>
      </motion.div>
    </>
  );
};

export default ReelComments;