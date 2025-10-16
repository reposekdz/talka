
import React, { useState, useEffect, useRef } from 'react';
import { UserStory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { PauseIcon, PlayIcon } from './Icon';

interface StoryViewerProps {
  stories: UserStory[];
  initialUserIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialUserIndex, onClose }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentUserStory = stories[currentUserIndex];
  const currentStory = currentUserStory.stories[currentStoryIndex];

  const goToNextStory = () => {
    if (currentStoryIndex < currentUserStory.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      goToNextUser();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      goToPrevUser();
    }
  };

  const goToNextUser = () => {
    if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const goToPrevUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(0);
    }
  };
  
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      timerRef.current = window.setTimeout(goToNextStory, currentStory.duration * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentStoryIndex, currentUserIndex, isPaused]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full max-w-sm h-[90vh] bg-gray-900 rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <AnimatePresence>
          <motion.img
            key={`${currentUserIndex}-${currentStoryIndex}`}
            src={currentStory.mediaUrl}
            initial={{ opacity: 0.5, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.5, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex gap-1">
            {currentUserStory.stories.map((story, index) => (
              <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                {index < currentStoryIndex && <div className="h-full bg-white"></div>}
                {index === currentStoryIndex && (
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: '0%' }}
                    animate={isPaused ? { width: '0%' } : { width: '100%' }}
                    transition={{ duration: isPaused ? 0 : currentStory.duration, ease: 'linear' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <img src={currentUserStory.user.avatarUrl} alt={currentUserStory.user.displayName} className="w-10 h-10 rounded-full" />
            <span className="text-white font-bold">{currentUserStory.user.displayName}</span>
            <button onClick={() => setIsPaused(!isPaused)} className="text-white ml-auto">
                {isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
          </div>
        </div>

        <div onClick={goToPrevStory} className="absolute left-0 top-0 bottom-0 w-1/3" />
        <div onClick={goToNextStory} className="absolute right-0 top-0 bottom-0 w-1/3" />
        
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-20 font-light hover:scale-110 transition-transform">✕</button>
      </div>
    </motion.div>
  );
};

export default StoryViewer;
