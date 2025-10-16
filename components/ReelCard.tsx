import React, { useState, useRef } from 'react';
import { Reel } from '../types';
import Avatar from './Avatar';
import { HeartFillIcon, LikeIcon, MessagesIcon, ShareIcon, MoreIcon, PlayIcon, PauseIcon } from './Icon';
import ReelCommentsPanel from './ReelCommentsPanel';

interface ReelCardProps {
  reel: Reel;
  onOpenComments: (reel: Reel) => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, onOpenComments }) => {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likeCount, setLikeCount] = useState(reel.likeCount);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
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
        ref={videoRef}
        src={reel.videoUrl}
        loop
        autoPlay
        playsInline
        muted
        onClick={handleVideoClick}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 cursor-pointer"
        onClick={handleVideoClick}
      >
        {!isPlaying && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 bg-black/50 rounded-full p-4">
                <PlayIcon />
            </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-center gap-2">
          <Avatar src={reel.user.avatarUrl} alt={reel.user.displayName} size="small" />
          <span className="font-bold text-white">{reel.user.displayName}</span>
          <button className="border border-white text-white px-3 py-1 text-sm rounded-md ml-2 font-semibold">Follow</button>
        </div>
        <p className="mt-2 text-sm text-white truncate">{reel.caption}</p>
        <div className="absolute bottom-0 left-4 right-4 h-1 bg-white/20 rounded-full">
            <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>


      <div className="absolute bottom-4 right-4 flex flex-col items-center gap-4 text-white z-10">
        <button onClick={handleLike} className="flex flex-col items-center">
            {isLiked ? <HeartFillIcon /> : <LikeIcon />}
            <span className="text-sm font-bold">{likeCount.toLocaleString()}</span>
        </button>
        <button onClick={() => onOpenComments(reel)} className="flex flex-col items-center">
            <MessagesIcon />
            <span className="text-sm font-bold">{reel.commentCount.toLocaleString()}</span>
        </button>
        <button className="flex flex-col items-center">
            <ShareIcon />
            <span className="text-sm font-bold">{reel.shareCount.toLocaleString()}</span>
        </button>
        <button>
            <MoreIcon />
        </button>
      </div>
    </div>
  );
};

export default ReelCard;