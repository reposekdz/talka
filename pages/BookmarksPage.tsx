import React, { useState } from 'react';
import { Tweet, User, Reel, AppSettings } from '../types';
import TweetCard from '../components/TweetCard';
import { BookmarkIcon, ReelsIcon } from '../components/Icon';
import TweetSkeleton from '../components/TweetSkeleton';
import { motion } from 'framer-motion';

interface BookmarksPageProps {
  tweets: Tweet[];
  reels: Reel[];
  currentUser: User;
  onViewProfile: (user: User) => void;
  onImageClick: (urls: string[], index: number) => void;
  onGrok: (tweet: Tweet) => void;
  onTranslateTweet: (tweetId: string) => void;
  onPinTweet: (tweetId: string) => void;
  onFeatureTweet: (tweetId: string) => void;
  onOpenChat: (user: User) => void;
  onLikeTweet: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onDeleteTweet: (tweetId: string) => void;
  onVote: (tweetId: string, optionId: string) => void;
  onQuote: (tweet: Tweet) => void;
  onEdit: (tweet: Tweet) => void;
  onToggleBookmark: (tweetId: string) => void;
  liveReactions: { id: number; emoji: string; tweetId: string }[];
  appSettings: AppSettings;
}

const TWEETS_PER_PAGE = 10;

const BookmarksPage: React.FC<BookmarksPageProps> = (props) => {
  const { tweets, reels, currentUser, onViewProfile, onImageClick, onGrok, onTranslateTweet, onPinTweet, onFeatureTweet, onOpenChat, onLikeTweet, onRetweet, onDeleteTweet, onVote, onQuote, onEdit, onToggleBookmark, liveReactions, appSettings } = props;
  const [visibleCount, setVisibleCount] = useState(TWEETS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState('Posts');

  const visibleTweets = tweets.slice(0, visibleCount);
  const hasMore = visibleCount < tweets.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
        setVisibleCount(prev => Math.min(prev + TWEETS_PER_PAGE, tweets.length));
        setIsLoadingMore(false);
    }, 1000);
  };

  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <h1 className="text-xl font-bold">Bookmarks</h1>
        <p className="text-sm text-light-secondary-text dark:text-twitter-gray">@{currentUser.username}</p>
      </div>

      <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        {['Posts', 'Reels'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} className="flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative">
            <span className={activeTab === tab ? 'text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>
              {tab}
            </span>
            {activeTab === tab && <motion.div layoutId="bookmarksTabIndicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-twitter-blue rounded-full" transition={{ type: "spring", stiffness: 350, damping: 30 }}></motion.div>}
          </div>
        ))}
      </div>

      {activeTab === 'Posts' ? (
        <>
          {tweets.length > 0 ? (
            <>
              {visibleTweets.map(tweet => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  currentUser={currentUser}
                  onImageClick={onImageClick}
                  onViewProfile={onViewProfile}
                  onReply={() => {}}
                  onToggleBookmark={onToggleBookmark}
                  onVote={onVote}
                  onQuote={onQuote}
                  onEdit={onEdit}
                  onDeleteTweet={onDeleteTweet}
                  onGrok={onGrok}
                  onTranslateTweet={onTranslateTweet}
                  onPinTweet={onPinTweet}
                  onFeatureTweet={onFeatureTweet}
                  onOpenChat={onOpenChat}
                  onLikeTweet={onLikeTweet}
                  onRetweet={onRetweet}
                  liveReactions={liveReactions}
                  appSettings={appSettings}
                />
              ))}
              {isLoadingMore && Array.from({ length: 3 }).map((_, i) => <TweetSkeleton key={`loading-${i}`} />)}
              {hasMore && !isLoadingMore && (
                  <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border text-center">
                      <button
                          onClick={loadMore}
                          className="text-twitter-blue hover:underline font-semibold"
                      >
                          Show more
                      </button>
                  </div>
              )}
            </>
          ) : (
            <div className="text-center p-8 text-light-secondary-text dark:text-twitter-gray">
              <BookmarkIcon />
              <h2 className="text-2xl font-bold mt-4">Save posts for later</h2>
              <p className="max-w-sm mx-auto mt-2">
                Bookmark posts to easily find them again in the future.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
            {reels.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-0.5">
                {reels.map(reel => (
                    <div key={reel.id} className="relative aspect-[9/16] bg-black">
                    <video src={reel.videoUrl} loop muted playsInline className="w-full h-full object-cover"/>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center p-8 text-light-secondary-text dark:text-twitter-gray">
                    <ReelsIcon />
                    <h2 className="text-2xl font-bold mt-4">Save Reels for later</h2>
                    <p className="max-w-sm mx-auto mt-2">
                        Bookmark Reels to easily find them again in the future.
                    </p>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default BookmarksPage;
