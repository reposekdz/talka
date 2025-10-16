
import React, { useState } from 'react';
import { User } from '../types';
import Avatar from './Avatar';
import { VerifiedIcon } from './Icon';
import { motion } from 'framer-motion';

interface WhoToFollowProps {
  user: User;
}

const WhoToFollow: React.FC<WhoToFollowProps> = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const buttonText = isFollowing ? (isHovered ? 'Unfollow' : 'Following') : 'Follow';
  
  const buttonClasses = isFollowing
    ? `font-bold px-4 py-1.5 rounded-full transition-colors duration-200 ${isHovered ? 'bg-red-500/10 text-red-500 border border-red-500/50' : 'bg-transparent border border-light-border dark:border-twitter-border'}`
    : 'bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90';

  return (
    <div className="p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200 flex items-center justify-between">
      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar src={user.avatarUrl} alt={user.displayName} size="small" />
        <div className="overflow-hidden">
          <div className="flex items-center">
            <p className="font-bold hover:underline truncate">{user.displayName}</p>
            {user.verified && <VerifiedIcon />}
          </div>
          <p className="text-sm text-twitter-gray truncate">@{user.username}</p>
        </div>
      </div>
      <motion.button 
        className={buttonClasses}
        onClick={() => setIsFollowing(!isFollowing)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.95 }}
      >
        {buttonText}
      </motion.button>
    </div>
  );
};

export default WhoToFollow;