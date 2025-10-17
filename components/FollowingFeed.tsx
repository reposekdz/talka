import React, { useMemo } from 'react';
import { Tweet, User } from '../types';
import TweetCard from './TweetCard';
import WhoToFollow from './WhoToFollow';
import { motion } from 'framer-motion';
import { SparklesIcon } from './Icon';

interface FollowingFeedProps {
    tweets: Tweet[];
    currentUser: User;
    otherUsers: User[];
    onFollowToggle: (userId: string) => void;
    onImageClick: (urls: string[], index: number) => void;
    onViewProfile: (user: User) => void;
    onReply: (tweet: Tweet) => void;
    onToggleBookmark: (tweetId: string) => void;
    onVote: (tweetId: string, optionId: string) => void;
    onQuote: (tweet: Tweet) => void;
    onEdit: (tweet: Tweet) => void;
    onDeleteTweet: (tweetId: string) => void;
    onPinTweet: (tweetId: string) => void;
    onFeatureTweet: (tweetId: string) => void;
    onGrok: (tweet: Tweet) => void;
    onTranslateTweet: (tweetId: string) => void;
    onOpenChat: (user: User) => void;
    onLikeTweet: (tweetId: string) => void;
    onRetweet: (tweetId: string) => void;
    liveReactions: { id: number; emoji: string; tweetId: string }[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const FollowingFeed: React.FC<FollowingFeedProps> = (props) => {
    const { currentUser, otherUsers, tweets, onFollowToggle, ...tweetCardProps } = props;

    const followingTweets = useMemo(() => {
        const followingAndOwnTweets = tweets.filter(
            tweet => currentUser.followingIds.includes(tweet.user.id) || tweet.user.id === currentUser.id
        );
        return followingAndOwnTweets.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [tweets, currentUser]);

    const groupedTweets = useMemo(() => {
        const groups = new Map<string, { user: User, tweets: Tweet[] }>();
        followingTweets.forEach(tweet => {
            if (!groups.has(tweet.user.id)) {
                groups.set(tweet.user.id, { user: tweet.user, tweets: [] });
            }
            groups.get(tweet.user.id)!.tweets.push(tweet);
        });
        return Array.from(groups.values());
    }, [followingTweets]);

    const suggestions = useMemo(() => {
        return otherUsers.filter(u => !currentUser.followingIds.includes(u.id) && u.id !== currentUser.id).slice(0, 5);
    }, [otherUsers, currentUser]);

    if (currentUser.followingIds.length === 0) {
        return (
            <div className="p-4 md:p-8">
                <h1 className="text-3xl font-extrabold mb-2">Welcome to your Timeline!</h1>
                <p className="text-light-secondary-text dark:text-twitter-gray mb-6">This is your personal feed. Follow some accounts to see their posts here.</p>
                <h2 className="text-xl font-bold mb-4">Suggested for you</h2>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {suggestions.map(user => (
                        <div key={user.id} className="w-64 flex-shrink-0">
                            <WhoToFollow 
                                user={user}
                                currentUser={currentUser}
                                onFollowToggle={onFollowToggle}
                                onViewProfile={props.onViewProfile}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {groupedTweets.map(group => (
                <motion.div key={group.user.id} variants={itemVariants} className="border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                    <div className="p-4 flex items-center gap-3">
                         <img src={group.user.avatarUrl} alt={group.user.displayName} className="w-8 h-8 rounded-full"/>
                         <span className="font-bold">{group.user.displayName}</span>
                         <span className="text-light-secondary-text dark:text-twitter-gray">@{group.user.username}</span>
                    </div>
                    {group.tweets.map(tweet => (
                        <TweetCard key={tweet.id} tweet={tweet} {...tweetCardProps} currentUser={currentUser} />
                    ))}
                </motion.div>
            ))}
             <motion.div variants={itemVariants} className="p-4 md:p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Find more people to follow</h2>
                <div className="grid grid-cols-1 gap-4">
                    {suggestions.slice(0, 3).map(user => (
                         <WhoToFollow 
                            key={user.id} 
                            user={user}
                            currentUser={currentUser}
                            onFollowToggle={onFollowToggle}
                            onViewProfile={props.onViewProfile}
                        />
                    ))}
                </div>
                 <button className="mt-4 text-twitter-blue hover:underline">Show more</button>
            </motion.div>
        </motion.div>
    );
};

export default FollowingFeed;