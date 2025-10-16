
import React from 'react';
import { mockTrendingTopics, otherUsers } from '../data/mockData';
import TrendingTopic from './TrendingTopic';
import WhoToFollow from './WhoToFollow';

const RightSidebar: React.FC = () => {
  return (
    <aside className="w-[350px] h-screen sticky top-0 py-2 px-4 hidden lg:flex flex-col gap-4">
        <input
            type="text"
            placeholder="Search"
            className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-current placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
        />

        <div className="bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover rounded-2xl">
            <h2 className="text-xl font-bold p-4">What's happening</h2>
            {mockTrendingTopics.map((trend, index) => (
                <TrendingTopic
                key={index}
                category={trend.category}
                topic={trend.topic}
                tweets={trend.tweets}
                />
            ))}
             <div className="p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200">
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
