import React from 'react';
import { User } from '../types';
import Avatar from './Avatar';

interface AvatarWithStatusProps {
  user: User;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}

const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({ user, size = 'medium' }) => {
  
  const statusClasses = {
    small: 'w-3 h-3 right-0 bottom-0',
    medium: 'w-3.5 h-3.5 right-0 bottom-0',
    large: 'w-4 h-4 right-1 bottom-1',
    xlarge: 'w-5 h-5 right-2 bottom-2',
  }

  return (
    <div className="relative flex-shrink-0">
        <Avatar src={user.avatarUrl} alt={user.displayName} size={size} />
        {user.isOnline && (
            <div 
              className={`absolute rounded-full bg-green-500 border-2 border-light-bg dark:border-twitter-dark dim:border-dim-bg ${statusClasses[size]}`}
            />
        )}
    </div>
  );
};

export default AvatarWithStatus;