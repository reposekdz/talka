
import React from 'react';
import { User } from '../types';
import Avatar from './Avatar';
import { VerifiedIcon } from './Icon';

interface WhoToFollowProps {
  user: User;
}

const WhoToFollow: React.FC<WhoToFollowProps> = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200">
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
      <button className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90">
        Follow
      </button>
    </div>
  );
};

export default WhoToFollow;
