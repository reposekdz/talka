import React, { useState } from 'react';
import { Tweet, User } from '../types';
import { VerifiedIcon, ReplyIcon, RetweetIcon, LikeIcon, ShareIcon, PinIcon, MoreIcon, HeartFillIcon, BookmarkIcon, BookmarkFillIcon, EditIcon, TrashIcon, QuoteIcon, SparklesIcon, TranslateIcon, MessagesIcon } from './Icon';
import Avatar from './Avatar';
import PollDisplay from './PollDisplay';
import VideoPlayer from './VideoPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import AudioPlayer from './AudioPlayer';

interface TweetMenuProps {
  tweet: Tweet;
  isOwnTweet: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onGrok: () => void;
  onOpenChat: () => void;
  onPinTweet: () => void;
}

const TweetMenu: React.FC<TweetMenuProps> = ({ tweet, isOwnTweet, onClose, onEdit, onDelete, onGrok, onOpenChat, onPinTweet }) => {
  const menuItems = [
    ...(isOwnTweet ? [
      { text: tweet.pinned ? 'Unpin from profile' : 'Pin to your profile', icon: <PinIcon />, action: onPinTweet },
      { text: 'Edit Post', icon: <EditIcon />, action: onEdit },
      { text: 'Delete Post', icon: <TrashIcon />, action: onDelete, className: 'text-red-500' }
    ] : []),
    { text: 'Analyze with AI', icon: <SparklesIcon />, action: onGrok },
    { text: 'Message user', icon: <MessagesIcon />, action: onOpenChat },
  ];

  return (
    <div
      className="fixed inset-0 bg-transparent z-40"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute top-8 right-0 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-lg shadow-lg w-48 border border-light-border dark:border-twitter-border z-50 origin-top-right"
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          {menuItems.map(item => (
            <li key={item.text}>
              <button onClick={() => { item.action(); onClose(); }} className={`w-full flex items-center gap-3 p-3 text-sm hover:bg-light-hover dark:hover:bg-white/10 ${item.className || ''}`}>
                {item.icon}
                <span>{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};


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
    onGrok: (tweet: Tweet) => void;
    onTranslateTweet: (tweetId: string) => void;
    onPinTweet: (tweetId: string) => void;
    onOpenChat: (user: User) => void;
    onLikeTweet: (tweetId: string) => void;
    liveReactions: { id: number, emoji: string, tweetId: string }[];
}

const TRUNCATE_LENGTH = 250;

const TweetCard: React.FC<TweetCardProps> = (props) => {
    const { tweet, currentUser, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onQuote, onEdit, onGrok, onTranslateTweet, onPinTweet, onOpenChat, onLikeTweet, liveReactions } = props;
    const { user, content, timestamp, mediaUrls, quotedTweet, poll, isLiked, isBookmarked, pinned, translation, isVoiceTweet, audioUrl } = tweet;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const relevantReactions = liveReactions.filter(r => r.tweetId === tweet.id);

    const isLongContent = content.length > TRUNCATE_LENGTH;
    const displayedContent = isLongContent && !isExpanded ? `${content.substring(0, TRUNCATE_LENGTH)}...` : content;

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const handleActionClick = (e: React.MouseEvent, action?: () => void) => {
        e.stopPropagation();
        action?.();
    };
    
    const handleTranslate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (translation) {
            setShowTranslation(!showTranslation);
        } else {
            onTranslateTweet(tweet.id);
        }
    };

    const renderMedia = () => {
        if (!mediaUrls || mediaUrls.length === 0) return null;

        const isVideo = mediaUrls.some(url => url.endsWith('.mp4'));
        if (isVideo) {
            return (
                <div className="mt-2 rounded-2xl overflow-hidden border border-light-border dark:border-twitter-border dim:border-dim-border" onClick={e => e.stopPropagation()}>
                    <VideoPlayer src={mediaUrls[0]} />
                </div>
            );
        }

        const gridClasses: { [key: number]: string } = {
            1: 'grid-cols-1 aspect-[16/9]',
            2: 'grid-cols-2 aspect-video',
            3: 'grid-cols-2 aspect-video', // Will handle with custom spans
            4: 'grid-cols-2 aspect-square',
        };

        return (
            <div className={`mt-2 grid gap-0.5 rounded-2xl overflow-hidden border border-light-border dark:border-twitter-border dim:border-dim-border ${gridClasses[mediaUrls.length] || 'grid-cols-2'}`}>
                {mediaUrls.slice(0, 4).map((url, index) => (
                    <div
                        key={index}
                        className={`relative cursor-pointer bg-black
                            ${mediaUrls.length === 3 && index === 0 ? 'row-span-2' : ''}
                            ${mediaUrls.length === 3 && index === 1 ? 'col-start-2' : ''}
                        `}
                        onClick={(e) => handleActionClick(e, () => onImageClick(url))}
                    >
                        <img src={url} alt={`media content ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
            <div className="flex gap-4">
                <div className="flex-shrink-0" onClick={(e) => handleActionClick(e, () => onViewProfile(user))}>
                    <Avatar src={user.avatarUrl} alt={user.displayName} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm flex-wrap" onClick={(e) => handleActionClick(e, () => onViewProfile(user))}>
                            <span className="font-bold hover:underline">{user.displayName}</span>
                            {user.verified && <VerifiedIcon />}
                            <span className="text-light-secondary-text dark:text-twitter-gray">@{user.username}</span>
                            <span className="text-light-secondary-text dark:text-twitter-gray">· {timeAgo(timestamp)}</span>
                        </div>
                        <div className="relative">
                            <button onClick={(e) => handleActionClick(e, () => setIsMenuOpen(!isMenuOpen))} className="p-1 rounded-full hover:bg-twitter-blue/10 text-light-secondary-text dark:text-twitter-gray">
                                <MoreIcon />
                            </button>
                             <AnimatePresence>
                                {isMenuOpen && <TweetMenu tweet={tweet} isOwnTweet={user.id === currentUser.id} onClose={() => setIsMenuOpen(false)} onEdit={() => onEdit(tweet)} onDelete={() => {}} onGrok={() => onGrok(tweet)} onOpenChat={() => onOpenChat(user)} onPinTweet={() => onPinTweet(tweet.id)} />}
                            </AnimatePresence>
                        </div>
                    </div>
                    
                    {isVoiceTweet && audioUrl ? (
                         <div className="mt-2 p-3 rounded-2xl border border-light-border dark:border-twitter-border flex items-center gap-3">
                            <Avatar src={user.avatarUrl} alt={user.displayName} size="small" />
                            <AudioPlayer src={audioUrl} duration={0} isOwnMessage={false} isTweetPlayer={true} />
                         </div>
                    ) : (
                        <div>
                            <p className="whitespace-pre-wrap">{displayedContent}</p>
                            {isLongContent && !isExpanded && <button onClick={(e) => handleActionClick(e, () => setIsExpanded(true))} className="text-twitter-blue">Show more</button>}
                            {translation && <div className="mt-2 text-sm text-light-secondary-text dark:text-twitter-gray italic">Translated from {translation.sourceLang}: {translation.text}</div>}
                        </div>
                    )}

                    {renderMedia()}
                    
                    {quotedTweet && (
                        <div className="mt-2 border border-light-border dark:border-twitter-border dim:border-dim-border rounded-2xl p-3">
                            <div className="flex items-center gap-2 mb-1 text-sm">
                                <img src={quotedTweet.user.avatarUrl} alt={quotedTweet.user.displayName} className="w-5 h-5 rounded-full" />
                                <span className="font-bold">{quotedTweet.user.displayName}</span>
                                <span className="text-light-secondary-text dark:text-twitter-gray">@{quotedTweet.user.username}</span>
                            </div>
                            <p className="text-sm">{quotedTweet.content}</p>
                        </div>
                    )}

                    {poll && <PollDisplay poll={poll} votedOptionId={tweet.votedOnPollId} onVote={(optionId) => onVote(tweet.id, optionId)} />}
                    
                    <div className="flex justify-between items-center mt-3 text-light-secondary-text dark:text-twitter-gray">
                        <button onClick={(e) => handleActionClick(e, () => onReply(tweet))} className="flex items-center gap-2 group">
                            <div className="p-2 rounded-full group-hover:bg-twitter-blue/10"><ReplyIcon /></div>
                            <span className="text-xs">{tweet.replyCount > 0 ? tweet.replyCount : ''}</span>
                        </button>
                        <button onClick={(e) => handleActionClick(e, () => {})} className="flex items-center gap-2 group">
                            <div className="p-2 rounded-full group-hover:bg-green-500/10"><RetweetIcon /></div>
                            <span className="text-xs">{tweet.retweetCount > 0 ? tweet.retweetCount : ''}</span>
                        </button>
                        <div className="relative">
                            <AnimatePresence>
                                {relevantReactions.map(reaction => (
                                    <motion.div
                                        key={reaction.id}
                                        initial={{ y: 0, opacity: 1, scale: 0.5 }}
                                        animate={{ y: -50, opacity: 0, scale: 1.5 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="absolute -top-4 left-1/2 -translate-x-1/2 text-red-500 text-2xl pointer-events-none"
                                    >
                                        {reaction.emoji}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <button onClick={(e) => handleActionClick(e, () => onLikeTweet(tweet.id))} className={`flex items-center gap-2 group ${isLiked ? 'text-red-500' : ''}`}>
                                <div className="p-2 rounded-full group-hover:bg-red-500/10">{isLiked ? <HeartFillIcon/> : <LikeIcon />}</div>
                                <span className="text-xs">{tweet.likeCount > 0 ? tweet.likeCount : ''}</span>
                            </button>
                        </div>
                         <div className="flex items-center">
                            <button onClick={handleTranslate} className="p-2 rounded-full group-hover:bg-twitter-blue/10">
                                <TranslateIcon />
                            </button>
                            <button onClick={(e) => handleActionClick(e, () => onToggleBookmark(tweet.id))} className="p-2 rounded-full group-hover:bg-twitter-blue/10">
                                {isBookmarked ? <BookmarkFillIcon className="text-twitter-blue"/> : <BookmarkIcon />}
                            </button>
                            <button onClick={(e) => handleActionClick(e, () => {})} className="p-2 rounded-full group-hover:bg-twitter-blue/10"><ShareIcon /></button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;