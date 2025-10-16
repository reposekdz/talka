
import React, { useState } from 'react';
import WhoToFollow from './WhoToFollow';
import TrendingTopic from './TrendingTopic';
import { mockTrendingTopics } from '../data/mockData';
import { User } from '../types';
import { RefreshIcon, SearchIcon, SparklesIcon, VerifiedIcon } from './Icon';

interface RightSidebarProps {
  openSearchModal: () => void;
  onViewProfile: (user: User) => void;
  onFollowToggle: (userId: string) => void;
  currentUser: User;
  otherUsers: User[];
  openAiAssistant: () => void;
}

const PremiumCard: React.FC = () => (
    <div className="bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover rounded-2xl p-4">
        <h2 className="text-xl font-extrabold">Subscribe to Premium</h2>
        <p className="my-2 font-semibold">
            Subscribe to unlock new features and if eligible, receive a share of ads revenue.
        </p>
        <button className="bg-twitter-blue text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90">
            Subscribe
        </button>
    </div>
);

const AiAssistantCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div className="bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover rounded-2xl p-4 text-center">
        <SparklesIcon className="w-10 h-10 mx-auto text-twitter-blue" />
        <h2 className="text-xl font-extrabold mt-2">Proto-AI Assistant</h2>
        <p className="my-2 text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
            Ask questions, summarize threads, and more with the power of AI.
        </p>
        <button 
            onClick={onClick}
            className="bg-twitter-blue text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90 w-full"
        >
            Ask AI
        </button>
    </div>
);


const RightSidebar: React.FC<RightSidebarProps> = ({ openSearchModal, onViewProfile, onFollowToggle, currentUser, otherUsers, openAiAssistant }) => {
  const [whoToFollowUsers, setWhoToFollowUsers] = useState(() => 
    [...otherUsers].sort(() => 0.5 - Math.random()).slice(0, 3)
  );

  const refreshWhoToFollow = () => {
    const shuffled = [...otherUsers].sort(() => 0.5 - Math.random());
    setWhoToFollowUsers(shuffled.slice(0, 3));
  };

  return (
    <aside className="w-[250px] lg:w-[290px] xl:w-[350px] h-screen sticky top-0 px-6 py-2 flex-col gap-4 hidden md:flex overflow-y-auto no-scrollbar">
      <div
        onClick={openSearchModal}
        className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-light-secondary-text dark:text-twitter-gray rounded-full px-4 py-2 cursor-pointer flex items-center gap-3 hover:bg-light-hover/80 dark:hover:bg-white/5 dim:hover:bg-dim-hover/80 transition-colors sticky top-0 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg z-10 -mt-2 pt-4 pb-2"
      >
        <SearchIcon />
        <span>Search</span>
      </div>

      <PremiumCard />

      <AiAssistantCard onClick={openAiAssistant} />

      <div className="bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover rounded-2xl">
        <h2 className="text-xl font-extrabold p-4">Trends for you</h2>
        <div className="grid grid-cols-2 gap-0.5">
          {mockTrendingTopics.map(topic => (
            <TrendingTopic key={topic.topic} {...topic} />
          ))}
        </div>
        <div className="p-4 text-twitter-blue hover:bg-white/5 cursor-pointer rounded-b-2xl">
          Show more
        </div>
      </div>
      
      <div className="bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover rounded-2xl">
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
            currentUser={currentUser}
            onFollowToggle={onFollowToggle}
            onViewProfile={onViewProfile}
          />
        ))}
        <div className="p-4 text-twitter-blue hover:bg-white/5 cursor-pointer rounded-b-2xl">
          Show more
        </div>
      </div>

      <footer className="text-xs text-twitter-gray space-x-2 pb-4">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">More...</a>
          <span>© 2024 Proto-Twitter, Inc.</span>
      </footer>
    </aside>
  );
};

export default RightSidebar;
