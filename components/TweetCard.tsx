import React from 'react';
import { Tweet, User } from '../types';
import Avatar from './Avatar';
import { VerifiedIcon, ReplyIcon, RetweetIcon, LikeIcon, ShareIcon, MoreIcon, PinIcon, BookmarkIcon, BookmarkFillIcon, QuoteIcon, EditIcon, TrashIcon, HeartFillIcon, RetweetFillIcon } from './Icon';
import PollDisplay from './PollDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

interface TweetCardProps {
  tweet: Tweet;
  currentUser: User;
  onImageClick: (url: string) => void;
  onViewProfile: (user: User) => void;
  onReply: (tweet: Tweet) => void;
  onToggleBookmark: (tweetId: string) => void;
  onVote: (tweetId: string, optionId: string) => void;
  onQuote: (tweet: Tweet) => void;
  onEdit: (tweet: Tweet) => void;
  liveReactions: { tweetId: string, type: 'like' | 'retweet', id: number }[];
}

const EmbeddedTweetCard: React.FC<{ tweet: Tweet, onViewProfile: (user:User) => void }> = ({ tweet, onViewProfile }) => {
  const { user, content, timestamp, mediaUrls } = tweet;
  return (
    <div className="mt-2 border border-light-border dark:border-twitter-border dim:border-dim-border rounded-2xl p-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); onViewProfile(user); }}>
        <div className="flex items-center gap-2 mb-1">
            <img src={user.avatarUrl} alt={user.displayName} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-sm">{user.displayName}</span>
            <span className="text-light-secondary-text dark:text-twitter-gray text-sm">@{user.username}</span>
        </div>
        <p className="text-sm">{content}</p>
        {mediaUrls && mediaUrls.length > 0 && (
            <div className="mt-2 rounded-lg overflow-hidden aspect-video">
                <img src={mediaUrls[0]} alt="Quoted tweet media" className="w-full h-full object-cover"/>
            </div>
        )}
    </div>
  )
}

