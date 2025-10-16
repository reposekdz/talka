import React, { useState, useEffect } from 'react';
import Composer from '../components/Composer';
import TweetCard from '../components/TweetCard';
import StoryReel from '../components/StoryReel';
import LiveCard from '../components/LiveCard';
import TweetSkeleton from '../components/TweetSkeleton';
import SpacesCard from '../components/SpacesCard';
import { Tweet, User, Space, Page, UserStory } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import { TalkaIcon, NotificationsIcon, MoreIcon } from '../components/Icon';
import Avatar from '../components/Avatar';

interface HomePageProps {
  tweets: Tweet[];
  currentUser: User;
  userStories: UserStory[];
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
  onOpenDrawer: () => void;
  notificationCount: number;
  setCurrentPage: (page: Page) => void;
  onOpenTopRightMenu: () => void;
  onOpenCreator: (mode: 'select' | 'story' | 'reel' | 'post') => void;
  onGrok: (tweet: Tweet) => void;
  onLikeTweet: (tweetId: string) => void;
  onTranslateTweet: (tweetId: string) => void;
  onRevertTranslation: (tweetId: string) => void;
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
  const { tweets, currentUser, userStories, onPostTweet, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onStoryClick, onQuote, onEdit, newTweetsCount, onShowNewTweets, onJoinSpace, liveReactions, onOpenDrawer, notificationCount, setCurrentPage, onOpenTopRightMenu, onOpenCreator, onGrok, onLikeTweet, onTranslateTweet, onRevertTranslation } = props;
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
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <div className="flex justify-between items-center px-4 h-14">
            {/* Mobile Left: Drawer Button */}
            <div className="sm:hidden">
                <button onClick={onOpenDrawer}>
                    <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="small" />
                </button>
            </div>
            
            {/* Mobile Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 sm:hidden">
                 <TalkaIcon />
            </div>

            {/* Desktop Title */}
            <h1 className="text-xl font-bold hidden sm:block">Home</h1>

            {/* Mobile Right: Icons */}
            <div className="flex items-center gap-2 sm:hidden">
                <button onClick={() => setCurrentPage(Page.Notifications)} className="p-2 relative">
                    <NotificationsIcon />
                    {notificationCount > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-light-bg dark:border-twitter-dark"></span>
                    )}
                </button>
                <button onClick={onOpenTopRightMenu} className="p-2">
                    <MoreIcon />
                </button>
            </div>
        </div>
        <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <TabButton title="For You" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton title="Following" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

       <AnimatePresence>
        {newTweetsCount > 0 && (
            <motion.div
                className="sticky top-[113px] sm:top-16 flex justify-center z-10"
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
      
      <StoryReel userStories={userStories} onStoryClick={onStoryClick} onOpenCreator={() => onOpenCreator('story')} />

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
                onGrok={onGrok}
                onLikeTweet={onLikeTweet}
                onTranslateTweet={onTranslateTweet}
                onRevertTranslation={onRevertTranslation}
                />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default HomePage;