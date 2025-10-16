import React, { useState } from 'react';
import Composer from '../components/Composer';
import TweetCard from '../components/TweetCard';
import StoryReel from '../components/StoryReel';
import LiveCard from '../components/LiveCard';
import { Tweet, User } from '../types';
import { userStories } from '../data/mockData';

interface HomePageProps {
  tweets: Tweet[];
  currentUser: User;
  onPostTweet: (tweet: Partial<Tweet>) => void;
  onImageClick: (url: string) => void;
  onViewProfile: (user: User) => void;
  onReply: (tweet: Tweet) => void;
  onToggleBookmark: (tweetId: string) => void;
  onVote: (tweetId: string, optionId: string) => void;
  onStoryClick: (userIndex: number) => void;
}

const TabButton: React.FC<{
  title: 'For You' | 'Following';
  activeTab: 'For You' | 'Following';
  setActiveTab: (tab: 'For You' | 'Following') => void;
}> = ({ title, activeTab, setActiveTab }) => (
    <div onClick={() => setActiveTab(title)} className="flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative">
        <span className={activeTab === title ? 'text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>
            {title}
        </span>
        {activeTab === title && <div className="absolute bottom-0 left-0 w-full h-1 bg-twitter-blue rounded-full"></div>}
    </div>
);

const HomePage: React.FC<HomePageProps> = (props) => {
  const { tweets, currentUser, onPostTweet, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onStoryClick } = props;
  const [activeTab, setActiveTab] = useState<'For You' | 'Following'>('For You');

  const followingTweets = tweets.filter(tweet => 
    currentUser.followingIds.includes(tweet.user.id) || tweet.user.id === currentUser.id
  );

  const displayedTweets = activeTab === 'For You' ? tweets : followingTweets;

  return (
    <div>
      <div className="hidden sm:block sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold p-4">Home</h1>
        <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <TabButton title="For You" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton title="Following" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
      <div className="hidden sm:block">
        <Composer onPostTweet={onPostTweet} />
      </div>
      
      <StoryReel userStories={userStories} onStoryClick={onStoryClick} />

      <LiveCard />
      
      <div>
        {displayedTweets.map(tweet => (
          <TweetCard 
            key={tweet.id} 
            tweet={tweet} 
            onImageClick={onImageClick}
            onViewProfile={onViewProfile}
            onReply={onReply}
            onToggleBookmark={onToggleBookmark}
            onVote={onVote}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;