
import React from 'react';
import { motion } from 'framer-motion';
import { otherUsers } from '../data/mockData';
import Avatar from './Avatar';
import { CloseIcon, PaperPlaneIcon } from './Icon';

interface ReelCommentsProps {
  onClose: () => void;
}

const ReelComments: React.FC<ReelCommentsProps> = ({ onClose }) => {
    const mockComments = [
        { user: otherUsers[0], text: 'This is amazing!', timestamp: '2h' },
        { user: otherUsers[1], text: 'Great setup!', timestamp: '1h' },
        { user: otherUsers[2], text: 'Wow! 🚀', timestamp: '30m' },
    ];
  return (
    <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="absolute inset-0 bg-white dark:bg-twitter-dark z-20 flex flex-col"
    >
        <div className="p-4 border-b border-light-border dark:border-twitter-border flex justify-between items-center">
            <div/>
            <h3 className="font-bold">Comments</h3>
            <button onClick={onClose}><CloseIcon /></button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {mockComments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                    <Avatar src={comment.user.avatarUrl} alt={comment.user.displayName} size="small" />
                    <div>
                        <p>
                            <span className="font-bold text-sm">{comment.user.displayName}</span>
                            <span className="text-light-secondary-text dark:text-twitter-gray text-sm ml-2">{comment.timestamp}</span>
                        </p>
                        <p>{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="p-2 border-t border-light-border dark:border-twitter-border flex items-center gap-2">
            <Avatar src="https://picsum.photos/seed/u1/200/200" alt="current user" size="small" />
            <input 
                type="text" 
                placeholder="Add a comment..."
                className="w-full bg-light-border dark:bg-twitter-light-dark rounded-full px-4 py-2 focus:outline-none"
            />
            <button className="text-twitter-blue p-2"><PaperPlaneIcon/></button>
        </div>
    </motion.div>
  );
};

export default ReelComments;
