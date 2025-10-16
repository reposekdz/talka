
import React, { useState } from 'react';
import { Reel } from '../types';
import Avatar from './Avatar';
import { HeartFillIcon, LikeIcon, MessagesIcon, ShareIcon, MoreIcon } from './Icon';
import ReelComments from './ReelComments';

interface ReelCardProps {
  reel: Reel;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likeCount, setLikeCount] = useState(reel.likeCount);
  const [areCommentsOpen, setAreCommentsOpen] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="relative w-full max-w-[400px] h-[85vh] rounded-2xl overflow-hidden">
      <video
        src={reel.videoUrl}
        loop
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      
      <div className="absolute bottom-4 left-4 text-white z-10 w-4/5">
        <div className="flex items-center gap-2">
          <Avatar src={reel.user.avatarUrl} alt={reel.user.displayName} size="small" />
          <span className="font-bold">{reel.user.displayName}</span>
          <button className="border border-white text-white px-3 py-1 text-sm rounded-md ml-2">Follow</button>
        </div>
        <p className="mt-2 text-sm truncate">{reel.caption}</p>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col items-center gap-4 text-white z-10">
        <button onClick={handleLike} className="flex flex-col items-center">
            {isLiked ? <HeartFillIcon /> : <LikeIcon />}
            <span className="text-sm font-bold">{likeCount.toLocaleString()}</span>
        </button>
        <button onClick={() => setAreCommentsOpen(true)} className="flex flex-col items-center">
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
      
      {areCommentsOpen && <ReelComments onClose={() => setAreCommentsOpen(false)} />}
    </div>
  );
};

export default ReelCard;
