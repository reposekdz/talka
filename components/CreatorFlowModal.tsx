

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CloseIcon, ComposeIcon, StoryIcon, ReelsIcon, ChevronLeftIcon } from './Icon';
import { Tweet, Story, Reel } from '../types';
import Composer from './Composer';
import StoryCreator from './StoryCreator';
import ReelCreator from './ReelCreator';

interface CreatorFlowModalProps {
  initialMode?: 'select' | 'story' | 'reel' | 'post';
  onClose: () => void;
  onPostTweet: (tweet: Partial<Tweet>) => void;
  onPostStory: (newStory: Omit<Story, 'id' | 'timestamp'>) => void;
  onPostReel: (videoUrl: string, caption: string) => void;
}

type CreatorMode = 'select' | 'post' | 'story' | 'reel';

const CreatorFlowModal: React.FC<CreatorFlowModalProps> = ({ initialMode = 'select', onClose, onPostTweet, onPostStory, onPostReel }) => {
    const [mode, setMode] = useState<CreatorMode>(initialMode);

    const renderContent = () => {
        switch (mode) {
            case 'post':
                return <Composer onPostTweet={onPostTweet} />;
            case 'story':
                return <StoryCreator onPostStory={onPostStory} />;
            case 'reel':
                return <ReelCreator onPostReel={onPostReel} />;
            case 'select':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <h2 className="text-3xl font-extrabold mb-8 text-light-text dark:text-dim-text">What would you like to create?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMode('post')} className="p-8 bg-light-hover dark:bg-white/5 rounded-2xl flex flex-col items-center gap-4 hover:bg-light-border dark:hover:bg-white/10 transition-colors aspect-square justify-center">
                                <ComposeIcon />
                                <span className="font-bold text-xl">Post</span>
                            </motion.button>
                             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMode('story')} className="p-8 bg-light-hover dark:bg-white/5 rounded-2xl flex flex-col items-center gap-4 hover:bg-light-border dark:hover:bg-white/10 transition-colors aspect-square justify-center">
                                <StoryIcon />
                                <span className="font-bold text-xl">Story</span>
                            </motion.button>
                             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setMode('reel')} className="p-8 bg-light-hover dark:bg-white/5 rounded-2xl flex flex-col items-center gap-4 hover:bg-light-border dark:hover:bg-white/10 transition-colors aspect-square justify-center">
                                <ReelsIcon />
                                <span className="font-bold text-xl">Reel</span>
                            </motion.button>
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