import React, { useState, useMemo } from 'react';
import { mockHighlights, baseTweets } from '../data/mockData';
import TweetCard from '../components/TweetCard';
import { MoreIcon, CalendarIcon, ChevronLeftIcon, MessagesIcon } from '../components/Icon';
import ProfileHighlights from '../components/ProfileHighlights';
import { Tweet, User, Highlight } from '../types';
import { motion } from 'framer-motion';

interface ProfilePageProps {
  user: User;
  currentUser: User;
  tweets: Tweet[];
  onImageClick: (url: string) => void;
  onBack: () => void;
  onViewProfile: (user: User) => void;
  onFollowToggle: (userId: string) => void;
  onViewUserList: (user: User, type: 'followers' | 'following') => void;
  onOpenChat: (user: User) => void;
  onReply: (tweet: Tweet) => void;
  onToggleBookmark: (tweetId: string) => void;
  onVote: (tweetId: string, optionId: string) => void;
  onQuote: (tweet: Tweet) => void;
  onEdit: (tweet: Tweet) => void;
  onHighlightClick: (highlights: Highlight[], index: number) => void;
  onGrok: (tweet: Tweet) => void;
  onLikeTweet: (tweetId: string) => void;
  onTranslateTweet: (tweetId: string) => void;
  onRevertTranslation: (tweetId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const { user, currentUser, tweets, onImageClick, onBack, onViewProfile, onFollowToggle, onViewUserList, onOpenChat, onReply, onToggleBookmark, onVote, onQuote, onEdit, onHighlightClick, onGrok, onLikeTweet, onTranslateTweet, onRevertTranslation } = props;
  const [activeTab, setActiveTab] = useState('Posts');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photos' | 'videos'>('all');
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);
  
  const userTweets = tweets;
  const isCurrentUserProfile = user.id === currentUser.id;
  const isFollowing = currentUser.followingIds.includes(user.id);
  const isFollowedBy = user.followerIds.includes(currentUser.id);
  
