
import React, { useRef, useEffect, useState } from 'react';
import { Tweet } from '../types';
import Avatar from './Avatar';
import { HeartFillIcon, LikeIcon, ReplyIcon, ShareIcon, VolumeOffIcon, VolumeUpIcon, MoreIcon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface ReelCardProps {
  reel: Tweet;
  onCommentClick: () => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, onCommentClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likeCount, setLikeCount] = useState(reel.likeCount);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  const lastTap = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          video.play().catch(e => console.error("Autoplay failed", e));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    
    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      observer.unobserve(video);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const triggerHeartAnimation = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleLike = () => {
    setIsLiked(true);
    setLikeCount(prev => reel.isLiked ? prev : prev + 1); // Only increment if it wasn't already liked
    triggerHeartAnimation();
  };
  
  const toggleLike = () => {
    if (isLiked) {
        setIsLiked(false);
        setLikeCount(prev => reel.isLiked ? prev - 1 : prev);
    } else {
        handleLike();
    }
  };

  const handleDoubleTap = () => {
    const now = new Date().getTime();
    if (now - lastTap.current < 300) { // 300ms for double tap
      if (!isLiked) {
        handleLike();
      }
    }
    lastTap.current = now;
  };
  
  const isLongDescription = reel.content.length > 80;

  return (
    <div className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
      <div className="absolute inset-0" onClick={handleDoubleTap}>
        <video
          ref={videoRef}
          src={reel.mediaUrls![0]}
          loop
          muted={isMuted}
          playsInline
          className="h-full w-full object-cover"
        />
      </div>

      <AnimatePresence>
        {showHeart && (
           <motion.div
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
             exit={{ scale: 0.8, opacity: 0 }}
             className="absolute text-white"
             style={{ textShadow: '0px 0px 10px rgba(0,0,0,0.5)' }}
           >
              <HeartFillIcon />
           </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white cursor-pointer z-10" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-black/70 to-transparent text-white z-10">
        <div className="flex items-center gap-3 mb-2">
          <Avatar src={reel.user.avatarUrl} alt={reel.user.displayName} size="small" />
          <span className="font-bold">{reel.user.displayName}</span>
          <span className="text-sm text-white/80">@{reel.user.username}</span>
        </div>
        <p className="text-sm">
            {isLongDescription && !isDescriptionExpanded ? `${reel.content.slice(0, 80)}... ` : reel.content}
            {isLongDescription && (
                <button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} className="font-bold text-white/80">
                    {isDescriptionExpanded ? 'less' : 'more'}
                </button>
            )}
        </p>
      </div>

      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4 text-white z-10">
        <div className="flex flex-col items-center cursor-pointer" onClick={toggleLike}>
          <div className="p-3 bg-black/40 rounded-full">
            {isLiked ? <HeartFillIcon /> : <LikeIcon />}
          </div>
          <span className="text-xs font-bold">{likeCount}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={onCommentClick}>
          <div className="p-3 bg-black/40 rounded-full">
            <ReplyIcon />
          </div>
          <span className="text-xs font-bold">{reel.comments?.length || 0}</span>
        </div>
        <div className="relative">
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}>
            <div className="p-3 bg-black/40 rounded-full">
              <ShareIcon />
            </div>
          </div>
          <AnimatePresence>
          {isShareMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute bottom-0 right-14 w-40 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-sm"
            >
              <button className="w-full text-left p-2 hover:bg-white/10 rounded-md">Copy Link</button>
              <button className="w-full text-left p-2 hover:bg-white/10 rounded-md">Share to...</button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div className="h-full bg-white" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default ReelCard;