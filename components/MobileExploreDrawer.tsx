
import React from 'react';
import { motion } from 'framer-motion';
import { CloseIcon, SearchIcon } from './Icon';
import { mockTrendingTopics } from '../data/mockData';
import TrendingTopic from './TrendingTopic';

interface MobileExploreDrawerProps {
  onClose: () => void;
}

const MobileExploreDrawer: React.FC<MobileExploreDrawerProps> = ({ onClose }) => {
  return (
    // FIX: Wrapped framer-motion props to bypass type errors.
    <motion.div
      {...{
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      className="fixed inset-0 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg z-50 flex flex-col"
    >
      <div className="p-2 flex items-center gap-2 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-white/10">
          <CloseIcon />
        </button>
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-light-secondary-text dark:text-twitter-gray">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search"
              autoFocus
              className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-current placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text rounded-full px-10 py-2 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
            />
          </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-xl font-extrabold p-4">Trends for you</h2>
        <div className="grid grid-cols-2 gap-0.5 p-2">
          {mockTrendingTopics.map(topic => (
            <TrendingTopic key={topic.topic} {...topic} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileExploreDrawer;
