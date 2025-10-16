import React, { useState, useMemo } from 'react';
import { mockTweets, mockTrendingTopics, otherUsers, mockUser } from '../data/mockData';
import { SearchIcon, RefreshIcon } from '../components/Icon';
import MediaCard from '../components/MediaCard';
import { Tweet, User } from '../types';
import WhoToFollow from '../components/WhoToFollow';

interface ExplorePageProps {
    tweets: Tweet[];
    currentUser: User;
    openSearchModal: () => void;
    onImageClick: (url: string) => void;
    onViewProfile: (user: User) => void;
    onReply: (tweet: Tweet) => void;
    onToggleBookmark: (tweetId: string) => void;
    onLikeTweet: (tweetId: string) => void;
    onTranslateTweet: (tweetId: string) => void;
    onRevertTranslation: (tweetId: string) => void;
}

const ExplorePage: React.FC<ExplorePageProps> = (props) => {
    const { tweets, currentUser, openSearchModal, onImageClick, onViewProfile, onReply, onToggleBookmark, onLikeTweet } = props;
    const [activeTab, setActiveTab] = useState('For You');
    const tabs = ['For You', 'Trending', 'News', 'Sports', 'Entertainment'];
    const [whoToFollowUsers, setWhoToFollowUsers] = useState(() => 
        [...otherUsers].sort(() => 0.5 - Math.random()).slice(0, 3)
    );
    
    const mediaTweets = useMemo(() => tweets.filter(t => t.mediaUrls && t.mediaUrls.length > 0), [tweets]);

    const handleMediaClick = (tweet: Tweet) => {
        if (tweet.mediaUrls && tweet.mediaUrls.length > 0) {
            onImageClick(tweet.mediaUrls[0]);
        }
    };

    const refreshWhoToFollow = () => {
       const shuffled = [...otherUsers].sort(() => 0.5 - Math.random());
       setWhoToFollowUsers(shuffled.slice(0, 3));
    };


    return (
        <div>
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
                <div className="p-2">
                     <div
                        onClick={openSearchModal}
                        className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-light-secondary-text dark:text-twitter-gray rounded-full px-4 py-2 cursor-pointer flex items-center gap-3 hover:bg-light-hover/80 dark:hover:bg-white/5 dim:hover:bg-dim-hover/80 transition-colors"
                    >
                        <SearchIcon />
                        <span>Search</span>
                    </div>
                </div>
                <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <div key={tab} onClick={() => setActiveTab(tab)} className="min-w-[100px] flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative">
                            <span className={activeTab === tab ? 'text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>
                                {tab}
                            </span>
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-twitter-blue rounded-full"></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile-only Who to Follow */}
            <div className="block md:hidden">
                {activeTab === 'For You' && (
                    <div className="border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                       <div className="flex justify-between items-center p-4">
                           <h2 className="text-xl font-extrabold">Who to follow</h2>
                           <button onClick={refreshWhoToFollow} className="p-2 text-twitter-blue hover:bg-twitter-blue/10 rounded-full">
                               <RefreshIcon />
                           </button>
                       </div>
                       {whoToFollowUsers.map(user => (
                           <WhoToFollow 
                               key={user.id} 
                               user={user} 
                               currentUser={mockUser}
                               onFollowToggle={() => {}} // Placeholder: Follow logic is in App.tsx
                               onViewProfile={() => {}} // Placeholder: View profile logic is in App.tsx
                           />
                       ))}
                   </div>
                )}
            </div>
            
            <div className="p-2 md:p-4 columns-1 md:columns-2 gap-3">
                {mediaTweets.map(tweet => (
                    <MediaCard 
                        key={tweet.id} 
                        tweet={tweet} 
                        onMediaClick={handleMediaClick}
                        onViewProfile={onViewProfile}
                        onLikeTweet={onLikeTweet}
                        onReply={onReply}
                        onToggleBookmark={onToggleBookmark}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExplorePage;