
import React, { useState } from 'react';
import { Tweet, User, UserStory, Space } from '../types';
import Composer from '../components/Composer';
import TweetCard from '../components/TweetCard';
import StoryReel from '../components/StoryReel';
import LiveCard from '../components/LiveCard';
import SpacesCard from '../components/SpacesCard';
import TweetSkeleton from '../components/TweetSkeleton';

interface HomePageProps {
  tweets: Tweet[];
  currentUser: User;
  onPostTweet: (tweet: Partial<Tweet>) => void;
  onImageClick: (url: string) => void;
  onViewProfile: (user: User) => void;
  onReply: (tweet: Tweet) => void;
  onToggleBookmark: (tweetId: string) => void;
  onVote: (tweetId: string, optionId: string) => void;
  onQuote: (tweet: Tweet) => void;
  onEdit: (tweet: Tweet) => void;
  userStories: UserStory[];
  onStoryClick: (userIndex: number) => void;
  onOpenCreator: () => void;
  onJoinSpace: (space: Space) => void;
  onGrok: (tweet: Tweet) => void;
  onTranslateTweet: (tweetId: string) => void;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  const { tweets, currentUser, onPostTweet, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onQuote, onEdit, userStories, onStoryClick, onOpenCreator, onJoinSpace, onGrok, onTranslateTweet } = props;
  const [activeTab, setActiveTab] = useState('For you');
  const [isLoading] = useState(false);

  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold p-4 hidden sm:block">Home</h1>
        <div className="flex">
          {['For you', 'Following'].map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} className="flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative">
              <span className={activeTab === tab ? 'text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>
                {tab}
              </span>
              {activeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-twitter-blue rounded-full"></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="hidden sm:block">
        <Composer onPostTweet={onPostTweet} />
      </div>

      <StoryReel userStories={userStories} currentUser={currentUser} onStoryClick={onStoryClick} onOpenCreator={onOpenCreator} />
      
      <LiveCard />
      <SpacesCard onJoinSpace={onJoinSpace} />

      <div>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <TweetSkeleton key={i} />)
        ) : (
          tweets.map(tweet => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              currentUser={currentUser}
              onImageClick={onImageClick}
              onViewProfile={onViewProfile}
              onReply={onReply}
              onToggleBookmark={onToggleBookmark}
              onVote={onVote}
              onQuote={onQuote}
              onEdit={onEdit}
              onGrok={onGrok}
              onTranslateTweet={onTranslateTweet}
              liveReactions={[]}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;