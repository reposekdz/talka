import React, { useState } from 'react';
import { Tweet, User } from '../types';
import TweetCard from '../components/TweetCard';
import { BookmarkIcon } from '../components/Icon';
import TweetSkeleton from '../components/TweetSkeleton';

interface BookmarksPageProps {
  tweets: Tweet[];
  currentUser: User;
  onViewProfile: (user: User) => void;
  onImageClick: (url: string) => void;
  onGrok: (tweet: Tweet) => void;
  onTranslateTweet: (tweetId: string) => void;
  onOpenChat: (user: User) => void;
}

const TWEETS_PER_PAGE = 10;

const BookmarksPage: React.FC<BookmarksPageProps> = ({ tweets, currentUser, onViewProfile, onImageClick, onGrok, onTranslateTweet, onOpenChat }) => {
  const [visibleCount, setVisibleCount] = useState(TWEETS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
              onToggleBookmark={() => {}}
              onVote={() => {}}
              onQuote={() => {}}
              onEdit={() => {}}
              onGrok={onGrok}
              onTranslateTweet={onTranslateTweet}
              onOpenChat={onOpenChat}
              liveReactions={[]}
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
    </div>
  );
};

export default BookmarksPage;