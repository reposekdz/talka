
import React, { useRef, useEffect, useState } from 'react';
import { Tweet } from '../types';
import Avatar from './Avatar';
import { HeartFillIcon, LikeIcon, ReplyIcon, ShareIcon, VolumeOffIcon, VolumeUpIcon } from './Icon';

interface ReelCardProps {
  reel: Tweet;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(reel.isLiked);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 } // Play when 50% of the video is visible
    );

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);

  const toggleLike = () => setIsLiked(!isLiked);

  return (
    <div className="h-screen w-full snap-start relative flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={reel.mediaUrls![0]}
        loop
        muted={isMuted}
        playsInline
        className="h-full w-full object-cover"
        onClick={() => setIsMuted(!isMuted)}
      />
      
      {/* Mute/Unmute Icon */}
      <div className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white cursor-pointer" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </div>

      {/* Bottom Gradient & Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-black/70 to-transparent text-white">
        <div className="flex items-center gap-3 mb-2">
          <Avatar src={reel.user.avatarUrl} alt={reel.user.displayName} size="small" />
          <span className="font-bold">{reel.user.displayName}</span>
          <span className="text-sm text-white/80">@{reel.user.username}</span>
        </div>
        <p className="text-sm">{reel.content}</p>
      </div>

      {/* Side Action Buttons */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4 text-white">
        <div className="flex flex-col items-center cursor-pointer" onClick={toggleLike}>
          <div className="p-3 bg-black/40 rounded-full">
            {isLiked ? <HeartFillIcon /> : <LikeIcon />}
          </div>
          <span className="text-xs font-bold">{reel.likeCount + (isLiked ? 1 : 0)}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <div className="p-3 bg-black/40 rounded-full">
            <ReplyIcon />
          </div>
          <span className="text-xs font-bold">{reel.replyCount}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          <div className="p-3 bg-black/40 rounded-full">
            <ShareIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCard;