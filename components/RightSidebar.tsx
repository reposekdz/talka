import React, { useState } from 'react';
import WhoToFollow from './WhoToFollow';
import TrendingTopic from './TrendingTopic';
import { mockTrendingTopics } from '../data/mockData';
import { User } from '../types';
import { RefreshIcon, SearchIcon, SparklesIcon, VerifiedIcon } from './Icon';
import { motion } from 'framer-motion';

interface RightSidebarProps {
  onViewProfile: (user: User) => void;
  onFollowToggle: (userId: string) => void;
  currentUser: User;
  otherUsers: User[];
  openAiAssistant: () => void;
}

const PremiumCard: React.FC = () => (
    <motion.div 
        className="bg-premium-gradient rounded-2xl p-4 text-white"
        whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
    >
        <h2 className="text-xl font-extrabold">Subscribe to Premium</h2>
        <p className="my-2 font-semibold">
            Subscribe to unlock new features and if eligible, receive a share of ads revenue.
        </p>
        <motion.button 
            className="bg-white text-black font-bold px-4 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Subscribe
        </motion.button>
    </motion.div>
);

const AiAssistantCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <motion.div 
        className="bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover rounded-2xl p-4 text-center"
        whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
    >
        <SparklesIcon className="w-10 h-10 mx-auto text-twitter-blue" />
        <h2 className="text-xl font-extrabold mt-2">Talka AI</h2>
        <p className="my-2 text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
            Ask questions, summarize threads, and more with the power of AI.
        </p>
        <motion.button 
            onClick={onClick}
            className="bg-twitter-blue text-white font-bold px-4 py-2 rounded-full w-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Ask AI
        </motion.button>
    </motion.div>
);


const RightSidebar: React.FC<RightSidebarProps> = ({ onViewProfile, onFollowToggle, currentUser, otherUsers, openAiAssistant }) => {
  const [whoToFollowUsers, setWhoToFollowUsers] = useState(() => 
    [...otherUsers].sort(() => 0.5 - Math.random()).slice(0, 3)
  );

  const refreshWhoToFollow = () => {
    const shuffled = [...otherUsers].sort(() => 0.5 - Math.random());
    setWhoToFollowUsers(shuffled.slice(0, 3));
  };

  return (
    <aside className="w-[290px] xl:w-[350px] h-screen sticky top-14 px-6 py-4 flex-col gap-4 hidden md:flex overflow-y-auto no-scrollbar">
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
          <span>© 2024 Talka, Inc.</span>
      </footer>
    </aside>
  );
};

export default RightSidebar;