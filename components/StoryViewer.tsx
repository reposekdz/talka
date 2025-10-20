import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: Import User type to be used in StoryViewerProps
import { UserStory, Story, User } from '../types';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { CloseIcon, PaperPlaneIcon } from './Icon';
import FloatingEmojis from './FloatingEmojis';

interface StoryViewerProps {
  stories: UserStory[];
  // FIX: Add allUsers prop to match usage in App.tsx
  allUsers: User[];
  initialUserIndex: number;
  onClose: () => void;
  showToast: (message: string) => void;
}

const StoryProgressBar: React.FC<{
  storyCount: number;
  currentStoryIndex: number;
  onNext: () => void;
  duration: number;
  isPaused: boolean;
}> = ({ storyCount, currentStoryIndex, onNext, duration, isPaused }) => {
    return (
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
            {Array.from({ length: storyCount }).map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    {index < currentStoryIndex && <div className="h-full bg-white"></div>}
                    {index === currentStoryIndex && (
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: '0%' }}
                            animate={isPaused ? { width: '0%' } : { width: '100%' }}
                            transition={{ duration: isPaused ? 0 : duration, ease: 'linear' }}
                            onAnimationComplete={onNext}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

const StoryContent: React.FC<{
  storyData: UserStory;
  story: Story;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  showToast: (message: string) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}> = ({ storyData, story, onNext, onPrev, onClose, showToast, isPaused, setIsPaused }) => {
  const [replyText, setReplyText] = useState('');
  const [emojis, setEmojis] = useState<{ id: number; emoji: string }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (story.type === 'video' && video) {
        if (!isPaused) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }
  }, [story, isPaused]);

  const handleReply = () => {
    if (replyText.trim()) {
      showToast('Reply sent!');
      setReplyText('');
    }
  };

  const onEmojiComplete = (id: number) => setEmojis(prev => prev.filter(e => e.id !== id));
  const quickReact = (emoji: string) => setEmojis(prev => [...prev, { id: Date.now(), emoji }]);

  return (
    <div
      className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-2xl flex items-center justify-center"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <FloatingEmojis emojis={emojis} onComplete={onEmojiComplete} />
      <div className="absolute inset-0 bg-cover bg-center blur-2xl scale-110" style={{ backgroundImage: `url(${story.mediaUrl})` }} />
      {story.type === 'video' ? (
        <video ref={videoRef} src={story.mediaUrl} autoPlay loop muted className="w-full h-full object-contain z-10" playsInline />
      ) : (
        <img src={story.mediaUrl} className="w-full h-full object-contain z-10" alt="Story content" />
      )}

      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-20">
        <div className="flex items-center gap-3 mt-3">
          <img src={storyData.user.avatarUrl} alt={storyData.user.displayName} className="w-10 h-10 rounded-full" />
          <span className="text-white font-bold">{storyData.user.displayName}</span>
          <button onClick={onClose} className="ml-auto p-2 text-white"><CloseIcon /></button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2 z-20">
        <input
          type="text"
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          placeholder={`Reply to ${storyData.user.displayName}...`}
          className="w-full bg-black/40 text-white placeholder-white/70 border border-white/40 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white"
          onMouseDown={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()}
        />
        {replyText ? (
          <button onClick={handleReply} className="p-2 text-white"><PaperPlaneIcon /></button>
        ) : (
          ['😂', '😍', '🔥'].map(emoji => (
            <button key={emoji} onClick={() => quickReact(emoji)} className="text-2xl hover:scale-125 transition-transform p-1">
              {emoji}
            </button>
          ))
        )}
      </div>

      <div className="absolute top-0 left-0 w-1/3 h-full z-30" onClick={(e) => { e.stopPropagation(); onPrev(); }} />
      <div className="absolute top-0 right-0 w-2/3 h-full z-30" onClick={(e) => { e.stopPropagation(); onNext(); }} />
    </div>
  );
};

const StoryViewer: React.FC<StoryViewerProps> = ({ stories: storyGroups, initialUserIndex, onClose, showToast, allUsers }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [storyIndices, setStoryIndices] = useState<Record<string, number>>(
    storyGroups.reduce((acc, group) => ({ ...acc, [group.user.id]: 0 }), {})
  );
  const [isPaused, setIsPaused] = useState(false);
  const dragControls = useDragControls();

  const currentGroup = storyGroups[currentUserIndex];
  const currentStoryIndex = storyIndices[currentGroup.user.id] || 0;
  const currentStory = currentGroup.stories[currentStoryIndex];

  const goToUser = useCallback((index: number) => {
    if (index >= 0 && index < storyGroups.length) {
      setCurrentUserIndex(index);
    } else {
      onClose();
    }
  }, [storyGroups.length, onClose]);

  const nextUser = useCallback(() => goToUser(currentUserIndex + 1), [currentUserIndex, goToUser]);
  const prevUser = useCallback(() => goToUser(currentUserIndex - 1), [currentUserIndex, goToUser]);

  const nextStory = useCallback(() => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setStoryIndices(prev => ({ ...prev, [currentGroup.user.id]: prev[currentGroup.user.id] + 1 }));
    } else {
      nextUser();
    }
  }, [currentStoryIndex, currentGroup, nextUser]);

  const prevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setStoryIndices(prev => ({ ...prev, [currentGroup.user.id]: prev[currentGroup.user.id] - 1 }));
    } else {
      prevUser();
    }
  }, [currentStoryIndex, prevUser]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
      onPointerDown={(e) => { e.target === e.currentTarget && onClose(); }}
    >
        {/* Prev User Peek */}
        {currentUserIndex > 0 && (
             <motion.div 
                initial={{ x: -20, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                onClick={prevUser}
                className="absolute left-4 sm:left-10 cursor-pointer p-1 bg-white/10 rounded-full"
            >
                <img src={storyGroups[currentUserIndex - 1].user.avatarUrl} alt="Previous user" className="w-10 h-10 rounded-full opacity-60 hover:opacity-100"/>
            </motion.div>
        )}

      <AnimatePresence custom={currentUserIndex}>
        <motion.div
          key={currentUserIndex}
          drag="x"
          dragControls={dragControls}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) nextUser();
            if (info.offset.x > 50) prevUser();
          }}
          className="absolute w-full max-w-[340px] aspect-[9/16] cursor-grab active:cursor-grabbing"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <StoryProgressBar
            storyCount={currentGroup.stories.length}
            currentStoryIndex={currentStoryIndex}
            onNext={nextStory}
            duration={currentStory.duration}
            isPaused={isPaused}
          />
          <StoryContent
            storyData={currentGroup}
            story={currentStory}
            onNext={nextStory}
            onPrev={prevStory}
            onClose={onClose}
            showToast={showToast}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
          />
        </motion.div>
      </AnimatePresence>

       {/* Next User Peek */}
        {currentUserIndex < storyGroups.length - 1 && (
            <motion.div 
                initial={{ x: 20, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                onClick={nextUser}
                className="absolute right-4 sm:right-10 cursor-pointer p-1 bg-white/10 rounded-full"
            >
                <img src={storyGroups[currentUserIndex + 1].user.avatarUrl} alt="Next user" className="w-10 h-10 rounded-full opacity-60 hover:opacity-100"/>
            </motion.div>
        )}
    </motion.div>
  );
};

export default StoryViewer;
