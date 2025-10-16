import React, { useState } from 'react';
import { mockUser, baseTweets } from '../data/mockData';
import TweetCard from '../components/TweetCard';
import { MoreIcon, CalendarIcon, ChevronLeftIcon, MessagesIcon } from '../components/Icon';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  currentUser: User;
  onImageClick: (url: string) => void;
  onBack: () => void;
  onViewProfile: (user: User) => void;
  onFollowToggle: (userId: string) => void;
  onViewUserList: (user: User, type: 'followers' | 'following') => void;
  onOpenChat: (user: User) => void;
  onReply: (tweet: any) => void;
  onToggleBookmark: (tweetId: string) => void;
  onVote: (tweetId: string, optionId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const { user, currentUser, onImageClick, onBack, onViewProfile, onFollowToggle, onViewUserList, onOpenChat, onReply, onToggleBookmark, onVote } = props;
  const [activeTab, setActiveTab] = useState('Posts');
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);
  const [subscriptionsEnabled, setSubscriptionsEnabled] = useState(false);
  const [tipsEnabled, setTipsEnabled] = useState(false);
  
  const userTweets = baseTweets.filter(t => t.user.id === user.id);
  const isCurrentUserProfile = user.id === currentUser.id;
  const isFollowing = currentUser.followingIds.includes(user.id);
  
  const tabs = isCurrentUserProfile ? ['Posts', 'Replies', 'Media', 'Likes', 'Monetization'] : ['Posts', 'Replies', 'Media', 'Likes'];
  
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFollowToggle(user.id);
  };

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
  
  const renderMonetizationTab = () => (
    <div className="p-8 text-center">
        <h2 className="text-3xl font-extrabold mb-2">You haven't earned any money yet</h2>
        <p className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text max-w-md mx-auto mb-6">
            When you do, it'll show up here. Explore monetization options to start earning.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-light-hover dark:bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold">Subscriptions</h3>
                <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-1">
                    {subscriptionsEnabled
                        ? 'Manage your subscription offerings and view your monthly earnings.'
                        : 'Offer monthly subscriptions to your most engaged followers for exclusive content.'
                    }
                </p>
                {subscriptionsEnabled ? (
                    <div className="mt-4">
                        <p className="text-lg font-bold">Status: <span className="text-green-400">Active</span></p>
                        <p className="text-sm">Monthly Price: $4.99</p>
                         <button onClick={() => setSubscriptionsEnabled(false)} className="mt-2 bg-red-500/80 text-white font-bold py-2 px-4 rounded-full text-sm w-full">Disable Subscriptions</button>
                    </div>
                ) : (
                    <button onClick={() => setSubscriptionsEnabled(true)} className="mt-4 bg-twitter-blue text-white font-bold py-2 px-4 rounded-full text-sm">Set up Subscriptions</button>
                )}
            </div>
            <div className="bg-light-hover dark:bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold">Tips</h3>
                <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-1">
                    {tipsEnabled
                        ? 'Your tips are enabled. Followers can now send you money directly.'
                        : 'Allow your followers to show their support by sending you one-time tips.'
                    }
                </p>
                 {tipsEnabled ? (
                     <div className="mt-4">
                        <p className="text-lg font-bold">Status: <span className="text-green-400">Active</span></p>
                        <p className="text-sm">Total Tipped: $125.00</p>
                         <button onClick={() => setTipsEnabled(false)} className="mt-2 bg-red-500/80 text-white font-bold py-2 px-4 rounded-full text-sm w-full">Disable Tips</button>
                    </div>
                 ) : (
                    <button onClick={() => setTipsEnabled(true)} className="mt-4 bg-twitter-blue text-white font-bold py-2 px-4 rounded-full text-sm">Enable Tips</button>
                 )}
            </div>
        </div>
    </div>
  );


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
        <div className="flex justify-end items-center gap-2">
          {!isCurrentUserProfile && (
            <button onClick={() => onOpenChat(user)} className="p-2 border border-light-border dark:border-twitter-border rounded-full hover:bg-light-hover dark:hover:bg-white/10"><MessagesIcon /></button>
          )}
          <button className="p-2 border border-light-border dark:border-twitter-border rounded-full hover:bg-light-hover dark:hover:bg-white/10"><MoreIcon /></button>
          {renderFollowButton()}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold">{user.displayName}</h2>
          <p className="text-twitter-gray">@{user.username}</p>
          <p className="my-2">{user.bio}</p>
          <div className="flex items-center text-twitter-gray text-sm gap-2">
            <CalendarIcon />
            <span>Joined July 2024</span>
          </div>
          <div className="flex gap-4 mt-2">
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
        {activeTab === 'Posts' && userTweets.map(tweet => (
          <TweetCard 
            key={tweet.id} 
            tweet={tweet} 
            onImageClick={onImageClick} 
            onViewProfile={onViewProfile}
            onReply={onReply}
            onToggleBookmark={onToggleBookmark}
            onVote={onVote}
          />
        ))}
        {activeTab === 'Monetization' && renderMonetizationTab()}
        {activeTab !== 'Posts' && activeTab !== 'Monetization' && (
            <div className="p-8 text-center text-twitter-gray">
                Content for {activeTab} would be displayed here.
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;