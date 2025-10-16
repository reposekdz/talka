import React, { useState, useRef } from 'react';
import { Reel } from '../types';
import Avatar from './Avatar';
import { HeartFillIcon, LikeIcon, MessagesIcon, ShareIcon, MoreIcon, PlayIcon, PauseIcon, MusicNoteIcon, BookmarkIcon, BookmarkFillIcon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface ReelCardProps {
  reel: Reel;
  onOpenComments: (reel: Reel) => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, onOpenComments }) => {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likeCount, setLikeCount] = useState(reel.likeCount);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const lastClickTime = useRef(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };
  
  const handleBookmark = () => {
    setIsBookmarked(prev => !prev);
  };

  const triggerLikeAnimation = () => {
    if (!isLiked) {
        handleLike();
    }
    setShowLikeAnimation(true);
    setTimeout(() => setShowLikeAnimation(false), 800);
  };

  const handleVideoClick = () => {
    const now = new Date().getTime();
    if (now - lastClickTime.current < 300) { // Double click/tap
      triggerLikeAnimation();
    } else { // Single click/tap
      if (videoRef.current && backgroundVideoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
            backgroundVideoRef.current.pause();
        } else {
            videoRef.current.play();
            backgroundVideoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
    lastClickTime.current = now;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  return (
    <div className="relative w-full max-w-[400px] h-[85vh] rounded-2xl overflow-hidden bg-black">
      <video
        ref={backgroundVideoRef}
        src={reel.videoUrl}
        loop
        autoPlay
        playsInline
        muted
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover scale-150 blur-2xl opacity-50"
      />
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        autoPlay
        playsInline
        muted
        onTimeUpdate={handleTimeUpdate}
        className="relative z-10 w-full h-full object-contain"
      />

      <AnimatePresence>
        {showLikeAnimation && (
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            >
                <HeartFillIcon className="w-24 h-24 text-red-500 drop-shadow-lg" />
            </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="absolute inset-0 cursor-pointer z-20"
        onClick={handleVideoClick}
      >
        {!isPlaying && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 bg-black/50 rounded-full p-4">
                <PlayIcon />
            </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <Avatar src={reel.user.avatarUrl} alt={reel.user.displayName} size="small" />
          <span className="font-bold text-white">{reel.user.displayName}</span>
          <button className="border border-white text-white px-3 py-1 text-sm rounded-md ml-2 font-semibold pointer-events-auto">Follow</button>
        </div>
        <p className="mt-2 text-sm text-white truncate">{reel.caption}</p>
        <div className="flex items-center gap-2 mt-2 text-white text-sm">
            <MusicNoteIcon />
            <div className="w-1/2 overflow-hidden">
                <motion.p 
                    className="whitespace-nowrap"
                    animate={{ x: ['0%', '-100%'] }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                >
                    Original Audio - {reel.user.displayName} &middot; Trending Sound&nbsp;&nbsp;&nbsp;&nbsp;
                </motion.p>
            </div>
        </div>
      </div>

      <div className="absolute bottom-16 sm:bottom-4 right-4 flex flex-col items-center gap-4 text-white z-30">
        <button onClick={handleLike} className="flex flex-col items-center">
            {isLiked ? <HeartFillIcon /> : <LikeIcon />}
            <span className="text-sm font-bold">{likeCount.toLocaleString()}</span>
        </button>
        <button onClick={() => onOpenComments(reel)} className="flex flex-col items-center">
            <MessagesIcon />
            <span className="text-sm font-bold">{reel.commentCount.toLocaleString()}</span>
        </button>
        <button onClick={handleBookmark} className="flex flex-col items-center">
            {isBookmarked ? <BookmarkFillIcon /> : <BookmarkIcon />}
            <span className="text-sm font-bold">Save</span>
        </button>
        <button className="flex flex-col items-center">
            <ShareIcon />
            <span className="text-sm font-bold">{reel.shareCount.toLocaleString()}</span>
        </button>
        <button>
            <MoreIcon />
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div className="h-full bg-white" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ReelCard;