  const tabs = ['Posts', 'Replies', 'Media', 'Likes'];
  
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFollowToggle(user.id);
  };
  
  const mediaTweets = useMemo(() => {
    if (activeTab !== 'Media') return [];
    if (mediaFilter === 'all') {
      return userTweets.filter(t => t.mediaUrls && t.mediaUrls.length > 0);
    }
    if (mediaFilter === 'photos') {
      return userTweets.filter(t => t.mediaUrls && t.mediaUrls.length > 0 && !t.mediaUrls.some(url => url.endsWith('.mp4')));
    }
    if (mediaFilter === 'videos') {
      return userTweets.filter(t => t.mediaUrls && t.mediaUrls.some(url => url.endsWith('.mp4')));
    }
    return [];
  }, [activeTab, mediaFilter, userTweets]);


  const renderFollowButton = () => {
    if (isCurrentUserProfile) {
      return <button className="border border-current font-bold px-4 py-1.5 rounded-full hover:bg-light-hover dark:hover:bg-white/10">Edit profile</button>;
    }
    
    const text = isFollowing ? (isHoveringFollow ? 'Unfollow' : 'Following') : 'Follow';
    const classes = isFollowing
      ? `border font-bold px-4 py-1.5 rounded-full transition-colors duration-200 ${isHoveringFollow ? 'bg-red-500/10 text-red-500 border-red-500' : 'bg-transparent border-current'}`
      : 'border bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90';

    return (
      <button 
        className={classes} 
        onClick={handleFollowClick}
        onMouseEnter={() => setIsHoveringFollow(true)}
        onMouseLeave={() => setIsHoveringFollow(false)}
      >
        {text}
      </button>
    );
  };
  
  const renderContent = () => {
    const tweetCards = (tweetsToRender: Tweet[]) => 
      tweetsToRender.map(tweet => (
        <TweetCard key={tweet.id} tweet={tweet} currentUser={currentUser} onImageClick={onImageClick} onViewProfile={onViewProfile} onReply={onReply} onToggleBookmark={onToggleBookmark} onVote={onVote} onQuote={onQuote} onEdit={onEdit} liveReactions={[]} onGrok={onGrok} onLikeTweet={onLikeTweet} onTranslateTweet={onTranslateTweet} onRevertTranslation={onRevertTranslation} />
      ));

    switch (activeTab) {
      case 'Posts':
        return tweetCards(userTweets);
      case 'Media':
        return (
          <>
            <div className="flex justify-around border-b border-light-border dark:border-twitter-border dim:border-dim-border">
              {(['all', 'photos', 'videos'] as const).map(filter => (
                <button key={filter} onClick={() => setMediaFilter(filter)} className={`flex-1 p-3 text-sm font-bold ${mediaFilter === filter ? 'text-twitter-blue border-b-2 border-twitter-blue' : 'text-light-secondary-text dark:text-twitter-gray'}`}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            {mediaTweets.length > 0 ? tweetCards(mediaTweets) : <div className="p-8 text-center text-twitter-gray">This user hasn't posted any media of this type.</div>}
          </>
        )
      case 'Highlights':
        return <ProfileHighlights highlights={mockHighlights} isOwnProfile={isCurrentUserProfile} onHighlightClick={(index) => onHighlightClick(mockHighlights, index)} />;
      default:
        return (
          <div className="p-8 text-center text-twitter-gray">
            Content for {activeTab} would be displayed here.
          </div>
        );
    }
  }
  
  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-2 flex items-center gap-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <button onClick={onBack} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><ChevronLeftIcon /></button>
        <div>
          <h1 className="text-xl font-bold">{user.displayName}</h1>
          <p className="text-sm text-twitter-gray">{userTweets.length} posts</p>
        </div>
      </div>

      <div className="relative">
        <div className="h-48 bg-gray-300 dark:bg-gray-700">
          {user.bannerUrl && <img src={user.bannerUrl} alt="banner" className="w-full h-full object-cover" />}
        </div>
        <div className="absolute -bottom-16 left-4 w-32 h-32 rounded-full border-4 border-light-bg dark:border-twitter-dark dim:border-dim-bg">
          <img src={user.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>

      <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <div className="flex justify-end items-center gap-2 flex-wrap">
          {!isCurrentUserProfile && (
            <button onClick={() => onOpenChat(user)} className="p-2 border border-light-border dark:border-twitter-border rounded-full hover:bg-light-hover dark:hover:bg-white/10"><MessagesIcon /></button>
          )}
          <button className="p-2 border border-light-border dark:border-twitter-border rounded-full hover:bg-light-hover dark:hover:bg-white/10"><MoreIcon /></button>
          {renderFollowButton()}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold">{user.displayName}</h2>
          <div className="flex items-center gap-2">
            <p className="text-twitter-gray">@{user.username}</p>
            {!isCurrentUserProfile && isFollowedBy && <span className="bg-light-hover dark:bg-white/10 text-xs px-2 py-0.5 rounded-md text-light-secondary-text dark:text-dim-secondary-text">Follows you</span>}
          </div>
          <p className="my-2">{user.bio}</p>
          <div className="flex items-center text-twitter-gray text-sm gap-2">
            <CalendarIcon />
            <span>Joined July 2024</span>
          </div>
          <div className="flex gap-4 mt-2 flex-wrap">
            <button onClick={() => onViewUserList(user, 'following')} className="hover:underline">
                <span className="font-bold text-light-text dark:text-white">{user.followingCount}</span> 
                <span className="text-twitter-gray"> Following</span>
            </button>
            <button onClick={() => onViewUserList(user, 'followers')} className="hover:underline">
                <span className="font-bold text-light-text dark:text-white">{user.followerCount.toLocaleString()}</span> 
                <span className="text-twitter-gray"> Followers</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          {tabs.map(tab => (
              <div key={tab} onClick={() => setActiveTab(tab)} className="flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative">
                  <span className={activeTab === tab ? 'text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>
                      {tab}
                  </span>
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-twitter-blue rounded-full"></div>}
              </div>
          ))}
      </div>
      
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePage;