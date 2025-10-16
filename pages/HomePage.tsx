import React from 'react';
import Composer from '../components/Composer';
import TweetCard from '../components/TweetCard';
import StoryReel from '../components/StoryReel';
import LiveCard from '../components/LiveCard';
import { Tweet, User } from '../types';
import { userStories } from '../data/mockData';

interface HomePageProps {
  tweets: Tweet[];
  onPostTweet: (tweet: Partial<Tweet>) => void;
  onImageClick: (url: string) => void;
  onViewProfile: (user: User) => void;
  onReply: (tweet: Tweet) => void;
  onToggleBookmark: (tweetId: string) => void;
  onVote: (tweetId: string, optionId: string) => void;
  onStoryClick: (userIndex: number) => void;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  const { tweets, onPostTweet, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onStoryClick } = props;

  return (
    <div>
      <div className="hidden sm:block sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold p-4">Home</h1>
      </div>
      <div className="hidden sm:block">
        <Composer onPostTweet={onPostTweet} />
      </div>
      
      <StoryReel userStories={userStories} onStoryClick={onStoryClick} />

      <LiveCard />
      
      <div>
        {tweets.map(tweet => (
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
