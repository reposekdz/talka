import React from 'react';
import { motion } from 'framer-motion';
import { Tweet, User } from '../types';
import { ReplyIcon, RetweetIcon, LikeIcon, ShareIcon, HeartFillIcon, BookmarkIcon, BookmarkFillIcon } from './Icon';

interface MediaCardProps {
  tweet: Tweet;
  onMediaClick: (tweet: Tweet) => void;
  onViewProfile: (user: User) => void;
  onLikeTweet: (tweetId: string) => void;
  onReply: (tweet: Tweet) => void;
  onToggleBookmark: (tweetId: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ tweet, onMediaClick, onViewProfile, onLikeTweet, onReply, onToggleBookmark }) => {
  const { user, mediaUrls, replyCount, retweetCount, likeCount, isLiked, isBookmarked } = tweet;
  const isVideo = mediaUrls && mediaUrls[0].endsWith('.mp4');

  const handleActionClick = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };

  return (
    <div 
        className="relative rounded-lg overflow-hidden group cursor-pointer break-inside-avoid mb-3"
        onClick={() => onMediaClick(tweet)}
    >
      {isVideo ? (
        <video src={mediaUrls![0]} loop muted autoPlay playsInline className="w-full h-auto object-cover"/>
      ) : (
        <img src={mediaUrls![0]} alt="Tweet media" className="w-full h-auto object-cover"/>
      )}
      
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3"
      >
        <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={(e) => handleActionClick(e, () => onViewProfile(user))}
        >
            <img src={user.avatarUrl} alt={user.displayName} className="w-8 h-8 rounded-full" />
            <span className="font-bold text-sm text-white truncate drop-shadow-md">{user.displayName}</span>
        </div>
        
        <div className="flex items-center justify-end gap-2 text-white">
            <button onClick={(e) => handleActionClick(e, () => onReply(tweet))} className="flex items-center gap-1 hover:text-twitter-blue p-2 bg-black/30 rounded-full">
                <ReplyIcon />
                <span className="text-xs">{replyCount}</span>
            </button>
            <button onClick={(e) => handleActionClick(e)} className="flex items-center gap-1 hover:text-green-500 p-2 bg-black/30 rounded-full">
                <RetweetIcon />
                <span className="text-xs">{retweetCount}</span>
            </button>
            <button onClick={(e) => handleActionClick(e, () => onLikeTweet(tweet.id))} className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'hover:text-red-500'} p-2 bg-black/30 rounded-full`}>
                {isLiked ? <HeartFillIcon/> : <LikeIcon />}
                <span className="text-xs">{likeCount}</span>
            </button>
            <button onClick={(e) => handleActionClick(e, () => onToggleBookmark(tweet.id))} className={`p-2 bg-black/30 rounded-full ${isBookmarked ? 'text-twitter-blue' : 'hover:text-twitter-blue'}`}>
                {isBookmarked ? <BookmarkFillIcon /> : <BookmarkIcon />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;