import React, { useState } from 'react';
import { Tweet, User } from '../types';
import { VerifiedIcon, ReplyIcon, RetweetIcon, LikeIcon, ShareIcon, PinIcon, MoreIcon, HeartFillIcon, BookmarkIcon, BookmarkFillIcon, EditIcon, TrashIcon, QuoteIcon, SparklesIcon, TranslateIcon, MessagesIcon } from './Icon';
import Avatar from './Avatar';
import PollDisplay from './PollDisplay';
import VideoPlayer from './VideoPlayer';
import { motion, AnimatePresence } from 'framer-motion';

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
    onOpenChat: (user: User) => void;
    liveReactions: { id: number, emoji: string, tweetId: string }[];
}

const TRUNCATE_LENGTH = 250;

const TweetCard: React.FC<TweetCardProps> = (props) => {
    const { tweet, currentUser, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onQuote, onEdit, onGrok, onTranslateTweet, onOpenChat } = props;
    const { user, content, timestamp, mediaUrls, quotedTweet, poll, isLiked, isBookmarked, pinned, translation } = tweet;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
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
                        </div>
                    </div>
                    <div>
                        <p className="whitespace-pre-wrap">{displayedContent}</p>
                        {isLongContent && !isExpanded && <button onClick={(e) => handleActionClick(e, () => setIsExpanded(true))} className="text-twitter-blue">Show more</button>}
                        {translation && <div className="mt-2 text-sm text-light-secondary-text dark:text-twitter-gray italic">Translated from {translation.sourceLang}: {translation.text}</div>}
                    </div>

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
                        <button onClick={(e) => handleActionClick(e, () => {})} className={`flex items-center gap-2 group ${isLiked ? 'text-red-500' : ''}`}>
                            <div className="p-2 rounded-full group-hover:bg-red-500/10">{isLiked ? <HeartFillIcon/> : <LikeIcon />}</div>
                            <span className="text-xs">{tweet.likeCount > 0 ? tweet.likeCount : ''}</span>
                        </button>
                        <button onClick={(e) => handleActionClick(e, () => onToggleBookmark(tweet.id))} className="p-2 rounded-full group-hover:bg-twitter-blue/10">
                            {isBookmarked ? <BookmarkFillIcon className="text-twitter-blue"/> : <BookmarkIcon />}
                        </button>
                        <button onClick={(e) => handleActionClick(e, () => {})} className="p-2 rounded-full group-hover:bg-twitter-blue/10"><ShareIcon /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;
