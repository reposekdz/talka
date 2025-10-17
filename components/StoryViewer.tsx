

import React, { useState, useEffect, useRef } from 'react';
import { UserStory, Highlight, Story, User } from '../types';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { CloseIcon, PaperPlaneIcon, MoreIcon } from './Icon';
import FloatingEmojis from './FloatingEmojis';

interface StoryViewerProps {
  stories: UserStory[];
  initialUserIndex: number;
  onClose: () => void;
  showToast: (message: string) => void;
  allUsers: User[];
}

const StoryProgress: React.FC<{
  storyCount: number;
  currentStoryIndex: number;
  story: Story;
  isPaused: boolean;
}> = ({ storyCount, currentStoryIndex, story, isPaused }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
      {Array.from({ length: storyCount }).map((_, index) => (
        <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
          {index < currentStoryIndex && <div className="h-full bg-white"></div>}
          {index === currentStoryIndex && (
            <AnimatePresence>
              <motion.div
                className="h-full bg-white"
                initial={{ width: '0%' }}
                animate={{ width: isPaused ? '0%' : '100%' }}
                transition={{ duration: isPaused ? 0 : story.duration, ease: 'linear' }}
              />
            </AnimatePresence>
          )}
        </div>
      ))}
    </div>
  );
};

const StoryContent: React.FC<{
  storyData: UserStory;
  story: Story;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  onNextUser: () => void;
  onClose: () => void;
  showToast: (message: string) => void;
}> = ({ storyData, story, isActive, onNext, onPrev, onNextUser, onClose, showToast }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [emojis, setEmojis] = useState<{ id: number; emoji: string }[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timer: number;
    if (isPaused || !isActive || !story) return;
    timer = window.setTimeout(onNext, story.duration * 1000);
    return () => clearTimeout(timer);
  }, [story, isPaused, isActive, onNext]);

  useEffect(() => {
    const video = videoRef.current;
    if (story.type === 'video' && video) {
        if (isActive) {
            video.currentTime = 0;
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }
  }, [story, isActive]);

  const handleReply = () => {
    if (replyText.trim()) {
      showToast('Reply sent!');
      setReplyText('');
    }
  };

  const onEmojiComplete = (id: number) => setEmojis(prev => prev.filter(e => e.id !== id));
  const quickReact = (emoji: string) => setEmojis(prev => [...prev, { id: Date.now(), emoji }]);

  if (!story) return null;

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
        <video ref={videoRef} src={story.mediaUrl} loop muted={!isActive} className="w-full h-full object-contain z-10" playsInline />
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

const StoryViewer: React.FC<StoryViewerProps> = ({ stories: storyGroups, initialUserIndex, onClose, showToast }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [storyIndices, setStoryIndices] = useState<Record<string, number>>(
    storyGroups.reduce((acc, group) => ({ ...acc, [group.user.id]: 0 }), {})
  );

  const currentGroup = storyGroups[currentUserIndex];
  const currentStoryIndex = storyIndices[currentGroup.user.id] || 0;
  const currentStory = currentGroup.stories[currentStoryIndex];

  const goToUser = (index: number) => {
    if (index >= 0 && index < storyGroups.length) {
      setCurrentUserIndex(index);
    } else {
      onClose();
    }
  };

  const nextUser = () => goToUser(currentUserIndex + 1);
  const prevUser = () => goToUser(currentUserIndex - 1);

  const nextStory = () => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setStoryIndices(prev => ({ ...prev, [currentGroup.user.id]: prev[currentGroup.user.id] + 1 }));
    } else {
      nextUser();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setStoryIndices(prev => ({ ...prev, [currentGroup.user.id]: prev[currentGroup.user.id] - 1 }));
    } else {
      prevUser();
    }
  };

  const dragControls = useDragControls();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
      onPointerDown={(e) => { e.target === e.currentTarget && onClose(); }}
    >
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
          <StoryProgress
            storyCount={currentGroup.stories.length}
            currentStoryIndex={currentStoryIndex}
            story={currentStory}
            isPaused={false}
          />
          <StoryContent
            storyData={currentGroup}
            story={currentStory}
            isActive={true}
            onNext={nextStory}
            onPrev={prevStory}
            onNextUser={nextUser}
            onClose={onClose}
            showToast={showToast}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default StoryViewer;