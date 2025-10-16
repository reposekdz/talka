import React from 'react';
import { UserStory } from '../types';

interface StoryReelProps {
  userStories: UserStory[];
  onStoryClick: (userIndex: number) => void;
}

const StoryReel: React.FC<StoryReelProps> = ({ userStories, onStoryClick }) => {
  return (
    <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
      <div className="flex space-x-3 overflow-x-auto pb-2 -mb-2">
        {userStories.map((userStory, index) => (
          <div
            key={userStory.user.id}
            className="flex-shrink-0"
            onClick={() => onStoryClick(index)}
          >
            <div className="relative w-28 h-48 rounded-xl overflow-hidden cursor-pointer group transition-transform duration-300 ease-in-out hover:scale-105">
                <div 
                  className={`absolute inset-0 rounded-xl ring-2 ${userStory.hasUnseen ? 'ring-pink-500' : 'ring-transparent'} ring-offset-2 ring-offset-light-bg dark:ring-offset-twitter-dark dim:ring-offset-dim-bg`}
                  style={{ zIndex: 1 }}
                ></div>
                <img
                    src={userStory.stories[0].mediaUrl}
                    alt={`${userStory.user.displayName}'s story`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <img
                    src={userStory.user.avatarUrl}
                    alt={userStory.user.displayName}
                    className={`absolute top-3 left-3 w-10 h-10 rounded-full object-cover border-2 border-twitter-blue`}
                />
                <p className="absolute bottom-2 left-0 right-0 p-2 text-white text-sm font-bold truncate drop-shadow-lg">
                    {userStory.user.displayName}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryReel;