import React, { useState } from 'react';
import { Reel, ReelComment } from '../types';
import { CloseIcon, HeartFillIcon, LikeIcon, PaperPlaneIcon } from './Icon';
import Avatar from './Avatar';
import { mockUser } from '../data/mockData';

interface ReelCommentsPanelProps {
  reel: Reel;
  onClose: () => void;
  onPostComment: (reelId: string, text: string) => void;
}

const CommentItem: React.FC<{ comment: ReelComment }> = ({ comment }) => {
    const [isLiked, setIsLiked] = useState(comment.isLiked);
    const [likeCount, setLikeCount] = useState(comment.likeCount);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };
    
    return (
        <div className="flex gap-3 py-3">
            <Avatar src={comment.user.avatarUrl} alt={comment.user.displayName} size="small" />
            <div className="flex-1">
                <p className="text-sm">
                    <span className="font-bold text-light-text dark:text-dim-text">{comment.user.displayName}</span>
                    <span className="text-light-secondary-text dark:text-twitter-gray ml-2">{comment.timestamp}</span>
                </p>
                <p className="text-light-text dark:text-dim-text">{comment.text}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-light-secondary-text dark:text-twitter-gray">
                    <button className="hover:underline">Reply</button>
                </div>
            </div>
            <div className="text-center">
                <button onClick={handleLike} className={`${isLiked ? 'text-red-500' : 'text-light-secondary-text dark:text-twitter-gray'}`}>
                    {isLiked ? <HeartFillIcon/> : <LikeIcon />}
                </button>
                <span className="text-xs">{likeCount}</span>
            </div>
        </div>
    );
}

const ReelCommentsPanel: React.FC<ReelCommentsPanelProps> = ({ reel, onClose, onPostComment }) => {
    const [newComment, setNewComment] = useState('');

    const handlePostComment = () => {
        if (!newComment.trim()) return;
        onPostComment(reel.id, newComment.trim());
        setNewComment('');
    };

  return (
    <aside className="w-[350px] h-screen bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg border-l border-light-border dark:border-twitter-border dim:border-dim-border flex flex-col">
        <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex justify-between items-center h-14">
            <h2 className="text-xl font-bold">Comments ({reel.commentCount.toLocaleString()})</h2>
            <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
                <CloseIcon />
            </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex gap-3 pb-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                <Avatar src={reel.user.avatarUrl} alt={reel.user.displayName} size="small" />
                <div>
                     <p className="text-sm">
                        <span className="font-bold text-light-text dark:text-dim-text">{reel.user.displayName}</span>
                    </p>
                    <p className="text-light-text dark:text-dim-text">{reel.caption}</p>
                </div>
            </div>
            {reel.comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
             {reel.comments.length === 0 && (
                <div className="text-center text-light-secondary-text dark:text-twitter-gray py-16">
                    <h3 className="font-bold">No comments yet</h3>
                    <p>Be the first to comment.</p>
                </div>
            )}
        </div>
        
        <div className="p-2 border-t border-light-border dark:border-twitter-border dim:border-dim-border">
            <div className="flex items-center gap-2 bg-light-border dark:bg-twitter-light-dark rounded-full px-4 py-2">
                <Avatar src={mockUser.avatarUrl} alt={mockUser.displayName} size="small" />
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent focus:outline-none"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                />
                <button onClick={handlePostComment} className="text-twitter-blue disabled:opacity-50" disabled={!newComment.trim()}>
                    <PaperPlaneIcon />
                </button>
            </div>
        </div>
    </aside>
  );
};

export default ReelCommentsPanel;
