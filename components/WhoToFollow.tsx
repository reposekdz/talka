
import React from 'react';
import { User } from '../types';
import Avatar from './Avatar';
import { VerifiedIcon } from './Icon';

interface WhoToFollowProps {
  user: User;
}

const WhoToFollow: React.FC<WhoToFollowProps> = ({ user }) => {
  return (
    <div className="p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar src={user.avatarUrl} alt={user.displayName} size="small" />
        <div>
          <div className="flex items-center">
            <p className="font-bold hover:underline">{user.displayName}</p>
            {user.verified && <VerifiedIcon />}
          </div>
          <p className="text-sm text-twitter-gray">@{user.username}</p>
        </div>
      </div>
      <button className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90">
        Follow
      </button>
    </div>
  );
};

export default WhoToFollow;
