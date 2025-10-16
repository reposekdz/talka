
import React, { useState } from 'react';
import { User, Tweet, Highlight } from '../types';
import { CalendarIcon, MoreIcon, PinIcon } from '../components/Icon';
import TweetCard from '../components/TweetCard';
import ProfileHighlights from '../components/ProfileHighlights';

interface ProfilePageProps {
  user: User;
  tweets: Tweet[];
  highlights: Highlight[];
  onImageClick: (url: string) => void;
  onViewProfile: (user: User) => void;
  onViewUserList: (user: User, type: 'followers' | 'following') => void;
  onEditProfile: () => void;
  onHighlightClick: (index: number) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const { user, tweets, highlights, onImageClick, onViewProfile, onViewUserList, onEditProfile, onHighlightClick } = props;
  const [activeTab, setActiveTab] = useState('Posts');

  const tabs = ['Posts', 'Replies', 'Highlights', 'Media', 'Likes'];
  const isOwnProfile = user.id === 'u1'; // Mock check

  return (
    <div className="pb-16 sm:pb-0">
      <div className="relative">
        <img src={user.bannerUrl} alt={`${user.displayName}'s banner`} className="w-full h-48 object-cover" />
        <div className="absolute -bottom-16 left-4">
          <img src={user.avatarUrl} alt={user.displayName} className="w-32 h-32 rounded-full border-4 border-light-bg dark:border-twitter-dark dim:border-dim-bg" />
        </div>
      </div>

      <div className="p-4 mt-16 flex justify-end items-center">
        <div className="flex items-center gap-2">
            <button className="p-2 border border-light-border dark:border-twitter-border rounded-full"><MoreIcon /></button>
            {isOwnProfile ? (
                <button onClick={onEditProfile} className="font-bold px-4 py-1.5 rounded-full border border-light-border dark:border-twitter-border hover:bg-light-hover dark:hover:bg-white/10">Edit profile</button>
            ) : (
                <button className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90">Follow</button>
            )}
        </div>
      </div>

      <div className="px-4">
        <h1 className="text-xl font-extrabold">{user.displayName}</h1>
        <p className="text-light-secondary-text dark:text-twitter-gray">@{user.username}</p>
        <p className="my-2">{user.bio}</p>
        <div className="flex items-center gap-4 text-sm text-light-secondary-text dark:text-twitter-gray">
          <div className="flex items-center gap-1"><CalendarIcon /> Joined July 2024</div>
        </div>
        <div className="flex gap-4 mt-2">
            <button onClick={() => onViewUserList(user, 'following')} className="hover:underline"><span className="font-bold text-light-text dark:text-dim-text">{user.followingCount}</span> <span className="text-light-secondary-text dark:text-twitter-gray">Following</span></button>
            <button onClick={() => onViewUserList(user, 'followers')} className="hover:underline"><span className="font-bold text-light-text dark:text-dim-text">{user.followerCount}</span> <span className="text-light-secondary-text dark:text-twitter-gray">Followers</span></button>
        </div>
      </div>
      
      <ProfileHighlights highlights={highlights} isOwnProfile={isOwnProfile} onHighlightClick={onHighlightClick} />

      <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border mt-4">
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
        {tweets.map(tweet => (
            <TweetCard
                key={tweet.id}
                tweet={tweet}
                currentUser={user}
                onImageClick={onImageClick}
                onViewProfile={onViewProfile}
                onReply={() => {}}
                onToggleBookmark={() => {}}
                onVote={() => {}}
                onQuote={() => {}}
                onEdit={() => {}}
                onGrok={() => {}}
                liveReactions={[]}
            />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
