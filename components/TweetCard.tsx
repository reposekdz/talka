import React, { useState } from 'react';
import { Tweet } from '../types';
import Avatar from './Avatar';
import PollDisplay from './PollDisplay';
import { VerifiedIcon, ReplyIcon, RetweetIcon, LikeIcon, ShareIcon, BookmarkIcon, AnalyticsIcon, PinIcon, MoreIcon, HeartFillIcon, RetweetFillIcon, BookmarkFillIcon, VolumeUpIcon, VolumeOffIcon } from './Icon';

interface TweetCardProps {
  tweet: Tweet;
  isPinned?: boolean;
  onImageClick: (url: string) => void;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, isPinned = false, onImageClick }) => {
  const { user, content, timestamp, mediaUrls, poll, replyCount, retweetCount, likeCount, isLiked, isRetweeted, isBookmarked } = tweet;
  const [isMuted, setIsMuted] = useState(true);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const actionItems = [
    { icon: <ReplyIcon />, count: replyCount, color: 'hover:text-twitter-blue hover:bg-twitter-blue/10' },
    { icon: isRetweeted ? <RetweetFillIcon /> : <RetweetIcon />, count: retweetCount, color: isRetweeted ? 'text-green-500' : 'hover:text-green-500 hover:bg-green-500/10' },
    { icon: isLiked ? <HeartFillIcon /> : <LikeIcon />, count: likeCount, color: isLiked ? 'text-red-500' : 'hover:text-red-500 hover:bg-red-500/10' },
    { icon: <AnalyticsIcon />, color: 'hover:text-twitter-blue hover:bg-twitter-blue/10' },
    { icon: isBookmarked ? <BookmarkFillIcon /> : <BookmarkIcon />, color: isBookmarked ? 'text-twitter-blue' : 'hover:text-twitter-blue hover:bg-twitter-blue/10' },
    { icon: <ShareIcon />, color: 'hover:text-twitter-blue hover:bg-twitter-blue/10' },
  ];

  const hasMedia = mediaUrls && mediaUrls.length > 0;
  const isVideo = hasMedia && mediaUrls[0].endsWith('.mp4');

  return (
    <div className={`p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border transition-colors duration-200 cursor-pointer ${!hasMedia ? 'hover:bg-light-hover/50 dark:hover:bg-white/5 dim:hover:bg-dim-hover/50' : ''}`}>
      {isPinned && (
        <div className="flex items-center gap-3 text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mb-2 ml-8">
          <PinIcon />
          <span>Pinned Tweet</span>
        </div>
      )}
      <div className="flex gap-4">
        <Avatar src={user.avatarUrl} alt={user.displayName} />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="font-bold hover:underline">{user.displayName}</span>
              {user.verified && <VerifiedIcon />}
              <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">@{user.username}</span>
              <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">·</span>
              <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text hover:underline">{formatTimestamp(timestamp)}</span>
            </div>
            <div className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text"><MoreIcon /></div>
          </div>
          <p className="whitespace-pre-wrap">{content}</p>

          {mediaUrls && mediaUrls.length > 0 && (
            <div className="mt-2 rounded-2xl overflow-hidden border border-light-border dark:border-twitter-border dim:border-dim-border group relative">
              {isVideo ? (
                <>
                  <video src={mediaUrls[0]} autoPlay loop muted={isMuted} playsInline className="w-full h-auto object-cover"/>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                  </button>
                </>
              ) : (
                <img onClick={(e) => { e.stopPropagation(); onImageClick(mediaUrls[0]); }} src={mediaUrls[0]} alt="Tweet media" className="w-full h-auto object-cover"/>
              )}
            </div>
          )}

          {poll && <PollDisplay poll={poll} />}

          <div className="flex justify-between items-center mt-3 max-w-md text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
             {actionItems.map((item, index) => (
               <div key={index} className={`flex items-center gap-1 group ${item.color}`}>
                 <div className="p-2 rounded-full group-hover:bg-current/10">
                    {item.icon}
                 </div>
                 {item.count !== undefined && <span className="text-sm">{item.count}</span>}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;