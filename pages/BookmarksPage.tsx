import React from 'react';
import TweetCard from '../components/TweetCard';
import { baseTweets } from '../data/mockData';
import { Tweet } from '../types';

interface BookmarksPageProps {
  onImageClick: (url: string) => void;
}

const BookmarksPage: React.FC<BookmarksPageProps> = ({ onImageClick }) => {
  const bookmarkedTweets = baseTweets.filter(t => t.isBookmarked);

  return (
    <div>
      <div className="sticky top-0 bg-twitter-dark/80 backdrop-blur-md z-10 p-4 border-b border-twitter-border">
        <h1 className="text-xl font-bold">Bookmarks</h1>
        <p className="text-sm text-twitter-gray">@reactdev</p>
      </div>
      <div>
        {bookmarkedTweets.length > 0 ? (
          bookmarkedTweets.map(tweet => (
            <TweetCard key={tweet.id} tweet={tweet} onImageClick={onImageClick} />
          ))
        ) : (
          <p className="text-center p-8 text-twitter-gray">You haven't added any Tweets to your Bookmarks yet.</p>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;