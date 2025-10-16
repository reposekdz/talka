import React, { useState, useRef } from 'react';
import { Reel, User } from '../types';
import Avatar from './Avatar';
import { HeartFillIcon, LikeIcon, MessagesIcon, ShareIcon, MoreIcon, PlayIcon, MusicNoteIcon, BookmarkIcon, BookmarkFillIcon, DislikeIcon, DislikeFillIcon, VolumeUpIcon, VolumeOffIcon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface ReelCardProps {
  reel: Reel;
  currentUser: User;
  onOpenComments: (reel: Reel) => void;
  onLike: (reelId: string) => void;
  onDislike: (reelId: string) => void;
  onBookmark: (reelId: string) => void;
  onShare: (reel: Reel) => void;
  onFollowToggle: (userId: string) => void;
  onOpenOptions: (reel: Reel) => void;
}

const ReelCard: React.FC<ReelCardProps> = (props) => {
  const { reel, currentUser, onOpenComments, onLike, onDislike, onBookmark, onShare, onFollowToggle, onOpenOptions } = props;
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const lastClickTime = useRef(0);
  const longPressTimeout = useRef<number | null>(null);

  const handleLike = () => {
    onLike(reel.id);
  };
  
  const handleDislike = () => {
    onDislike(reel.id);
  };

  const handleBookmark = () => {
    onBookmark(reel.id);
  };
  
  const handleShare = () => {
    onShare(reel);
  };
  
  const isFollowingCreator = currentUser.followingIds.includes(reel.user.id);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFollowToggle(reel.user.id);
  };

  const triggerLikeAnimation = () => {
    if (!reel.isLiked) {
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
  
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handlePointerDown = () => {
    longPressTimeout.current = window.setTimeout(() => {
        onOpenOptions(reel);
    }, 500); // 500ms for long press
  };

  const handlePointerUp = () => {
    if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
    }
  };


  return (
    <div className="relative w-full max-w-[420px] h-full bg-black select-none">
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
        muted={isMuted}
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
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <AnimatePresence>
            {!isPlaying && (
                <motion.div 
                    initial={{opacity: 0, scale: 1.5}} 
                    animate={{opacity: 1, scale: 1}} 
                    exit={{opacity: 0, scale: 1.5}}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 bg-black/50 rounded-full p-4"
                >
                    <PlayIcon />
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div className="absolute top-16 sm:top-4 right-4 z-30">
          <button onClick={handleToggleMute} className="p-2 bg-black/40 rounded-full text-white pointer-events-auto">
              {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 z-30 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <Avatar src={reel.user.avatarUrl} alt={reel.user.displayName} size="small" />
          <span className="font-bold text-white">@{reel.user.username}</span>
          {currentUser.id !== reel.user.id && (
            <button
              onClick={handleFollow}
              className={`border pointer-events-auto px-3 py-1 text-sm rounded-md ml-2 font-semibold hover:bg-opacity-80 transition-colors ${
                isFollowingCreator
                  ? 'bg-transparent border-white/50 text-white/80'
                  : 'bg-white border-white text-black'
              }`}
            >
              {isFollowingCreator ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-white">{reel.caption}</p>
        <div className="flex items-center gap-2 mt-2 text-white text-sm">
            <MusicNoteIcon />
            <div className="w-full overflow-hidden">
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

      <div className="absolute bottom-28 sm:bottom-24 right-2 flex flex-col items-center gap-5 text-white z-30">
        <button onClick={handleLike} className="flex flex-col items-center pointer-events-auto">
            {reel.isLiked ? <HeartFillIcon className="w-8 h-8"/> : <LikeIcon className="w-8 h-8"/>}
            <span className="text-xs font-bold">{reel.likeCount.toLocaleString()}</span>
        </button>
        <button onClick={handleDislike} className="flex flex-col items-center pointer-events-auto">
            {reel.isDisliked ? <DislikeFillIcon className="w-8 h-8"/> : <DislikeIcon className="w-8 h-8"/>}
            <span className="text-xs font-bold">Dislike</span>
        </button>
        <button onClick={() => onOpenComments(reel)} className="flex flex-col items-center pointer-events-auto">
            <MessagesIcon className="w-8 h-8"/>
            <span className="text-xs font-bold">{reel.commentCount.toLocaleString()}</span>
        </button>
        <button onClick={handleBookmark} className="flex flex-col items-center pointer-events-auto">
            {reel.isBookmarked ? <BookmarkFillIcon className="w-8 h-8"/> : <BookmarkIcon className="w-8 h-8"/>}
            <span className="text-xs font-bold">Save</span>
        </button>
         <button onClick={handleShare} className="flex flex-col items-center pointer-events-auto">
            <ShareIcon className="w-8 h-8"/>
            <span className="text-xs font-bold">{reel.shareCount.toLocaleString()}</span>
        </button>
        <button className="pointer-events-auto">
            <img src={reel.user.avatarUrl} alt="user avatar" className="w-8 h-8 rounded-full border-2 border-white"/>
        </button>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30 pointer-events-none">
        <div className="h-full bg-white" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default ReelCard;