
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { baseTweets, mockTweets } from '../data/mockData';
import TweetCard from '../components/TweetCard';
import { VerifiedIcon, CalendarIcon, MoreIcon } from '../components/Icon';
import Avatar from '../components/Avatar';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfilePageProps {
  user: User;
  onImageClick: (url: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onImageClick }) => {
    const [activeTab, setActiveTab] = useState('Tweets');

    const userTweets = useMemo(() => baseTweets.filter(t => t.user.id === user.id), [user.id]);
    const pinnedTweet = useMemo(() => userTweets.find(t => t.isPinned), [userTweets]);

    const displayedTweets = useMemo(() => {
        const nonPinnedTweets = userTweets.filter(t => !t.isPinned);
        switch(activeTab) {
            case 'Media':
                return nonPinnedTweets.filter(t => t.mediaUrls && t.mediaUrls.length > 0);
            case 'Likes':
                return user.id === 'u1' ? mockTweets.filter(t => t.isLiked) : [];
            case 'Replies':
                return []; 
            case 'Tweets':
            default:
                return nonPinnedTweets;
        }
    }, [activeTab, userTweets, user.id]);

    const tabs = ['Tweets', 'Replies', 'Media', 'Likes'];

    const formatJoinDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    return (
        <div className="relative">
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-20 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                <h1 className="text-xl font-bold">{user.displayName}</h1>
                <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">{userTweets.length} Tweets</p>
            </div>
            
            <div>
                <div className="h-48 bg-gray-300 dark:bg-gray-700 relative">
                    <img src="https://picsum.photos/seed/header/1500/500" alt="Profile banner" className="w-full h-full object-cover"/>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="transform -translate-y-20 border-4 border-light-bg dark:border-twitter-dark dim:border-dim-bg rounded-full">
                            <Avatar src={user.avatarUrl} alt={user.displayName} size="xlarge" />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <button className="p-2 border border-light-border dark:border-twitter-border dim:border-dim-border rounded-full hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover"><MoreIcon /></button>
                            <button className="border border-light-border dark:border-twitter-border dim:border-dim-border font-bold px-4 py-2 rounded-full hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    <div className="transform -translate-y-16">
                        <div className="flex items-center">
                            <h2 className="text-2xl font-bold">{user.displayName}</h2>
                            {user.verified && <VerifiedIcon />}
                        </div>
                        <p className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">@{user.username}</p>
                        <p className="mt-4">{user.bio}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-4">
                           {user.location && <span>{user.location}</span>}
                           {user.website && <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-twitter-blue hover:underline">{user.website}</a>}
                            <div className="flex items-center gap-1">
                                <CalendarIcon/>
                                <span>Joined {formatJoinDate(user.joinDate)}</span>
                            </div>
                        </div>
                        <div className="flex gap-6 mt-4">
                            <p><span className="font-bold text-light-text dark:text-white dim:text-dim-text">{user.following}</span> <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">Following</span></p>
                            <p><span className="font-bold text-light-text dark:text-white dim:text-dim-text">{user.followers.toLocaleString()}</span> <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">Followers</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky top-[73px] bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex">
                {tabs.map(tab => (
                    <div 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="flex-1 text-center font-bold text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative"
                    >
                       <span className={activeTab === tab ? 'text-light-text dark:text-white dim:text-dim-text' : ''}>{tab}</span> 
                       {activeTab === tab && <motion.div layoutId="profileTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-twitter-blue rounded-full"></motion.div>}
                    </div>
                ))}
            </div>

            <div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {pinnedTweet && activeTab === 'Tweets' && (
                            <TweetCard key={pinnedTweet.id} tweet={pinnedTweet} isPinned={true} onImageClick={onImageClick}/>
                        )}
                        {displayedTweets.length > 0 ? (
                            displayedTweets.map(tweet => <TweetCard key={tweet.id} tweet={tweet} onImageClick={onImageClick} />)
                        ) : (
                            <p className="text-center p-8 text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
                                {activeTab === 'Likes' && 'This user hasn\'t liked any tweets yet.'}
                                {activeTab === 'Media' && 'This user hasn\'t posted any media yet.'}
                                {activeTab === 'Replies' && 'This user hasn\'t replied to any tweets yet.'}
                                {activeTab === 'Tweets' && 'This user hasn\'t tweeted yet.'}
                            </p>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfilePage;