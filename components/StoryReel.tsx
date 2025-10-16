
import React from 'react';
import { UserStory, User } from '../types';
import { PlusIcon } from './Icon';

interface StoryReelProps {
  userStories: UserStory[];
  currentUser: User;
  onStoryClick: (userIndex: number) => void;
  onOpenCreator: () => void;
}

const CreateStoryCard: React.FC<{ user: User, onOpenCreator: () => void }> = ({ user, onOpenCreator }) => (
    <div className="flex-shrink-0 w-28 h-48 flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 cursor-pointer group" onClick={onOpenCreator}>
            <img 
                src={user.avatarUrl} 
                alt="Your Story"
                className="w-full h-full rounded-full object-cover transition-all duration-300 group-hover:brightness-90"
            />
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-twitter-blue rounded-full flex items-center justify-center text-white border-4 border-light-bg dark:border-twitter-dark dim:border-dim-bg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90">
                <PlusIcon />
            </div>
        </div>
        <p className="mt-2 text-sm font-semibold">Your Story</p>
    </div>
);

const UserStoryItem: React.FC<{
    userStory: UserStory;
    onClick: () => void;
    isCurrentUser?: boolean;
}> = ({ userStory, onClick, isCurrentUser = false }) => (
     <div
        className="flex-shrink-0"
        onClick={onClick}
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
            {!isCurrentUser && (
                 <img
                    src={userStory.user.avatarUrl}
                    alt={userStory.user.displayName}
                    className={`absolute top-3 left-3 w-10 h-10 rounded-full object-cover border-2 border-twitter-blue`}
                />
            )}
            <p className="absolute bottom-2 left-0 right-0 p-2 text-white text-sm font-bold truncate drop-shadow-lg">
                {isCurrentUser ? 'Your Story' : userStory.user.displayName}
            </p>
        </div>
    </div>
);


const StoryReel: React.FC<StoryReelProps> = ({ userStories, currentUser, onStoryClick, onOpenCreator }) => {
  const currentUserStory = userStories.find(us => us.user.id === currentUser.id);

  return (
    <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
      <div className="flex space-x-3 overflow-x-auto pb-2 -mb-2 no-scrollbar">
        {currentUserStory ? (
            <UserStoryItem 
                userStory={currentUserStory}
                onClick={() => onStoryClick(userStories.findIndex(us => us.user.id === currentUser.id))}
                isCurrentUser={true}
            />
        ) : (
            <CreateStoryCard user={currentUser} onOpenCreator={onOpenCreator} />
        )}

        {userStories
            .filter(us => us.user.id !== currentUser.id)
            .map((userStory) => (
              <UserStoryItem
                key={userStory.user.id}
                userStory={userStory}
                onClick={() => onStoryClick(userStories.findIndex(us => us.user.id === userStory.user.id))}
              />
        ))}
      </div>
    </div>
  );
};

export default StoryReel;
