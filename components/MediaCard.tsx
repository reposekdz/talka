import React from 'react';
import { motion } from 'framer-motion';
import { Tweet } from '../types';
import Avatar from './Avatar';
import { ReplyIcon, RetweetIcon, LikeIcon, ShareIcon } from './Icon';

interface MediaCardProps {
  tweet: Tweet;
  onMediaClick: (tweet: Tweet) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ tweet, onMediaClick }) => {
  const { user, mediaUrls, replyCount, retweetCount, likeCount } = tweet;
  const isVideo = mediaUrls && mediaUrls[0].endsWith('.mp4');

  const actionItems = [
    { icon: <ReplyIcon />, count: replyCount },
    { icon: <RetweetIcon />, count: retweetCount },
    { icon: <LikeIcon />, count: likeCount },
    { icon: <ShareIcon />, count: undefined },
  ];

  return (
    <div 
        className="relative rounded-lg overflow-hidden group cursor-pointer break-inside-avoid mb-3"
        onClick={() => onMediaClick(tweet)}
    >
      {isVideo ? (
        <video src={mediaUrls![0]} loop muted autoPlay playsInline className="w-full h-auto object-cover"/>
      ) : (
        <img src={mediaUrls![0]} alt="Tweet media" className="w-full h-auto object-cover"/>
      )}
      
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent"
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
                <Avatar src={user.avatarUrl} alt={user.displayName} size="small" />
                <span className="font-bold text-sm truncate">{user.displayName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
                {actionItems.slice(1,3).map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                        {item.icon}
                        <span>{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MediaCard;
