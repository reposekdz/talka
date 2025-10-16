import React, { useState } from 'react';
import { User } from '../types';
import Avatar from './Avatar';
import { VerifiedIcon } from './Icon';

interface WhoToFollowProps {
  user: User;
  currentUser: User;
  onFollowToggle: (userId: string) => void;
  onViewProfile: (user: User) => void;
}

const WhoToFollow: React.FC<WhoToFollowProps> = ({ user, currentUser, onFollowToggle, onViewProfile }) => {
  const isFollowing = currentUser.followingIds.includes(user.id);
  const [isHovering, setIsHovering] = useState(false);

  const handleFollowClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onFollowToggle(user.id);
  };
  
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewProfile(user);
  };

  const followButtonText = isFollowing ? (isHovering ? 'Unfollow' : 'Following') : 'Follow';
  const followButtonClasses = isFollowing
    ? 'bg-transparent text-white border border-white hover:bg-red-500/20 hover:text-red-500 hover:border-red-500'
    : 'bg-white text-black hover:bg-opacity-90';

  if (user.id === currentUser.id) return null;

  return (
    <div onClick={handleUserClick} className="flex items-center justify-between p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200">
      <div className="flex items-center gap-3">
        <Avatar src={user.avatarUrl} alt={user.displayName} />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold hover:underline">{user.displayName}</span>
            {user.verified && <VerifiedIcon />}
          </div>
          <span className="text-twitter-gray">@{user.username}</span>
        </div>
      </div>
      <button 
        className={`font-bold px-4 py-1.5 rounded-full transition-colors duration-200 ${followButtonClasses}`}
        onClick={handleFollowClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {followButtonText}
      </button>
    </div>
  );
};

export default WhoToFollow;