import React from 'react';
import { HomeIcon, ExploreIcon, MessagesIcon, PlusIcon, ProfileIcon } from './Icon';
import { Page, User } from '../types';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  currentUser: User;
  activeChatCount: number;
  notificationCount: number;
  onOpenComposer: () => void;
}

const NavItem: React.FC<{
    page: Page,
    currentPage: Page,
    setCurrentPage: (page: Page) => void,
    icon: React.ReactNode,
    notificationCount?: number
}> = ({ page, currentPage, setCurrentPage, icon, notificationCount }) => (
    <button
        onClick={() => setCurrentPage(page)}
        className="relative flex-1 flex flex-col items-center justify-center gap-1 text-light-secondary-text dark:text-twitter-gray focus:outline-none h-full"
    >
        <div className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ${currentPage === page ? 'text-light-text dark:text-dim-text' : ''}`}>
           {icon}
        </div>
        {notificationCount && notificationCount > 0 && (
             <span className="absolute top-1 right-[25%] bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-light-bg dark:border-twitter-dark">
                {notificationCount}
            </span>
        )}
    </button>
);


const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage, activeChatCount, onOpenComposer }) => {
  const navItems = [
    { page: Page.Home, icon: <HomeIcon isActive={currentPage === Page.Home} /> },
    { page: Page.Explore, icon: <ExploreIcon isActive={currentPage === Page.Explore}/> },
    { page: Page.Messages, icon: <MessagesIcon isActive={currentPage === Page.Messages} />, notificationCount: activeChatCount },
    { page: Page.Profile, icon: <ProfileIcon /> },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-30 sm:hidden border-t border-light-border dark:border-twitter-border dim:border-dim-border">
      <div className="container mx-auto h-full max-w-[600px] relative">
        <nav className="flex justify-around items-center h-full">
            <NavItem page={navItems[0].page} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={navItems[0].icon} />
            <NavItem page={navItems[1].page} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={navItems[1].icon} />
            <div className="w-16" /> {/* Spacer for FAB */}
            <NavItem page={navItems[2].page} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={navItems[2].icon} notificationCount={navItems[2].notificationCount}/>
            <NavItem page={navItems[3].page} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={navItems[3].icon} />
        </nav>
        <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2">
            <button onClick={onOpenComposer} className="w-16 h-16 bg-twitter-blue rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-105 active:scale-95 transition-transform">
               <PlusIcon className="w-8 h-8"/>
            </button>
        </div>
      </div>
    </footer>
  );
};

export default BottomNav;