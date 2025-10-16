
import React from 'react';
import { mockUser, baseTweets } from '../data/mockData';
import TweetCard from '../components/TweetCard';
import { MoreIcon, CalendarIcon, PinIcon } from '../components/Icon';

interface ProfilePageProps {
  onImageClick: (url: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onImageClick }) => {
  const userTweets = baseTweets.filter(t => t.user.id === mockUser.id);
  const pinnedTweet = userTweets.find(t => t.pinned);

  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-twitter-border">
        <h1 className="text-xl font-bold">{mockUser.displayName}</h1>
        <p className="text-sm text-twitter-gray">{userTweets.length} posts</p>
      </div>

      <div className="relative">
        <div className="h-48 bg-gray-300 dark:bg-gray-700">
          {mockUser.bannerUrl && <img src={mockUser.bannerUrl} alt="banner" className="w-full h-full object-cover" />}
        </div>
        <div className="absolute -bottom-16 left-4 w-32 h-32 rounded-full border-4 border-light-bg dark:border-twitter-dark dim:border-dim-bg">
          <img src={mockUser.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>

      <div className="p-4 border-b border-twitter-border">
        <div className="flex justify-end">
          <button className="p-2 border border-light-border dark:border-twitter-border rounded-full hover:bg-light-hover dark:hover:bg-white/10 mx-2"><MoreIcon /></button>
          <button className="border border-current font-bold px-4 py-1.5 rounded-full hover:bg-light-hover dark:hover:bg-white/10">Edit profile</button>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold">{mockUser.displayName}</h2>
          <p className="text-twitter-gray">@{mockUser.username}</p>
          <p className="my-2">{mockUser.bio}</p>
          <div className="flex items-center text-twitter-gray text-sm gap-2">
            <CalendarIcon />
            <span>Joined July 2024</span>
          </div>
          <div className="flex gap-4 mt-2">
            <p><span className="font-bold">{mockUser.followingCount}</span> <span className="text-twitter-gray">Following</span></p>
            <p><span className="font-bold">{mockUser.followerCount.toLocaleString()}</span> <span className="text-twitter-gray">Followers</span></p>
          </div>
        </div>
      </div>

      <div>
        {pinnedTweet && <TweetCard tweet={pinnedTweet} onImageClick={onImageClick} />}
        {userTweets.filter(t => !t.pinned).map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} onImageClick={onImageClick} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
