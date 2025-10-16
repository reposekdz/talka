
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { UserStory } from '../types';
import Avatar from './Avatar';
import { LikeIcon, ReplyIcon, ShareIcon, SendIcon } from './Icon';

interface StoryViewerProps {
  userStories: UserStory[];
  initialUserIndex: number;
  onClose: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
};

const StoryViewer: React.FC<StoryViewerProps> = ({ userStories, initialUserIndex, onClose }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const progressControls = useAnimationControls();

  const currentUserStory = userStories[currentUserIndex];
  const activeStory = currentUserStory.stories[currentStoryIndex];
  
  const goToNextStory = useCallback(() => {
    setDirection(1);
    if (currentStoryIndex < currentUserStory.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentUserIndex < userStories.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  }, [currentStoryIndex, currentUserIndex, currentUserStory.stories.length, userStories.length, onClose]);

  const goToPrevStory = () => {
    setDirection(-1);
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentUserIndex > 0) {
      const prevUserStories = userStories[currentUserIndex - 1].stories;
      setCurrentUserIndex(currentUserIndex - 1);
      setCurrentStoryIndex(prevUserStories.length - 1);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      progressControls.set({ scaleX: 0 });
      progressControls.start({
        scaleX: 1,
        transition: { duration: activeStory.duration / 1000, ease: 'linear' },
      });
      const timer = setTimeout(() => {
        goToNextStory();
      }, activeStory.duration);
      return () => clearTimeout(timer);
    } else {
        progressControls.stop();
    }
  }, [currentStoryIndex, currentUserIndex, isPaused, activeStory.duration, goToNextStory, progressControls]);

  const handlePointerDown = () => setIsPaused(true);
  const handlePointerUp = () => setIsPaused(false);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
    >
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-20 font-light hover:scale-110 transition-transform">✕</button>
      
        <AnimatePresence initial={false} custom={direction}>
            <motion.div
            key={currentUserIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
            className="relative w-[360px] h-[640px] bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Media */}
                 <AnimatePresence>
                    <motion.div
                        key={`${currentUserIndex}-${currentStoryIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        {activeStory.type === 'video' ? (
                            <video src={activeStory.mediaUrl} autoPlay muted playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={activeStory.mediaUrl} alt="story content" className="w-full h-full object-cover" />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
                
                {/* Progress Bars */}
                <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
                    {currentUserStory.stories.map((_, index) => (
                    <div key={index} className="h-1 flex-1 bg-white/40 rounded-full overflow-hidden">
                        {index === currentStoryIndex && (
                           <motion.div
                                className="h-full bg-white origin-left"
                                initial={{ scaleX: 0 }}
                                animate={progressControls}
                            />
                        )}
                        {index < currentStoryIndex && <div className="h-full bg-white"></div>}
                    </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-5 left-4 flex items-center gap-3 z-10">
                    <Avatar src={currentUserStory.user.avatarUrl} alt={currentUserStory.user.displayName} size="small" />
                    <span className="text-white font-bold text-sm drop-shadow-md">{currentUserStory.user.displayName}</span>
                </div>

                {/* Footer */}
                <div 
                    className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2"
                    onPointerDown={e => e.stopPropagation()}
                >
                    <input
                        type="text"
                        placeholder="Send message"
                        className="w-full bg-black/30 border border-white/30 rounded-full px-4 py-2 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button className="p-2 text-white hover:bg-white/20 rounded-full"><LikeIcon /></button>
                    <button className="p-2 text-white hover:bg-white/20 rounded-full"><ShareIcon /></button>
                </div>
            </motion.div>
      </AnimatePresence>

      {/* Navigation Areas */}
      <div className="absolute left-0 top-0 h-full w-1/3 z-10" onClick={goToPrevStory}></div>
      <div className="absolute right-0 top-0 h-full w-1/3 z-10" onClick={goToNextStory}></div>
    </div>
  );
};

export default StoryViewer;