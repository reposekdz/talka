import React from 'react';
import { HomeIcon, ExploreIcon, MessagesIcon, ReelsIcon, ProfileIcon } from './Icon';
import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { page: Page.Home, icon: <HomeIcon /> },
    { page: Page.Explore, icon: <ExploreIcon /> },
    { page: Page.Messages, icon: <MessagesIcon /> },
    { page: Page.Reels, icon: <ReelsIcon /> },
    { page: Page.Profile, icon: <ProfileIcon /> },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-30 sm:hidden border-t border-light-border dark:border-twitter-border dim:border-dim-border">
      <nav className="container mx-auto flex justify-around items-center h-full max-w-[600px]">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`flex-1 flex justify-center items-center p-2 ${currentPage === item.page ? 'text-current font-bold' : 'text-light-secondary-text dark:text-twitter-gray'}`}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default BottomNav;
