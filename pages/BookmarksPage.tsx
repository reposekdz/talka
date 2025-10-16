
import React from 'react';
import { Tweet, User } from '../types';
import TweetCard from '../components/TweetCard';
import { BookmarkIcon } from '../components/Icon';

interface BookmarksPageProps {
  tweets: Tweet[];
  currentUser: User;
  onViewProfile: (user: User) => void;
  onImageClick: (url: string) => void;
  onGrok: (tweet: Tweet) => void;
}

const BookmarksPage: React.FC<BookmarksPageProps> = ({ tweets, currentUser, onViewProfile, onImageClick, onGrok }) => {
  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <h1 className="text-xl font-bold">Bookmarks</h1>
        <p className="text-sm text-light-secondary-text dark:text-twitter-gray">@{currentUser.username}</p>
      </div>

      {tweets.length > 0 ? (
        tweets.map(tweet => (
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
            liveReactions={[]}
          />
        ))
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
