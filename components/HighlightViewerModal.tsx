import React, { useState, useEffect, useRef } from 'react';
import { Highlight, Story } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from './Icon';

interface HighlightViewerModalProps {
  highlight: Highlight;
  onClose: () => void;
}

const HighlightStory: React.FC<{ story: Story, isActive: boolean, onNext: () => void }> = ({ story, isActive, onNext }) => {
    const [isPaused, setIsPaused] = useState(false);
    
    useEffect(() => {
        let timer: number;
        if (isActive && !isPaused) {
            timer = window.setTimeout(onNext, story.duration * 1000);
        }
        return () => clearTimeout(timer);
    }, [isActive, isPaused, story, onNext]);

    return (
        <div 
            className="relative w-full h-full"
            onMouseDown={() => setIsPaused(true)} onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)}
        >
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        className="absolute top-2 left-2 right-2 h-1 bg-white/30 rounded-full"
                    >
                        <motion.div
                            className="h-full bg-white rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: isPaused ? '0%' : '100%' }}
                            transition={{ duration: isPaused ? 0 : story.duration, ease: 'linear' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {story.type === 'image' ? (
                <img src={story.mediaUrl} className="w-full h-full object-contain" alt="Highlight story"/>
            ) : (
                <video src={story.mediaUrl} autoPlay loop muted className="w-full h-full object-contain" />
            )}
        </div>
    );
};

const HighlightViewerModal: React.FC<HighlightViewerModalProps> = ({ highlight, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        setCurrentIndex(prev => (prev + 1) % highlight.stories.length);
    };

    const goToStory = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
            onClick={onClose}
        >
            <header className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center text-white">
                <h2 className="text-2xl font-bold drop-shadow-lg">{highlight.title}</h2>
                <button onClick={onClose} className="p-2 bg-black/40 rounded-full hover:bg-black/60">
                    <CloseIcon />
                </button>
            </header>

            <main className="relative w-full max-w-md aspect-[9/16] rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                <AnimatePresence>
                    <motion.div
                        key={currentIndex}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <HighlightStory story={highlight.stories[currentIndex]} isActive={true} onNext={goToNext} />
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="absolute bottom-4 left-4 right-4 z-20" onClick={e => e.stopPropagation()}>
                <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar p-2">
                    {highlight.stories.map((story, index) => (
                        <button
                            key={story.id}
                            onClick={() => goToStory(index)}
                            className={`w-12 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${currentIndex === index ? 'border-white scale-110' : 'border-transparent opacity-60'}`}
                        >
                            <img src={story.mediaUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                        </button>
                    ))}
                </div>
            </footer>
        </motion.div>
    );
};

export default HighlightViewerModal;
