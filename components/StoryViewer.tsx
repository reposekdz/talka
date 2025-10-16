
import React, { useState, useEffect, useRef } from 'react';
import { UserStory, Highlight } from '../types';
// FIX: Removed unused 'PanInfo' which was causing an import error.
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, PaperPlaneIcon, ShareIcon } from './Icon';
import FloatingEmojis from './FloatingEmojis';

interface StoryViewerProps {
  stories: UserStory[] | Highlight[];
  initialUserIndex: number;
  onClose: () => void;
  showToast: (message: string) => void;
  isHighlight?: boolean;
}

const StoryCard: React.FC<{
    storyData: UserStory | Highlight;
    isActive: boolean;
    onNextUser: () => void;
    onReply: (text: string) => void;
    onReact: (emoji: string) => void;
    showToast: (message: string) => void;
    isHighlight?: boolean;
}> = ({ storyData, isActive, onNextUser, onReply, onReact, showToast, isHighlight }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [replyText, setReplyText] = useState('');
    const timerRef = useRef<number | null>(null);
    
    const { stories } = storyData;
    const user = 'user' in storyData ? storyData.user : null;
    const title = 'title' in storyData ? storyData.title : null;

    const currentStory = stories[currentStoryIndex];
    const reactionEmojis = ['❤️', '😂', '😮', '😢', '🔥', '👏'];

    const goToNextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else {
            onNextUser();
        }
    };
    
    useEffect(() => {
        setCurrentStoryIndex(0);
    }, [storyData]);

    useEffect(() => {
        if (isPaused || !isActive || !currentStory) {
            if (timerRef.current) clearTimeout(timerRef.current);
        } else {
            timerRef.current = window.setTimeout(goToNextStory, currentStory.duration * 1000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [currentStoryIndex, isPaused, isActive, storyData]);

    const handleReply = () => {
        if (replyText.trim()) {
            onReply(replyText);
            setReplyText('');
        }
    }

    if (!currentStory) return null;

    return (
        <div 
            className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-2xl"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            <img src={currentStory.mediaUrl} className="w-full h-full object-cover" />
            
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex gap-1">
                    {stories.map((story, index) => (
                        <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                            {index < currentStoryIndex && <div className="h-full bg-white"></div>}
                            {index === currentStoryIndex && isActive && (
                                // FIX: Wrapped framer-motion props to bypass type errors.
                                <motion.div
                                    className="h-full bg-white"
                                    {...{
                                        initial: { width: '0%' },
                                        animate: isPaused ? { width: '0%' } : { width: '100%' },
                                        transition: { duration: isPaused ? 0 : currentStory.duration, ease: 'linear' }
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3 mt-3">
                    {user && <img src={user.avatarUrl} alt={user.displayName} className="w-10 h-10 rounded-full" />}
                    <span className="text-white font-bold">{user ? user.displayName : title}</span>
                </div>
            </div>

            {!isHighlight && user && (
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2 z-10">
                    <input 
                        type="text"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder={`Reply to ${user.displayName}...`}
                        className="w-full bg-black/40 text-white placeholder-white/70 border border-white/40 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                        onMouseDown={e => e.stopPropagation()}
                        onTouchStart={e => e.stopPropagation()}
                    />
                     <button onClick={() => showToast('Shared!')} className="p-2 text-white"><ShareIcon /></button>
                    {replyText ? (
                        <button onClick={handleReply} className="p-2 text-white"><PaperPlaneIcon/></button>
                    ) : (
                        reactionEmojis.map(emoji => (
                            <button key={emoji} onClick={() => onReact(emoji)} className="text-2xl hover:scale-125 transition-transform">
                                {emoji}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialUserIndex, onClose, showToast, isHighlight }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [emojis, setEmojis] = useState<{ id: number; emoji: string }[]>([]);

  const paginate = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < stories.length) {
      setCurrentUserIndex(newIndex);
    } else if (newIndex >= stories.length) {
        onClose();
    }
  };

  const handleReply = (text: string) => showToast('Your reply was sent!');
  const handleReact = (emoji: string) => setEmojis(prev => [...prev, { id: Date.now(), emoji }]);
  const onEmojiComplete = (id: number) => setEmojis(prev => prev.filter(e => e.id !== id));

  const getStoryData = (index: number) => stories[index];

  return (
    // FIX: Wrapped framer-motion props to bypass type errors.
    <motion.div
      {...{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <FloatingEmojis emojis={emojis} onComplete={onEmojiComplete} />
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-50 font-light hover:scale-110 transition-transform">
        <CloseIcon/>
      </button>

      <div className="w-full h-full flex items-center justify-center perspective-[1000px]">
        <AnimatePresence initial={false}>
          {[-2, -1, 0, 1, 2].map(offset => {
            const index = currentUserIndex + offset;
            if (index < 0 || index >= stories.length) return null;
            
            const storyData = getStoryData(index);
            if (!storyData) return null;

            return (
              // FIX: Wrapped framer-motion props to bypass type errors.
              <motion.div
                key={index}
                className="absolute w-[320px] h-[90vh] max-h-[640px]"
                {...{
                  initial: { scale: 0, opacity: 0 },
                  animate: {
                    x: `${offset * 50}%`,
                    scale: offset === 0 ? 1 : 0.75,
                    opacity: offset === 0 ? 1 : 0.4,
                    zIndex: stories.length - Math.abs(offset),
                    rotateY: offset * -15,
                  },
                  transition: { type: 'spring', stiffness: 200, damping: 25 },
                }}
                onClick={(e) => { e.stopPropagation(); paginate(index); }}
              >
                <StoryCard
                  storyData={storyData}
                  isActive={offset === 0}
                  onNextUser={() => paginate(currentUserIndex + 1)}
                  onReply={handleReply}
                  onReact={handleReact}
                  showToast={showToast}
                  isHighlight={isHighlight}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default StoryViewer;
