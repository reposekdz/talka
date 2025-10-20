import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Space } from '../types';
import { CloseIcon, SearchIcon, UserPlusIcon, CheckmarkCircleIcon } from './Icon';
import { otherUsers } from '../data/mockData';
import AvatarWithStatus from './AvatarWithStatus';

interface ListenAlongModalProps {
  space: Space;
  onClose: () => void;
}

const ListenAlongModal: React.FC<ListenAlongModalProps> = ({ space, onClose }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleToggleSelection = (userId: string) => {
        setSelectedIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const handleInvite = () => {
        // Mock sending invites
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-light-bg/80 dark:bg-twitter-dark/80 backdrop-blur-xl w-full max-w-md h-[70vh] rounded-2xl flex flex-col shadow-lg border border-light-border/50 dark:border-twitter-border/50"
            >
                <header className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
                        <h2 className="font-bold text-lg">Listen Along</h2>
                    </div>
                </header>
                <div className="p-4 border-b border-light-border dark:border-twitter-border">
                    <p className="font-bold">{space.title}</p>
                    <p className="text-sm text-light-secondary-text dark:text-twitter-gray">Invite friends to listen with you.</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {otherUsers.map(user => {
                        const isSelected = selectedIds.includes(user.id);
                        return (
                            <div key={user.id} onClick={() => handleToggleSelection(user.id)} className="p-3 flex items-center justify-between hover:bg-light-hover dark:hover:bg-white/5 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <AvatarWithStatus user={user} />
                                    <div>
                                        <p className="font-bold">{user.displayName}</p>
                                        <p className="text-sm text-light-secondary-text dark:text-twitter-gray">@{user.username}</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'bg-twitter-blue border-twitter-blue' : 'border-light-border dark:border-twitter-border'}`}>
                                    {isSelected && <CheckmarkCircleIcon className="text-white" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <footer className="p-4">
                    <button
                        onClick={handleInvite}
                        disabled={selectedIds.length === 0}
                        className="w-full bg-twitter-blue text-white font-bold py-3 rounded-full disabled:opacity-50"
                    >
                        Invite {selectedIds.length > 0 ? selectedIds.length : ''}
                    </button>
                </footer>
            </motion.div>
        </div>
    );
};

export default ListenAlongModal;