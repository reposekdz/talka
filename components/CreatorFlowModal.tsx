

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CloseIcon, ComposeIcon, StoryIcon, ReelsIcon, ChevronLeftIcon } from './Icon';
import { Tweet, Story, Reel, User } from '../types';
import Composer from './Composer';
import StoryCreator from './StoryCreator';
import ReelCreator from './ReelCreator';

interface CreatorFlowModalProps {
  initialMode?: 'select' | 'story' | 'reel' | 'post';
  allUsers: User[];
  onClose: () => void;
  onPostTweet: (tweet: Partial<Tweet>) => void;
  onPostStory: (newStory: Omit<Story, 'id' | 'timestamp'>) => void;
  onPostReel: (videoUrl: string, caption: string) => void;
}

type CreatorMode = 'select' | 'post' | 'story' | 'reel';

const CreatorOptionButton: React.FC<{icon: React.ReactNode, title: string, description: string, onClick: () => void, gradient: string}> = ({ icon, title, description, onClick, gradient }) => (
    <motion.button
        onClick={onClick}
        className={`relative p-6 bg-light-hover dark:bg-white/5 rounded-2xl flex flex-col items-start gap-4 hover:bg-light-border dark:hover:bg-white/10 transition-colors text-left overflow-hidden group`}
        whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
    >
        <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
        <div className={`p-3 rounded-full bg-gradient-to-br ${gradient} text-white`}>
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-xl">{title}</h3>
            <p className="text-sm text-light-secondary-text dark:text-twitter-gray mt-1">{description}</p>
        </div>
    </motion.button>
);


const CreatorFlowModal: React.FC<CreatorFlowModalProps> = ({ initialMode = 'select', allUsers, onClose, onPostTweet, onPostStory, onPostReel }) => {
    const [mode, setMode] = useState<CreatorMode>(initialMode);

    const renderContent = () => {
        switch (mode) {
            case 'post':
                return <Composer onPostTweet={onPostTweet} />;
            case 'story':
                return <StoryCreator allUsers={allUsers} onPostStory={onPostStory} />;
            case 'reel':
                return <ReelCreator onPostReel={onPostReel} />;
            case 'select':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <h2 className="text-3xl font-extrabold mb-8 text-light-text dark:text-dim-text">What would you like to create?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
                             <CreatorOptionButton icon={<ComposeIcon className="w-8 h-8"/>} title="Post" description="Share a quick thought, photo, or voice note." onClick={() => setMode('post')} gradient="from-blue-400 to-blue-600" />
                             <CreatorOptionButton icon={<StoryIcon className="w-8 h-8"/>} title="Story" description="Share a photo or video that disappears in 24 hours." onClick={() => setMode('story')} gradient="from-purple-400 to-pink-500" />
                             <CreatorOptionButton icon={<ReelsIcon className="w-8 h-8"/>} title="Reel" description="Create and share short, entertaining videos." onClick={() => setMode('reel')} gradient="from-rose-400 to-orange-500" />
                        </div>
                    </div>
                );
        }
    };

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed inset-0 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg z-50 flex flex-col"
        >
            <header className="p-2 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                {mode !== 'select' ? (
                    <button onClick={() => setMode('select')} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
                        <ChevronLeftIcon />
                    </button>
                ) : (
                     <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
                        <CloseIcon />
                    </button>
                )}
                 <div className="w-10"></div>
            </header>
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
            </div>
        </motion.div>
    );
};

export default CreatorFlowModal;