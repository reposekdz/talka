import React, { useState } from 'react';
import { User, Tweet, Highlight } from '../types';
import { CalendarIcon, MoreIcon, PinIcon, MessagesIcon } from '../components/Icon';
import TweetCard from '../components/TweetCard';
import ProfileHighlights from '../components/ProfileHighlights';
import TweetSkeleton from '../components/TweetSkeleton';

interface ProfilePageProps {
  user: User;
  tweets: Tweet[];
  highlights: Highlight[];
  onImageClick: (url: string) => void;
  onViewProfile: (user: User) => void;
  onViewUserList: (user: User, type: 'followers' | 'following') => void;
  onEditProfile: () => void;
  onOpenCreateHighlight: () => void;
  onHighlightClick: (highlight: Highlight) => void;
  onTranslateTweet: (tweetId: string) => void;
  onGrok: (tweet: Tweet) => void;
  onPinTweet: (tweetId: string) => void;
  onOpenChat: (user: User) => void;
  onLikeTweet: (tweetId: string) => void;
  liveReactions: { id: number; emoji: string; tweetId: string }[];
}

const TWEETS_PER_PAGE = 10;

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const { user, tweets, highlights, onImageClick, onViewProfile, onViewUserList, onEditProfile, onOpenCreateHighlight, onHighlightClick, onTranslateTweet, onGrok, onPinTweet, onOpenChat, onLikeTweet, liveReactions } = props;
  const [activeTab, setActiveTab] = useState('Posts');
  const [visibleCount, setVisibleCount] = useState(TWEETS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const isOwnProfile = user.id === 'u1'; // Mock check
  const pinnedTweet = tweets.find(t => t.pinned);
  const feedTweets = tweets.filter(t => !t.pinned);

  const visibleTweets = feedTweets.slice(0, visibleCount);
  const hasMore = visibleCount < feedTweets.length;

  const loadMore = () => {
      setIsLoadingMore(true);
      setTimeout(() => {
          setVisibleCount(prev => Math.min(prev + TWEETS_PER_PAGE, feedTweets.length));
          setIsLoadingMore(false);
      }, 1000);
  };

  const tabs = ['Posts', 'Replies', 'Highlights', 'Media', 'Likes'];

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
            <button className="p-2 border border-light-border dark:border-twitter-border rounded-full hover:bg-light-hover dark:hover:bg-white/10"><MoreIcon /></button>
            {isOwnProfile ? (
                <button onClick={onEditProfile} className="font-bold px-4 py-1.5 rounded-full border border-light-border dark:border-twitter-border hover:bg-light-hover dark:hover:bg-white/10">Edit profile</button>
            ) : (
                <>
                    <button onClick={() => onOpenChat(user)} className="p-2 border border-light-border dark:border-twitter-border rounded-full hover:bg-light-hover dark:hover:bg-white/10"><MessagesIcon className="w-5 h-5" /></button>
                    <button className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90">Follow</button>
                </>
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
      
      <ProfileHighlights highlights={highlights} isOwnProfile={isOwnProfile} onHighlightClick={onHighlightClick} onOpenCreateHighlight={onOpenCreateHighlight} />

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
        {pinnedTweet && (
           <div className="border-b border-light-border dark:border-twitter-border dim:border-dim-border">
               <div className="text-xs text-light-secondary-text dark:text-twitter-gray flex items-center gap-2 px-4 pt-2">
                   <PinIcon />
                   <span>Pinned Post</span>
               </div>
               <TweetCard
                   key={pinnedTweet.id}
                   tweet={pinnedTweet}
                   currentUser={user}
                   onImageClick={onImageClick}
                   onViewProfile={onViewProfile}
                   onReply={() => {}}
                   onToggleBookmark={() => {}}
                   onVote={() => {}}
                   onQuote={() => {}}
                   onEdit={() => {}}
                   onGrok={onGrok}
                   onTranslateTweet={onTranslateTweet}
                   onPinTweet={onPinTweet}
                   onOpenChat={onOpenChat}
                   onLikeTweet={onLikeTweet}
                   liveReactions={liveReactions}
               />
           </div>
        )}
        {visibleTweets.map(tweet => (
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
                onGrok={onGrok}
                onTranslateTweet={onTranslateTweet}
                onPinTweet={onPinTweet}
                onOpenChat={onOpenChat}
                onLikeTweet={onLikeTweet}
                liveReactions={liveReactions}
            />
        ))}
         {isLoadingMore && Array.from({ length: 3 }).map((_, i) => <TweetSkeleton key={`loading-${i}`} />)}
        {hasMore && !isLoadingMore && (
            <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border text-center">
                <button
                    onClick={loadMore}
                    className="text-twitter-blue hover:underline font-semibold"
                >
                    Show more
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;