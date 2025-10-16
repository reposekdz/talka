import React from 'react';
import { HomeIcon, ExploreIcon, MessagesIcon, ReelsIcon } from './Icon';
import { Page, User } from '../types';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User;
  activeChatCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage, currentUser, activeChatCount }) => {
  const navItems = [
    { page: Page.Home, icon: <HomeIcon /> },
    { page: Page.Explore, icon: <ExploreIcon /> },
    { page: Page.Messages, icon: <MessagesIcon />, notificationCount: activeChatCount },
    { page: Page.Reels, icon: <ReelsIcon /> },
    { 
      page: Page.Profile, 
      icon: (
        <img 
          src={currentUser.avatarUrl} 
          alt="Profile"
          className={`w-6 h-6 rounded-full object-cover transition-all duration-200 ${currentPage === Page.Profile ? 'ring-2 ring-twitter-blue' : ''}`}
        />
      ) 
    },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-30 sm:hidden border-t border-light-border dark:border-twitter-border dim:border-dim-border">
      <nav className="container mx-auto flex justify-around items-center h-full max-w-[600px]">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`flex-1 flex justify-center items-center p-2 h-full ${currentPage === item.page ? 'text-current font-bold' : 'text-light-secondary-text dark:text-twitter-gray'}`}
          >
            <div className="relative">
              {item.icon}
              {item.notificationCount && item.notificationCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-twitter-blue text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {item.notificationCount}
                  </span>
              )}
            </div>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default BottomNav;