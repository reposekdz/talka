
import React from 'react';
import { HomeIcon, ExploreIcon, MessagesIcon, ReelsIcon, NotificationsIcon, PlusIcon } from './Icon';
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
        className="relative flex-1 flex flex-col items-center justify-center gap-1 text-light-secondary-text dark:text-twitter-gray focus:outline-none"
    >
        <div className={`w-8 h-8 flex items-center justify-center transition-transform duration-200 ${currentPage === page ? 'text-light-text dark:text-dim-text -translate-y-1' : ''}`}>
           {icon}
        </div>
        {notificationCount && notificationCount > 0 && (
             <span className="absolute top-1 right-[25%] bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-light-bg dark:border-twitter-dark">
                {notificationCount}
            </span>
        )}
        {currentPage === page && <motion.div layoutId="bottom-nav-indicator" className="h-1 w-1 bg-current rounded-full mt-1"></motion.div>}
    </button>
);


const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage, currentUser, activeChatCount, notificationCount, onOpenComposer }) => {
  const navItems = [
    { page: Page.Home, icon: <HomeIcon isActive={currentPage === Page.Home} /> },
    { page: Page.Explore, icon: <ExploreIcon isActive={currentPage === Page.Explore}/> },
    { page: 'POST', icon: null }, // Placeholder for the FAB
    { page: Page.Notifications, icon: <NotificationsIcon isActive={currentPage === Page.Notifications} />, notificationCount: notificationCount },
    { page: Page.Messages, icon: <MessagesIcon isActive={currentPage === Page.Messages} />, notificationCount: activeChatCount },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-30 sm:hidden border-t border-light-border dark:border-twitter-border dim:border-dim-border">
      <nav className="container mx-auto flex justify-around items-center h-full max-w-[600px] relative">
        {navItems.map((item, index) => {
            if (item.page === 'POST') {
                return (
                     <div key="post-fab" className="w-16 h-16 -translate-y-6">
                        <button onClick={onOpenComposer} className="w-full h-full bg-twitter-blue rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-105 transition-transform">
                           <PlusIcon className="w-7 h-7"/>
                        </button>
                    </div>
                )
            }
          return <NavItem key={item.page} page={item.page as Page} currentPage={currentPage} setCurrentPage={setCurrentPage} icon={item.icon} notificationCount={item.notificationCount}/>
        })}
      </nav>
    </footer>
  );
};

export default BottomNav;
