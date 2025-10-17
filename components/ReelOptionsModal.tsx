
import React from 'react';
import { motion } from 'framer-motion';
import { BookmarkIcon, BookmarkFillIcon, DislikeIcon, ShareIcon } from './Icon';

interface ReelOptionsModalProps {
    onClose: () => void;
    isBookmarked: boolean;
    onToggleBookmark: () => void;
}

const ReelOptionsModal: React.FC<ReelOptionsModalProps> = ({ onClose, isBookmarked, onToggleBookmark }) => {

    const options = [
        { icon: isBookmarked ? <BookmarkFillIcon /> : <BookmarkIcon />, text: isBookmarked ? 'Saved' : 'Save', action: onToggleBookmark },
        { icon: <DislikeIcon />, text: 'Not interested', action: () => {} },
        { icon: <ShareIcon />, text: 'Copy link', action: () => {} },
    ];
    return (
        <div
            className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="bg-light-bg dark:bg-twitter-dark w-full max-w-lg rounded-t-2xl p-2"
                onClick={e => e.stopPropagation()}
            >
                <ul>
                    {options.map(opt => (
                        <li key={opt.text} onClick={opt.action} className="flex items-center gap-4 p-4 text-lg font-semibold hover:bg-light-hover dark:hover:bg-white/10 rounded-lg cursor-pointer">
                            {opt.icon}
                            <span>{opt.text}</span>
                        </li>
                    ))}
                </ul>
                <button onClick={onClose} className="w-full mt-2 p-4 text-lg font-semibold bg-light-hover dark:bg-white/10 rounded-lg">
                    Cancel
                </button>
            </motion.div>
        </div>
    );
};

export default ReelOptionsModal;
