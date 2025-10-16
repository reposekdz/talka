import React, { useState } from 'react';
import TrendingTopic from '../components/TrendingTopic';
import { mockTrendingTopics, mockTweets } from '../data/mockData';
import { SearchIcon } from '../components/Icon';

interface ExplorePageProps {
    openSearchModal: () => void;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ openSearchModal }) => {
    const [activeTab, setActiveTab] = useState('For You');
    const tabs = ['For You', 'Trending', 'News', 'Sports', 'Entertainment'];

    return (
        <div>
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
                <div className="p-2">
                     <div
                        onClick={openSearchModal}
                        className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-light-secondary-text dark:text-twitter-gray rounded-full px-4 py-2 cursor-pointer flex items-center gap-3 hover:bg-light-hover/80 dark:hover:bg-white/5 dim:hover:bg-dim-hover/80 transition-colors"
                    >
                        <SearchIcon />
                        <span>Search Proto-Twitter</span>
                    </div>
                </div>
                <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border overflow-x-auto">
                    {tabs.map(tab => (
                        <div key={tab} onClick={() => setActiveTab(tab)} className="min-w-[100px] flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative">
                            <span className={activeTab === tab ? 'text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>
                                {tab}
                            </span>
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-twitter-blue rounded-full"></div>}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                <img src="https://picsum.photos/seed/explore/600/300" alt="Explore header" className="w-full h-auto object-cover"/>
            </div>

            <div>
                <h1 className="text-xl font-bold p-4">Trends for you</h1>
                {mockTrendingTopics.map((trend, index) => (
                    <TrendingTopic
                    key={index}
                    category={trend.category}
                    topic={trend.topic}
                    tweets={trend.tweets}
                    />
                ))}
                <div className="p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer">
                    <a href="#" className="text-twitter-blue">Show more</a>
                </div>
            </div>
        </div>
    );
};

export default ExplorePage;