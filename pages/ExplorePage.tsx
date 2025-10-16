import React, { useState } from 'react';
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

const TWEETS_PER_PAGE = 10;

const ExplorePage: React.FC<ExplorePageProps> = ({ onImageClick, onViewProfile, onGrok, tweets, currentUser }) => {
  const [visibleCount, setVisibleCount] = useState(TWEETS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const mediaTweets = tweets.filter(t => t.mediaUrls && t.mediaUrls.length > 0);
  
  const visibleMediaTweets = mediaTweets.slice(0, visibleCount);
  const hasMore = visibleCount < mediaTweets.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + TWEETS_PER_PAGE, mediaTweets.length));
        setIsLoadingMore(false);
    }, 1000);
  };
  
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
          {visibleMediaTweets.map(tweet => (
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
       {hasMore && !isLoadingMore && (
          <div className="p-4 text-center">
              <button
                  onClick={loadMore}
                  className="text-twitter-blue hover:underline font-semibold"
              >
                  Show more
              </button>
          </div>
      )}
      {isLoadingMore && (
          <div className="p-4 text-center text-twitter-blue font-semibold">
              Loading...
          </div>
      )}
    </div>
  );
};

export default ExplorePage;