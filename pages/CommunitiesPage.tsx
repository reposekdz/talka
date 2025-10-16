
import React, { useState } from 'react';
import { mockCommunities, mockUser, otherUsers } from '../data/mockData';
import { Community } from '../types';
import CommunityCard from '../components/CommunityCard';
import { SearchIcon, SparklesIcon } from '../components/Icon';
import { motion } from 'framer-motion';


const FeaturedCommunity: React.FC<{ community: Community }> = ({ community }) => (
    <div className="relative rounded-2xl overflow-hidden mb-6 group cursor-pointer">
        <img src={community.bannerUrl} alt={`${community.name} banner`} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <div className="flex items-center gap-4">
                <img src={community.avatarUrl} alt={community.name} className="w-16 h-16 rounded-2xl border-2 border-white/50" />
                <div>
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-yellow-300" />
                        <span className="font-semibold text-sm">Featured Community</span>
                    </div>
                    <h2 className="text-3xl font-extrabold drop-shadow-lg">{community.name}</h2>
                    <p className="text-sm opacity-90 mt-1">{community.memberCount.toLocaleString()} members</p>
                </div>
            </div>
        </div>
    </div>
);

const CommunitiesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Discover');
    const allUsers = [mockUser, ...otherUsers];
    const myCommunities = [mockCommunities[1]]; // Mock user is in one community

    const displayedCommunities = activeTab === 'Discover' ? mockCommunities : myCommunities;

    return (
        <div>
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                <h1 className="text-xl font-bold">Communities</h1>
            </div>
            
            <div className="p-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-light-secondary-text dark:text-twitter-gray">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Search communities"
                        className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-current placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text rounded-full pl-12 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                    />
                </div>
            </div>

            <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border">
              {['Discover', 'Your Communities'].map(tab => (
                  <div key={tab} onClick={() => setActiveTab(tab)} className="flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative">
                      <span className={activeTab === tab ? 'text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>
                          {tab}
                      </span>
                      {/* FIX: Wrapped framer-motion props to bypass type errors. */}
                      {activeTab === tab && <motion.div {...{layoutId:"communityTabIndicator"}} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-twitter-blue rounded-full"></motion.div>}
                  </div>
              ))}
            </div>
            
            <div className="p-4">
                {activeTab === 'Discover' && <FeaturedCommunity community={mockCommunities[0]} />}
                <h2 className="text-xl font-bold mb-4">{activeTab === 'Discover' ? 'Communities to join' : 'Your communities'}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {displayedCommunities.map(community => (
                        <CommunityCard key={community.id} community={community} allUsers={allUsers} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunitiesPage;
