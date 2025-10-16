import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CloseIcon, ComposeIcon, StoryIcon, ReelsIcon } from './Icon';
import { Tweet } from '../types';
import Composer from './Composer';
// Placeholder components for Story and Reel creators
const StoryCreator = () => <div className="p-8 text-center">Story creator UI would be here.</div>;
const ReelCreator = () => <div className="p-8 text-center">Reel creator UI would be here.</div>;

interface CreatorModalProps {
  onClose: () => void;
  onPostTweet: (tweet: Partial<Tweet>) => void;
}

type CreatorMode = 'post' | 'story' | 'reel' | 'select';

const CreatorModal: React.FC<CreatorModalProps> = ({ onClose, onPostTweet }) => {
    const [mode, setMode] = useState<CreatorMode>('select');

    const handlePost = (tweet: Partial<Tweet>) => {
        onPostTweet(tweet);
        onClose();
    };

    const renderContent = () => {
        switch (mode) {
            case 'post':
                return <Composer onPostTweet={handlePost} />;
            case 'story':
                return <StoryCreator />;
            case 'reel':
                return <ReelCreator />;
            case 'select':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <h2 className="text-2xl font-bold mb-6">Create</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-lg">
                            <button onClick={() => setMode('post')} className="p-6 bg-light-hover dark:bg-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-light-border dark:hover:bg-white/10 transition-colors">
                                <ComposeIcon />
                                <span className="font-semibold">Post</span>
                            </button>
                             <button onClick={() => setMode('story')} className="p-6 bg-light-hover dark:bg-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-light-border dark:hover:bg-white/10 transition-colors">
                                <StoryIcon />
                                <span className="font-semibold">Story</span>
                            </button>
                             <button onClick={() => setMode('reel')} className="p-6 bg-light-hover dark:bg-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-light-border dark:hover:bg-white/10 transition-colors">
                                <ReelsIcon />
                                <span className="font-semibold">Reel</span>
                            </button>
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
                <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
                    <CloseIcon />
                </button>
                 {mode !== 'select' && (
                    <button onClick={() => setMode('select')} className="text-sm font-bold text-twitter-blue">
                        Back
                    </button>
                )}
            </header>
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
            </div>
        </motion.div>
    );
};

export default CreatorModal;
