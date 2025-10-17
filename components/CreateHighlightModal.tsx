import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Story } from '../types';
import { CloseIcon, CheckmarkCircleIcon } from './Icon';

interface CreateHighlightModalProps {
    onClose: () => void;
    onCreate: (data: { title: string; stories: Story[] }) => void;
    userStories: Story[];
}

const CreateHighlightModal: React.FC<CreateHighlightModalProps> = ({ onClose, onCreate, userStories }) => {
    const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
    const [title, setTitle] = useState('');

    const toggleStorySelection = (storyId: string) => {
        setSelectedStoryIds(prev =>
            prev.includes(storyId) ? prev.filter(id => id !== storyId) : [...prev, storyId]
        );
    };

    const handleCreate = () => {
        const selectedStories = userStories.filter(s => selectedStoryIds.includes(s.id));
        if (title.trim() && selectedStories.length > 0) {
            onCreate({ title, stories: selectedStories });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-light-bg dark:bg-twitter-dark w-full max-w-2xl h-[90vh] rounded-2xl flex flex-col shadow-lg"
            >
                <header className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
                        <h2 className="font-bold text-lg">New Highlight</h2>
                    </div>
                    <button onClick={handleCreate} disabled={!title.trim() || selectedStoryIds.length === 0} className="bg-white text-black font-bold px-4 py-1.5 rounded-full disabled:opacity-50">Save</button>
                </header>
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Highlight name"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full bg-transparent border-b border-light-border dark:border-twitter-border focus:outline-none focus:border-twitter-blue py-2 text-xl"
                    />
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <p className="text-sm text-light-secondary-text dark:text-twitter-gray mb-4">Select stories to add to your new Highlight.</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {userStories.map(story => {
                            const isSelected = selectedStoryIds.includes(story.id);
                            const isVideo = story.type === 'video';
                            return (
                                <div key={story.id} className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer" onClick={() => toggleStorySelection(story.id)}>
                                    {isVideo ? (
                                        <video src={story.mediaUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={story.mediaUrl} alt={`Story ${story.id}`} className="w-full h-full object-cover" />
                                    )}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <CheckmarkCircleIcon className="w-10 h-10 text-twitter-blue" />
                                        </div>
                                    )}
                                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white bg-black/30 flex items-center justify-center`}>
                                        {isSelected && <div className="w-3 h-3 bg-twitter-blue rounded-full"></div>}
                                    </div>
                                </div>
                            );
                        })}
                        {userStories.length === 0 && (
                            <p className="col-span-full text-center text-light-secondary-text dark:text-twitter-gray py-10">You have no stories to add.</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateHighlightModal;