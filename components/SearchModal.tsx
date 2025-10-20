

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockTweets, otherUsers } from '../data/mockData';
import TweetCard from './TweetCard';
import WhoToFollow from './WhoToFollow';
import { Tweet, User, AppSettings } from '../types';
import { SearchIcon } from '../components/Icon';
import SearchFilters from './SearchFilters';

interface SearchModalProps {
  onClose: () => void;
  onImageClick: (urls: string[], index: number) => void;
  onViewProfile: (user: User) => void;
  onGrok: (tweet: Tweet) => void;
  onTranslateTweet: (tweetId: string) => void;
  onPinTweet: (tweetId: string) => void;
  onFeatureTweet: (tweetId: string) => void;
  onOpenChat: (user: User) => void;
  onLikeTweet: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onDeleteTweet: (tweetId: string) => void;
  liveReactions: { id: number; emoji: string; tweetId: string }[];
  appSettings: AppSettings;
  currentUser: User;
}

type SearchResult = Tweet | User;

const SearchModal: React.FC<SearchModalProps> = (props) => {
  const { onClose, onImageClick, onViewProfile, onGrok, onTranslateTweet, onPinTweet, onFeatureTweet, onOpenChat, onLikeTweet, onRetweet, onDeleteTweet, liveReactions, appSettings, currentUser } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Top');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const tabs = ['Top', 'Latest', 'People', 'Photos', 'Videos'];

  const handleProfileClick = (user: User) => {
    onViewProfile(user);
    onClose();
  };

  const handleToggleFilter = (filter: string) => {
      setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  }

  const results = useMemo((): SearchResult[] => {
    if (!searchTerm.trim()) return [];
    
    const lowerCaseSearch = searchTerm.toLowerCase();

    const tweetResults = mockTweets.filter(tweet => 
      tweet.content.toLowerCase().includes(lowerCaseSearch) ||
      tweet.user.displayName.toLowerCase().includes(lowerCaseSearch) ||
      tweet.user.username.toLowerCase().includes(lowerCaseSearch)
    );

    const userResults = otherUsers.filter(user => 
      user.displayName.toLowerCase().includes(lowerCaseSearch) ||
      user.username.toLowerCase().includes(lowerCaseSearch)
    );
    
    let combinedResults: SearchResult[] = [];

    switch(activeTab) {
      case 'Latest':
        combinedResults = tweetResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'People':
        combinedResults = userResults;
        break;
      case 'Photos':
        combinedResults = tweetResults.filter(t => t.mediaUrls && t.mediaUrls.some(url => !url.endsWith('.mp4')));
        break;
      case 'Videos':
        combinedResults = tweetResults.filter(t => t.mediaUrls && t.mediaUrls.some(url => url.endsWith('.mp4')));
        break;
      case 'Top':
      default:
        combinedResults = [...userResults, ...tweetResults];
        break;
    }

    if (activeFilters.includes("From people you follow")) {
        return combinedResults.filter(item => {
            const userId = 'content' in item ? item.user.id : item.id;
            return currentUser.followingIds.includes(userId);
        });
    }

    return combinedResults;

  }, [searchTerm, activeTab, activeFilters, currentUser.followingIds]);
  
  const commonTweetCardProps = {
    currentUser: currentUser,
    onImageClick,
    onViewProfile: handleProfileClick,
    onReply: () => {},
    onToggleBookmark: () => {},
    onVote: () => {},
    onQuote: () => {},
    onEdit: () => {},
    onGrok,
    onTranslateTweet,
    onPinTweet,
    onFeatureTweet,
    onOpenChat,
    onLikeTweet,
    onRetweet,
    onDeleteTweet,
    liveReactions,
    appSettings,
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg w-full h-full sm:max-w-[600px] sm:h-[90vh] sm:mt-4 sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-2 pr-4 flex items-center gap-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full">✕</button>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-light-secondary-text dark:text-twitter-gray">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-current placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text rounded-full px-10 py-2 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
            />
          </div>
        </div>

        {searchTerm.trim() && (
            <SearchFilters activeFilters={activeFilters} onToggleFilter={handleToggleFilter} />
        )}
        
        <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          {tabs.map(tab => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative"
            >
              <span className={activeTab === tab ? 'text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>
                {tab}
              </span>
              {activeTab === tab && <motion.div layoutId="searchTabIndicator" className="absolute bottom-0 left-0 right-0 h-1 bg-twitter-blue rounded-full" transition={{ type: "spring", stiffness: 350, damping: 30 }}></motion.div>}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {searchTerm.trim() === '' ? (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center p-16 text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
                <h2 className="text-xl font-bold mb-2">Try searching for people, keywords, or topics</h2>
                <p>Find what's happening on Talka.</p>
              </motion.div>
            ) : results.length > 0 ? (
              results.map(item => {
                if ('content' in item) { 
                  return <TweetCard key={`tweet-${item.id}`} tweet={item} {...commonTweetCardProps} />;
                } else {
                  return <WhoToFollow key={`user-${item.id}`} user={item} currentUser={currentUser} onFollowToggle={() => {}} onViewProfile={handleProfileClick} />;
                }
              })
            ) : (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center p-16 text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
                <h2 className="text-xl font-bold mb-2">No results for "{searchTerm}"</h2>
                <p>The term you entered did not bring up any results. You may have mistyped your term.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchModal;