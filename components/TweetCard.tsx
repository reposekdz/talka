import React from 'react';
import { Tweet, User } from '../types';
import Avatar from './Avatar';
import { VerifiedIcon, ReplyIcon, RetweetIcon, LikeIcon, ShareIcon, AnalyticsIcon, MoreIcon, PinIcon } from './Icon';
import PollDisplay from './PollDisplay';
import { motion } from 'framer-motion';
import AudioPlayer from './AudioPlayer';

interface TweetCardProps {
  tweet: Tweet;
  onImageClick: (url: string) => void;
  onViewProfile: (user: User) => void;
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onImageClick, onViewProfile }) => {
  const { user, content, timestamp, mediaUrls, replyCount, retweetCount, likeCount, viewCount, poll, pinned, isVoiceTweet, audioUrl } = tweet;

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    if (diffSeconds < 60) return `${diffSeconds}s`;
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const actionButtons = [
    { icon: <ReplyIcon />, count: replyCount, color: 'hover:text-twitter-blue' },
    { icon: <RetweetIcon />, count: retweetCount, color: 'hover:text-green-500' },
    { icon: <LikeIcon />, count: likeCount, color: 'hover:text-red-500' },
    { icon: <AnalyticsIcon />, count: viewCount, color: 'hover:text-twitter-blue' },
    { icon: <ShareIcon />, count: undefined, color: 'hover:text-twitter-blue' },
  ];

  return (
    <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex gap-4 cursor-pointer hover:bg-light-hover/50 dark:hover:bg-white/5 dim:hover:bg-dim-hover/50 transition-colors duration-200">
      <div className="flex-shrink-0" onClick={(e) => { e.stopPropagation(); onViewProfile(user); }}>
        <Avatar src={user.avatarUrl} alt={user.displayName} />
      </div>
      <div className="flex-1">
        {pinned && (
          <div className="flex items-center gap-2 text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mb-1">
            <PinIcon />
            <span>Pinned</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 flex-wrap" onClick={(e) => { e.stopPropagation(); onViewProfile(user); }}>
            <span className="font-bold hover:underline">{user.displayName}</span>
            {user.verified && <VerifiedIcon />}
            <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">@{user.username}</span>
            <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">·</span>
            <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text hover:underline">{formatTimestamp(timestamp)}</span>
          </div>
          <button className="p-2 hover:bg-twitter-blue/10 rounded-full text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text"><MoreIcon /></button>
        </div>
        
        {isVoiceTweet && audioUrl ? (
          <div className="my-2 border border-light-border dark:border-twitter-border dim:border-dim-border p-3 rounded-2xl">
              <AudioPlayer src={audioUrl} duration={0} isOwnMessage={false} isTweetPlayer={true} />
              {content && <p className="whitespace-pre-wrap mt-2 text-sm">{content}</p>}
          </div>
        ) : (
          <p className="whitespace-pre-wrap my-1">{content}</p>
        )}


        {mediaUrls && mediaUrls.length > 0 && (
          <div className={`mt-3 grid gap-1 rounded-2xl overflow-hidden border border-light-border dark:border-twitter-border dim:border-dim-border ${mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} ${mediaUrls.length === 3 ? '[&>*:first-child]:row-span-2' : ''}`}>
            {mediaUrls.map((url, index) => (
              <motion.div key={url} layoutId={url} onClick={(e) => { e.stopPropagation(); onImageClick(url); }} className="cursor-pointer relative overflow-hidden aspect-video">
                <img src={url} alt={`Tweet media ${index + 1}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        )}
        
        {poll && <PollDisplay poll={poll} />}

        <div className="flex justify-between items-center mt-3 text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
          {actionButtons.map((btn, index) => (
            <div key={index} className={`flex items-center gap-1 group transition-colors duration-200 ${btn.color}`}>
              <button onClick={(e) => e.stopPropagation()} className={`p-2 rounded-full group-hover:bg-current group-hover:bg-opacity-10`}>{btn.icon}</button>
              {btn.count !== undefined && <span className="text-sm">{btn.count.toLocaleString()}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;