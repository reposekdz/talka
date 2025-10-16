
import React from 'react';
import { mockTrendingTopics } from '../data/mockData';
import TrendingTopic from '../components/TrendingTopic';
import { SearchIcon } from '../components/Icon';
import { Tweet, User } from '../types';
import MediaCard from '../components/MediaCard';

interface ExplorePageProps {
  onImageClick: (url: string) => void;
  onViewProfile: (user: User) => void;
  onGrok: (tweet: Tweet) => void;
  tweets: Tweet[];
  currentUser: User;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ onImageClick, onViewProfile, onGrok, tweets, currentUser }) => {
  const mediaTweets = tweets.filter(t => t.mediaUrls && t.mediaUrls.length > 0);
  
  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-light-secondary-text dark:text-twitter-gray">
                <SearchIcon />
            </div>
            <input
                type="text"
                placeholder="Search"
                className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-current placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text rounded-full pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
            />
        </div>
      </div>
      <div className="p-2">
        <h2 className="text-xl font-extrabold p-2">Trends for you</h2>
        <div className="grid grid-cols-2 gap-0.5">
          {mockTrendingTopics.map(topic => (
            <TrendingTopic key={topic.topic} {...topic} />
          ))}
        </div>
      </div>
      <div className="p-2" style={{ columnCount: 2, columnGap: '8px' }}>
          {mediaTweets.map(tweet => (
              <MediaCard 
                key={tweet.id} 
                tweet={tweet} 
                onMediaClick={() => onImageClick(tweet.mediaUrls![0])} 
                onViewProfile={onViewProfile}
                onLikeTweet={() => {}}
                onReply={() => {}}
                onToggleBookmark={() => {}}
              />
          ))}
      </div>
    </div>
  );
};

export default ExplorePage;
