import React from 'react';
import { UserStory, User } from '../types';
import { mockUser } from '../data/mockData';
import { PlusIcon } from './Icon';

interface StoryReelProps {
  userStories: UserStory[];
  onStoryClick: (userIndex: number) => void;
}

const CreateStoryCard: React.FC<{ user: User }> = ({ user }) => (
    <div className="flex-shrink-0" onClick={() => { /* Placeholder for create story action */ }}>
        <div className="relative w-28 h-48 rounded-xl overflow-hidden cursor-pointer group transition-transform duration-300 ease-in-out hover:scale-105 bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover">
            <img 
                src={user.avatarUrl} 
                alt="Create a story"
                className="w-full h-2/3 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg flex flex-col items-center justify-end pb-3">
                 <p className="text-sm font-bold">Create Story</p>
            </div>
             <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-twitter-blue rounded-full flex items-center justify-center text-white border-4 border-light-bg dark:border-twitter-dark dim:border-dim-bg">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </div>
        </div>
    </div>
);


const StoryReel: React.FC<StoryReelProps> = ({ userStories, onStoryClick }) => {
  return (
    <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
      <div className="flex space-x-3 overflow-x-auto pb-2 -mb-2 no-scrollbar">
        <CreateStoryCard user={mockUser} />
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