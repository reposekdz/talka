
import React from 'react';
import Composer from '../components/Composer';
import TweetCard from '../components/TweetCard';
import { mockTweets, userStories } from '../data/mockData';
import StoryReel from '../components/StoryReel';
import LiveCard from '../components/LiveCard';

interface HomePageProps {
    onImageClick: (url: string) => void;
    onStoryClick: (userIndex: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onImageClick, onStoryClick }) => {
  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold p-4">Home</h1>
      </div>
      <Composer />
      <StoryReel userStories={userStories} onStoryClick={onStoryClick} />
      <LiveCard />
      <div>
        {mockTweets.map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} onImageClick={onImageClick} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
