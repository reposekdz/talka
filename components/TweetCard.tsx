import React, { useState } from 'react';
import { Tweet, User } from '../types';
import { VerifiedIcon, ReplyIcon, RetweetIcon, LikeIcon, ShareIcon, PinIcon, MoreIcon, HeartFillIcon, BookmarkIcon, BookmarkFillIcon, EditIcon, TrashIcon, QuoteIcon, SparklesIcon, TranslateIcon } from './Icon';
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
    liveReactions: { id: number, emoji: string, tweetId: string }[];
}

const TweetCard: React.FC<TweetCardProps> = ({ tweet, currentUser, onImageClick, onViewProfile, onReply, onToggleBookmark, onVote, onQuote, onEdit, onGrok, liveReactions }) => {
    const { user, content, timestamp, mediaUrls, quotedTweet, poll, isLiked, isBookmarked, pinned } = tweet;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        return `${days}d`;
    };

    const handleActionClick = (e: React.MouseEvent, action?: () => void) => {
        e.stopPropagation();
        action?.();
    };

    const renderMedia = () => {
        if (!mediaUrls || mediaUrls.length === 0) return null;

        if (mediaUrls[0].endsWith('.mp4')) {
            return <div className="mt-2 rounded-2xl overflow-hidden"><VideoPlayer src={mediaUrls[0]} /></div>
        }

        return (
            <div className={`mt-2 grid ${mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1 rounded-2xl overflow-hidden`}>
                {mediaUrls.map(url => (
                    <div key={url} className="cursor-pointer" onClick={(e) => handleActionClick(e, () => onImageClick(url))}>
                        <img src={url} alt="tweet media" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border hover:bg-white/5 transition-colors duration-200">
            {pinned && <div className="text-xs text-twitter-gray flex items-center gap-2 mb-2 ml-8"><PinIcon /> Pinned</div>}
            <div className="flex gap-4">
                <div className="flex-shrink-0" onClick={(e) => handleActionClick(e, () => onViewProfile(user))}>
                    <Avatar src={user.avatarUrl} alt={user.displayName} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1" onClick={(e) => handleActionClick(e, () => onViewProfile(user))}>
                            <span className="font-bold hover:underline">{user.displayName}</span>
                            {user.verified && <VerifiedIcon />}
                            <span className="text-twitter-gray">@{user.username} · {timeAgo(timestamp)}</span>
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 rounded-full hover:bg-twitter-blue/10 text-twitter-gray"><MoreIcon /></button>
                            {isMenuOpen && (
                                <div 
                                    className="absolute right-0 mt-2 bg-light-bg dark:bg-twitter-dark rounded-lg shadow-lg z-10 w-48 border border-light-border dark:border-twitter-border"
                                    onMouseLeave={() => setIsMenuOpen(false)}
                                >
                                    {user.id === currentUser.id && <button onClick={() => { onEdit(tweet); setIsMenuOpen(false); }} className="flex items-center gap-2 p-3 hover:bg-light-hover dark:hover:bg-white/10 w-full"><EditIcon /> Edit</button>}
                                    <button onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 p-3 hover:bg-light-hover dark:hover:bg-white/10 w-full"><TranslateIcon /> Translate</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="whitespace-pre-wrap">{content}</p>
                    {renderMedia()}
                    {quotedTweet && (
                        <div className="mt-2 border border-light-border dark:border-twitter-border rounded-2xl p-3">
                           <div className="flex items-center gap-2 mb-1">
                                <img src={quotedTweet.user.avatarUrl} alt={quotedTweet.user.displayName} className="w-5 h-5 rounded-full"/>
                                <span className="font-bold text-sm">{quotedTweet.user.displayName}</span>
                           </div>
                           <p className="text-sm">{quotedTweet.content}</p>
                        </div>
                    )}
                    {poll && <PollDisplay poll={poll} votedOptionId={tweet.votedOnPollId} onVote={(optionId) => onVote(tweet.id, optionId)} />}
                    <div className="flex justify-between items-center mt-3 text-twitter-gray">
                        <button onClick={() => onReply(tweet)} className="flex items-center gap-2 hover:text-twitter-blue group">
                            <div className="p-2 rounded-full group-hover:bg-twitter-blue/10"><ReplyIcon /></div>
                            <span>{tweet.replyCount}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-500 group">
                            <div className="p-2 rounded-full group-hover:bg-green-500/10"><RetweetIcon /></div>
                            <span>{tweet.retweetCount}</span>
                        </button>
                        <button className={`flex items-center gap-2 group ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
                            <div className="p-2 rounded-full group-hover:bg-red-500/10">{isLiked ? <HeartFillIcon /> : <LikeIcon />}</div>
                            <span>{tweet.likeCount}</span>
                        </button>
                        <button onClick={() => onToggleBookmark(tweet.id)} className={`flex items-center gap-2 group ${isBookmarked ? 'text-twitter-blue' : 'hover:text-twitter-blue'}`}>
                            <div className="p-2 rounded-full group-hover:bg-twitter-blue/10">{isBookmarked ? <BookmarkFillIcon /> : <BookmarkIcon />}</div>
                        </button>
                        <button onClick={() => onGrok(tweet)} className="flex items-center gap-2 hover:text-purple-500 group">
                            <div className="p-2 rounded-full group-hover:bg-purple-500/10"><SparklesIcon /></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;