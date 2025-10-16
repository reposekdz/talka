import React from 'react';
import Composer from '../components/Composer';
import TweetCard from '../components/TweetCard';
import { userStories } from '../data/mockData';
import StoryReel from '../components/StoryReel';
import LiveCard from '../components/LiveCard';
import { Tweet, User } from '../types';

interface HomePageProps {
    tweets: Tweet[];
    onImageClick: (url: string) => void;
    onStoryClick: (userIndex: number) => void;
    onViewProfile: (user: User) => void;
    onPostTweet: (tweet: Partial<Tweet>) => void;
}

const HomePage: React.FC<HomePageProps> = ({ tweets, onImageClick, onStoryClick, onViewProfile, onPostTweet }) => {
  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold p-4">Home</h1>
      </div>
      <Composer onPostTweet={onPostTweet} />
      <StoryReel userStories={userStories} onStoryClick={onStoryClick} />
      <LiveCard />
      <div>
        {tweets.map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} onImageClick={onImageClick} onViewProfile={onViewProfile} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