const TweetCard: React.FC<TweetCardProps> = (props) => {
  const { tweet, currentUser, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onQuote, onEdit, liveReactions } = props;
  const { user, content, timestamp, mediaUrls, replyCount, retweetCount, likeCount, shareCount, isEdited, quotedTweet, poll, pinned, isVoiceTweet, audioUrl } = tweet;
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);

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
  
  const handleActionClick = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };
  
  const renderContent = () => {
    const parts = content.split(/([#@]\w+)/g);
    return parts.map((part, index) => {
        if (part.startsWith('@')) {
            return <a key={index} href="#" className="text-twitter-blue hover:underline" onClick={(e) => e.stopPropagation()}>{part}</a>
        }
        if (part.startsWith('#')) {
             return <a key={index} href="#" className="text-twitter-blue hover:underline" onClick={(e) => e.stopPropagation()}>{part}</a>
        }
        return part;
    });
  }
  
  const relevantReactions = liveReactions.filter(r => r.tweetId === tweet.id);

  const actionButtons = [
    { icon: <ReplyIcon />, count: replyCount, color: 'hover:text-twitter-blue', action: () => onReply(tweet), type: 'reply' },
    { icon: <RetweetIcon />, count: retweetCount, color: 'hover:text-green-500', type: 'retweet' },
    { icon: <LikeIcon />, count: likeCount, color: 'hover:text-red-500', type: 'like' },
    { icon: <ShareIcon />, count: shareCount, color: 'hover:text-twitter-blue', type: 'share' },
  ];

  return (
    <motion.div 
        layout="position"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex gap-4 cursor-pointer transition-colors duration-200 hover:bg-light-hover/50 dark:hover:bg-white/5"
    >
      <div className="flex-shrink-0" onClick={(e) => handleActionClick(e, () => onViewProfile(user))}>
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
          <div className="flex items-center gap-1 flex-wrap" >
            <span className="font-bold hover:underline" onClick={(e) => handleActionClick(e, () => onViewProfile(user))}>{user.displayName}</span>
            {user.verified && <VerifiedIcon />}
            <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text" onClick={(e) => handleActionClick(e, () => onViewProfile(user))}>@{user.username}</span>
            <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">·</span>
            <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text hover:underline">{formatTimestamp(timestamp)}</span>
            {isEdited && <span className="text-light-secondary-text dark:text-twitter-gray text-xs dim:text-dim-secondary-text ml-1">(edited)</span>}
          </div>
          <div className="relative">
            <button onClick={(e) => handleActionClick(e, () => setIsMoreMenuOpen(prev => !prev))} className="p-2 hover:bg-twitter-blue/10 rounded-full text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text"><MoreIcon /></button>
            {isMoreMenuOpen && (
                <div onMouseLeave={() => setIsMoreMenuOpen(false)} className="absolute top-8 right-0 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-lg shadow-lg border border-light-border dark:border-twitter-border dim:border-dim-border z-10 w-48">
                    {currentUser.id === tweet.user.id && (
                        <button onClick={(e) => handleActionClick(e, () => { onEdit(tweet); setIsMoreMenuOpen(false); })} className="flex items-center gap-2 w-full text-left p-3 hover:bg-light-hover dark:hover:bg-white/10">
                            <EditIcon/> Edit Post
                        </button>
                    )}
                     <button onClick={(e) => handleActionClick(e)} className="flex items-center gap-2 w-full text-left p-3 text-red-500 hover:bg-red-500/10">
                        <TrashIcon/> Delete
                    </button>
                </div>
            )}
          </div>
        </div>
        
        {isVoiceTweet && audioUrl ? (
          <div className="my-2 border border-light-border dark:border-twitter-border dim:border-dim-border p-3 rounded-2xl">
              <AudioPlayer src={audioUrl} duration={0} isOwnMessage={false} isTweetPlayer={true} />
              {content && <p className="whitespace-pre-wrap mt-2 text-sm">{renderContent()}</p>}
          </div>
        ) : (
          <p className="whitespace-pre-wrap my-1">{renderContent()}</p>
        )}

        {quotedTweet && <EmbeddedTweetCard tweet={quotedTweet} onViewProfile={onViewProfile} />}

        {mediaUrls && mediaUrls.length > 0 && (
          <div className={`mt-3 grid gap-1 rounded-2xl overflow-hidden border border-light-border dark:border-twitter-border dim:border-dim-border ${mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} ${mediaUrls.length === 3 ? '[&>*:first-child]:row-span-2' : ''}`}>
            {mediaUrls.map((url, index) => {
              const isVideo = url.endsWith('.mp4');
              if (isVideo) {
                return <VideoPlayer key={url} src={url} />;
              }
              return (
                 <motion.div key={url} layoutId={url} onClick={(e) => handleActionClick(e, () => onImageClick(url))} className="cursor-pointer relative overflow-hidden aspect-video">
                  <img src={url} alt={`Tweet media ${index + 1}`} className="w-full h-full object-cover" />
                </motion.div>
              )
            })}
          </div>
        )}
        
        {poll && <PollDisplay poll={poll} votedOptionId={tweet.votedOnPollId} onVote={(optionId) => onVote(tweet.id, optionId)} />}

        <div className="flex justify-between items-center mt-3 text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
          {actionButtons.map((btn, index) => (
            <div key={index} className={`flex items-center gap-1 group transition-colors duration-200 ${btn.color} relative`}>
              <button onClick={(e) => handleActionClick(e, btn.action)} className={`p-2 rounded-full group-hover:bg-current group-hover:bg-opacity-10`}>{btn.icon}</button>
              {btn.count !== undefined && <span className="text-sm">{btn.count.toLocaleString()}</span>}
              <AnimatePresence>
                {relevantReactions.filter(r => r.type === btn.type).map(reaction => (
                    <motion.div
                        key={reaction.id}
                        initial={{ opacity: 1, y: 0, scale: 0.5 }}
                        animate={{ opacity: 0, y: -30, scale: 1 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute -top-2 left-2 pointer-events-none"
                    >
                        {reaction.type === 'like' ? <HeartFillIcon className="w-5 h-5"/> : <RetweetFillIcon className="w-5 h-5"/>}
                    </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}
          <div className="flex items-center gap-2 group hover:text-twitter-blue">
            <button onClick={(e) => handleActionClick(e, () => onToggleBookmark(tweet.id))} className="p-2 rounded-full group-hover:bg-twitter-blue/10">
              {tweet.isBookmarked ? <BookmarkFillIcon /> : <BookmarkIcon />}
            </button>
            <button onClick={(e) => handleActionClick(e, () => onQuote(tweet))} className="p-2 rounded-full group-hover:bg-twitter-blue/10">
              <QuoteIcon />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TweetCard;