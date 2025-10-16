import React from 'react';
import TweetCard from '../components/TweetCard';
import { Tweet, User } from '../types';
import { BookmarkFillIcon } from '../components/Icon';

interface BookmarksPageProps {
  tweets: Tweet[];
  currentUser: User;
  onImageClick: (url: string) => void;
  onViewProfile: (user: User) => void;
  onReply: (tweet: Tweet) => void;
  onToggleBookmark: (tweetId: string) => void;
  onVote: (tweetId: string, optionId: string) => void;
  onQuote: (tweet: Tweet) => void;
  onEdit: (tweet: Tweet) => void;
  liveReactions: { tweetId: string, type: 'like' | 'retweet', id: number }[];
  onGrok: (tweet: Tweet) => void;
  onLikeTweet: (tweetId: string) => void;
  onTranslateTweet: (tweetId: string) => void;
  onRevertTranslation: (tweetId: string) => void;
}

const BookmarksPage: React.FC<BookmarksPageProps> = (props) => {
  const { tweets, currentUser, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onQuote, onEdit, liveReactions, onGrok, onLikeTweet, onTranslateTweet, onRevertTranslation } = props;
  const bookmarkedTweets = tweets.filter(t => t.isBookmarked);

  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <h1 className="text-xl font-bold">Bookmarks</h1>
        <p className="text-sm text-light-secondary-text dark:text-twitter-gray">@{currentUser.username}</p>
      </div>
      <div>
        {bookmarkedTweets.length > 0 ? (
          bookmarkedTweets.map(tweet => (
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
          ))
        ) : (
          <div className="text-center p-8 text-light-secondary-text dark:text-twitter-gray">
              <div className="w-16 h-16 mx-auto mb-4 text-twitter-gray">
                <BookmarkFillIcon/>
              </div>
              <h2 className="text-2xl font-bold text-light-text dark:text-white mb-2">Save Posts for later</h2>
              <p>Don’t let the good ones fly away! Bookmark Posts to easily find them again in the future.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;