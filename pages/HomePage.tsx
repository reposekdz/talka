import React, { useState } from 'react';
import TweetCard from '../components/TweetCard';
import Composer from '../components/Composer';
import { mockTweets, mockUserStories } from '../data/mockData';
import StoryReel from '../components/StoryReel';
import StoryViewer from '../components/StoryViewer';

interface HomePageProps {
  onImageClick: (url: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onImageClick }) => {
  const [activeTab, setActiveTab] = useState('For You');
  const [storyViewerState, setStoryViewerState] = useState<{ isOpen: boolean; userIndex: number }>({ isOpen: false, userIndex: 0 });

  const openStoryViewer = (userIndex: number) => {
    setStoryViewerState({ isOpen: true, userIndex });
  };

  const closeStoryViewer = () => {
    setStoryViewerState({ isOpen: false, userIndex: 0 });
  };

  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold p-4">Home</h1>
        <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <div 
            onClick={() => setActiveTab('For You')}
            className="flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative"
          >
            <span className={activeTab === 'For You' ? '' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>For You</span>
            {activeTab === 'For You' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-twitter-blue rounded-full"></div>}
          </div>
          <div 
            onClick={() => setActiveTab('Following')}
            className="flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative"
          >
            <span className={activeTab === 'Following' ? '' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>Following</span>
             {activeTab === 'Following' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-twitter-blue rounded-full"></div>}
          </div>
        </div>
      </div>
      
      <Composer />

      <StoryReel userStories={mockUserStories} onStoryClick={openStoryViewer} />
      
      <div>
        {mockTweets.map(tweet => (
          <TweetCard key={tweet.id} tweet={tweet} onImageClick={onImageClick} />
        ))}
      </div>

      {storyViewerState.isOpen && (
        <StoryViewer 
          userStories={mockUserStories} 
          initialUserIndex={storyViewerState.userIndex} 
          onClose={closeStoryViewer} 
        />
      )}
    </div>
  );
};

export default HomePage;