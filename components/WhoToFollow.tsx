import React, { useState } from 'react';
import { User } from '../types';
import AvatarWithStatus from './AvatarWithStatus';
import { VerifiedIcon, MoreIcon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface WhoToFollowProps {
  user: User;
  currentUser: User;
  onFollowToggle: (userId: string) => void;
  onViewProfile: (user: User) => void;
  onRemoveFollower?: (userId: string) => void;
  isFollowerOfCurrentUser?: boolean;
}

const WhoToFollow: React.FC<WhoToFollowProps> = ({ user, currentUser, onFollowToggle, onViewProfile, onRemoveFollower, isFollowerOfCurrentUser }) => {
  const isFollowing = currentUser.followingIds.includes(user.id);
  const [isHovering, setIsHovering] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div onClick={handleUserClick} className="flex items-start justify-between p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200">
      <div className="flex items-center gap-3">
        <AvatarWithStatus user={user} size="medium" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold hover:underline">{user.displayName}</span>
            {user.verified && <VerifiedIcon />}
          </div>
          <span className="text-twitter-gray">@{user.username}</span>
          <p className="text-sm text-light-text dark:text-dim-text mt-1">{user.bio}</p>
        </div>
      </div>
       <div className="flex items-center gap-2">
        {!isFollowerOfCurrentUser && (
            <button
                className={`font-bold px-4 py-1.5 rounded-full transition-colors duration-200 self-center ${followButtonClasses}`}
                onClick={handleFollowClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {followButtonText}
            </button>
        )}
        {isFollowerOfCurrentUser && onRemoveFollower && (
           <div className="relative">
             <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }} className="p-2 hover:bg-white/10 rounded-full">
               <MoreIcon />
             </button>
             <AnimatePresence>
               {isMenuOpen && (
                 <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}>
                   <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="absolute top-10 right-4 bg-light-bg dark:bg-twitter-dark rounded-lg shadow-lg w-48 border border-light-border dark:border-twitter-border z-50"
                   >
                     <button onClick={(e) => { e.stopPropagation(); onRemoveFollower?.(user.id); setIsMenuOpen(false); }} className="w-full text-left p-3 text-red-500 hover:bg-red-500/10">
                       Remove this follower
                     </button>
                   </motion.div>
                 </div>
               )}
             </AnimatePresence>
           </div>
        )}
     </div>
    </div>
  );
};

export default WhoToFollow;