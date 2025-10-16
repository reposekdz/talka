
import React, { useState, useEffect } from 'react';
import Composer from '../components/Composer';
import TweetCard from '../components/TweetCard';
import StoryReel from '../components/StoryReel';
import LiveCard from '../components/LiveCard';
import TweetSkeleton from '../components/TweetSkeleton';
import SpacesCard from '../components/SpacesCard';
import { Tweet, User, Space } from '../types';
import { userStories } from '../data/mockData';
import { AnimatePresence, motion } from 'framer-motion';
import { ProtoIcon } from '../components/Icon';

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
  onQuote: (tweet: Tweet) => void;
  onEdit: (tweet: Tweet) => void;
  newTweetsCount: number;
  onShowNewTweets: () => void;
  onJoinSpace: (space: Space) => void;
  liveReactions: { tweetId: string, type: 'like' | 'retweet', id: number }[];
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

const MobileTopHeader: React.FC = () => (
    <div className="sm:hidden sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-2 flex justify-between items-center border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <div className="w-10">
            {/* Potentially add profile avatar here */}
        </div>
        <div className="text-current">
            <ProtoIcon />
        </div>
        <div className="w-10 h-10"></div>
    </div>
);


const HomePage: React.FC<HomePageProps> = (props) => {
  const { tweets, currentUser, onPostTweet, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onStoryClick, onQuote, onEdit, newTweetsCount, onShowNewTweets, onJoinSpace, liveReactions } = props;
  const [activeTab, setActiveTab] = useState<'For You' | 'Following'>('For You');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const followingTweets = tweets.filter(tweet => 
    currentUser.followingIds.includes(tweet.user.id) || tweet.user.id === currentUser.id
  );

  const displayedTweets = activeTab === 'For You' ? tweets : followingTweets;

  return (
    <div className="relative">
      <MobileTopHeader />
      <div className="hidden sm:block sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-bold">Home</h1>
        </div>
        <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <TabButton title="For You" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton title="Following" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

       <AnimatePresence>
        {newTweetsCount > 0 && (
            <motion.div 
                className="sticky top-16 flex justify-center z-10"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
            >
                <button 
                    onClick={onShowNewTweets}
                    className="bg-twitter-blue text-white font-semibold px-4 py-2 rounded-full shadow-lg"
                >
                    Show {newTweetsCount} new Posts
                </button>
            </motion.div>
        )}
       </AnimatePresence>


      <div className="hidden sm:block">
        <Composer onPostTweet={onPostTweet} />
      </div>
      
      <StoryReel userStories={userStories} onStoryClick={onStoryClick} />

      <SpacesCard onJoinSpace={onJoinSpace} />

      <LiveCard />
      
      <div>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => <TweetSkeleton key={index} />)
        ) : (
          <AnimatePresence initial={false}>
            {displayedTweets.map(tweet => (
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
                liveReactions={liveReactions}
                />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default HomePage;
