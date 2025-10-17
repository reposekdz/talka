import React, { useState, useEffect, useRef } from 'react';
import { UserStory, Highlight, Story, User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, PaperPlaneIcon, ShareIcon, MusicNoteIcon } from './Icon';
import FloatingEmojis from './FloatingEmojis';

interface StoryViewerProps {
  stories: UserStory[] | Highlight[];
  initialUserIndex: number;
  onClose: () => void;
  showToast: (message: string) => void;
  isHighlight?: boolean;
  allUsers: User[];
}

const MusicSticker: React.FC<{ music: { artist: string; title: string; } }> = ({ music }) => (
    <motion.div
        drag
        dragMomentum={false}
        className="absolute top-1/2 left-1/2 cursor-grab active:cursor-grabbing bg-black/60 backdrop-blur-sm p-2 rounded-lg flex items-center gap-2 text-white text-sm"
        style={{ x: '-50%', y: '-50%' }}
    >
        <MusicNoteIcon className="w-5 h-5" />
        <div>
            <p className="font-bold leading-tight">{music.title}</p>
            <p className="text-xs opacity-80 leading-tight">{music.artist}</p>
        </div>
    </motion.div>
);

const StoryCard: React.FC<{
    storyData: UserStory | Highlight;
    story: Story;
    isActive: boolean;
    onNextUser: () => void;
    onReply: (text: string) => void;
    onReact: (emoji: string) => void;
    showToast: (message: string) => void;
    isHighlight?: boolean;
}> = ({ storyData, story, isActive, onNextUser, onReply, onReact, showToast, isHighlight }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [replyText, setReplyText] = useState('');
    
    const user = 'user' in storyData ? storyData.user : null;
    const title = 'title' in storyData ? storyData.title : null;

    const quickReplies = ['😂', '😍', '🔥', '👏'];

    useEffect(() => {
        let timer: number;
        if (isPaused || !isActive || !story) return;
        
        timer = window.setTimeout(onNextUser, story.duration * 1000);
        
        return () => {
            clearTimeout(timer);
        };
    }, [story, isPaused, isActive, onNextUser]);

    const handleReply = () => {
        if (replyText.trim()) {
            onReply(replyText);
            setReplyText('');
        }
    }

    if (!story) return null;

    return (
        <div 
            className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-2xl"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            <img src={story.mediaUrl} className="w-full h-full object-cover" />
            
            {story.drawingOverlayUrl && <img src={story.drawingOverlayUrl} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />}
            
            {story.music && <MusicSticker music={story.music} />}

            {story.stickers?.map((sticker, index) => (
                 <motion.img 
                    key={index}
                    src={sticker.url}
                    drag
                    dragMomentum={false}
                    className="absolute w-24 h-24 cursor-grab active:cursor-grabbing"
                    style={{ x: sticker.x, y: sticker.y, scale: sticker.scale, rotate: sticker.rotation }}
                />
            ))}

            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
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
                    {replyText ? (
                        <button onClick={handleReply} className="p-2 text-white"><PaperPlaneIcon/></button>
                    ) : (
                       <div className="flex items-center gap-1">
                            {quickReplies.map(emoji => (
                                <button key={emoji} onClick={() => onReact(emoji)} className="text-2xl hover:scale-125 transition-transform p-1">
                                    {emoji}
                                </button>
                            ))}
                       </div>
                    )}
                </div>
            )}
        </div>
    );
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories: storyGroups, initialUserIndex, onClose, showToast, isHighlight }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndices, setCurrentStoryIndices] = useState<Record<number, number>>({});
  const [emojis, setEmojis] = useState<{ id: number; emoji: string }[]>([]);

  const currentGroup = storyGroups[currentUserIndex];
  const currentStoryIndex = currentStoryIndices[currentUserIndex] || 0;
  const currentStory = currentGroup.stories[currentStoryIndex];

  const paginateUser = (newDirection: number) => {
    const newIndex = currentUserIndex + newDirection;
    if (newIndex >= 0 && newIndex < storyGroups.length) {
      setCurrentUserIndex(newIndex);
    } else if (newIndex >= storyGroups.length) {
        onClose();
    }
  };
  
  const paginateStory = () => {
      if (currentStoryIndex < currentGroup.stories.length - 1) {
          setCurrentStoryIndices(prev => ({ ...prev, [currentUserIndex]: (prev[currentUserIndex] || 0) + 1 }));
      } else {
          paginateUser(1);
      }
  }

  const handleReply = (text: string) => showToast('Your reply was sent!');
  const handleReact = (emoji: string) => setEmojis(prev => [...prev, { id: Date.now(), emoji }]);
  const onEmojiComplete = (id: number) => setEmojis(prev => prev.filter(e => e.id !== id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <FloatingEmojis emojis={emojis} onComplete={onEmojiComplete} />
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-50 font-light hover:scale-110 transition-transform">
        <CloseIcon/>
      </button>

      {/* Progress Bars */}
       <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
            {currentGroup.stories.map((story, index) => (
                <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    {index < currentStoryIndex && <div className="h-full bg-white"></div>}
                    {index === currentStoryIndex && (
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: story.duration, ease: 'linear' }}
                        />
                    )}
                </div>
            ))}
        </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1/4 z-30" onClick={(e) => { e.stopPropagation(); paginateUser(-1);}}></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1/2 w-1/4 z-30" onClick={(e) => { e.stopPropagation(); paginateUser(1);}}></div>

      <div className="w-full h-full flex items-center justify-center perspective-[1000px]">
        <AnimatePresence initial={false}>
            <motion.div
                key={currentUserIndex}
                className="absolute w-[320px] h-[90vh] max-h-[640px]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, zIndex: 1 }}
                exit={{ scale: 0.8, opacity: 0, zIndex: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <StoryCard
                  storyData={currentGroup}
                  story={currentStory}
                  isActive={true}
                  onNextUser={paginateStory}
                  onReply={handleReply}
                  onReact={handleReact}
                  showToast={showToast}
                  isHighlight={isHighlight}
                />
              </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default StoryViewer;
