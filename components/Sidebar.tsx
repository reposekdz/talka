import React from 'react';
import { HomeIcon, ExploreIcon, NotificationsIcon, MessagesIcon, ProfileIcon, BookmarkIcon, ListIcon, CommunityIcon, CreateIcon, ReelsIcon } from './Icon';
import { Page } from '../types';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  activeChatCount: number;
  onOpenCreator: (mode?: 'select' | 'story' | 'reel' | 'post') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, activeChatCount, onOpenCreator }) => {
  const navItems = [
    { icon: <HomeIcon isActive={currentPage === Page.Home} />, text: 'Home', page: Page.Home },
    { icon: <ExploreIcon isActive={currentPage === Page.Explore} />, text: 'Explore', page: Page.Explore },
    { icon: <NotificationsIcon isActive={currentPage === Page.Notifications} />, text: 'Notifications', page: Page.Notifications },
    { icon: <MessagesIcon isActive={currentPage === Page.Messages} />, text: 'Messages', page: Page.Messages, notificationCount: activeChatCount },
    { icon: <ReelsIcon isActive={currentPage === Page.Reels} />, text: 'Reels', page: Page.Reels },
    { icon: <ListIcon />, text: 'Lists', page: Page.Lists },
    { icon: <BookmarkIcon isActive={currentPage === Page.Bookmarks} />, text: 'Bookmarks', page: Page.Bookmarks },
    { icon: <CommunityIcon isActive={currentPage === Page.Communities} />, text: 'Communities', page: Page.Communities },
    { icon: <ProfileIcon isActive={currentPage === Page.Profile} />, text: 'Profile', page: Page.Profile },
  ];
  
  return (
    <aside className="w-[88px] xl:w-[275px] h-screen sticky top-14 px-2 flex-col justify-between items-center xl:items-start hidden sm:flex transition-all duration-300">
      <div className="w-full">
        <nav>
          <ul>
            {navItems.map((item) => (
              <li 
                key={item.text} 
                onClick={() => {
                    setCurrentPage(item.page);
                }} 
                className={`flex items-center justify-center xl:justify-start gap-4 text-xl p-3 my-1 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full transition-colors duration-200 w-auto group`}
                >
                <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {item.icon}
                    {item.notificationCount && item.notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-twitter-blue text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {item.notificationCount}
                        </span>
                    )}
                </motion.div>
                <span className={`hidden xl:inline ${currentPage === item.page ? 'font-bold' : ''}`}>{item.text}</span>
              </li>
            ))}
          </ul>
        </nav>
        <motion.button 
            onClick={() => onOpenCreator('select')} 
            className="bg-create-gradient w-14 h-14 xl:w-56 mt-4 text-white font-bold text-lg p-3 rounded-full hover:shadow-lg hover:shadow-twitter-blue/40 transition-all duration-300 animate-pulse-glow"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
            <span className="hidden xl:inline">Create</span>
            <span className="xl:hidden"><CreateIcon /></span>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;