
import React from 'react';
import { mockTrendingTopics, otherUsers } from '../data/mockData';
import TrendingTopic from './TrendingTopic';
import WhoToFollow from './WhoToFollow';
import { SearchIcon } from './Icon';

interface RightSidebarProps {
  openSearchModal: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ openSearchModal }) => {
  return (
    <aside className="w-[350px] h-screen sticky top-0 py-2 px-4 hidden lg:flex flex-col gap-4">
        <div
            onClick={openSearchModal}
            className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-light-secondary-text dark:text-twitter-gray rounded-full px-4 py-2 cursor-pointer flex items-center gap-3 hover:bg-light-hover/80 dark:hover:bg-white/5 dim:hover:bg-dim-hover/80 transition-colors"
        >
            <SearchIcon />
            <span>Search</span>
        </div>

        <div className="bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover rounded-2xl">
            <h2 className="text-xl font-bold p-4">What's happening</h2>
            <div className="grid grid-cols-2 gap-2 p-2">
                {mockTrendingTopics.slice(0, 4).map((trend, index) => (
                    <TrendingTopic
                        key={index}
                        category={trend.category}
                        topic={trend.topic}
                        tweets={trend.tweets}
                        imageUrl={trend.imageUrl}
                    />
                ))}
            </div>
             <div className="p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200 rounded-b-2xl">
                <a href="#" className="text-twitter-blue">Show more</a>
            </div>
        </div>

        <div className="bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover rounded-2xl">
            <h2 className="text-xl font-bold p-4">Who to follow</h2>
            {otherUsers.slice(0, 3).map(user => (
                <WhoToFollow key={user.id} user={user} />
            ))}
            <div className="p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200">
                <a href="#" className="text-twitter-blue">Show more</a>
            </div>
        </div>
        
        <footer className="text-xs text-twitter-gray space-x-2">
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