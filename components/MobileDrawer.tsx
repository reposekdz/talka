import React from 'react';
import { motion } from 'framer-motion';
import { User, Page } from '../types';
import { CloseIcon, ProfileIcon, BookmarkIcon, ListIcon, CommunityIcon, SettingsIcon, HelpIcon, NotificationsIcon } from './Icon';

interface MobileDrawerProps {
  user: User;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  notificationCount: number;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ user, onClose, onNavigate, notificationCount }) => {
  const navItems = [
    { icon: <ProfileIcon />, text: 'Profile', page: Page.Profile },
    { icon: <NotificationsIcon />, text: 'Notifications', page: Page.Notifications, count: notificationCount },
    { icon: <BookmarkIcon />, text: 'Bookmarks', page: Page.Bookmarks },
    { icon: <ListIcon />, text: 'Lists', page: Page.Lists },
    { icon: <CommunityIcon />, text: 'Communities', page: Page.Communities },
  ];

  const bottomNavItems = [
    { icon: <SettingsIcon />, text: 'Settings and privacy', page: Page.Settings },
    { icon: <HelpIcon />, text: 'Help Center', page: Page.HelpCenter },
  ];

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-0 left-0 h-full w-80 max-w-[80vw] bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg flex flex-col"
      >
        <header className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
          <div className="flex justify-between items-center">
             <img src={user.avatarUrl} alt={user.displayName} className="w-10 h-10 rounded-full" />
             <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full -mr-2">
                <CloseIcon />
             </button>
          </div>
          <p className="font-bold mt-2">{user.displayName}</p>
          <p className="text-sm text-light-secondary-text dark:text-twitter-gray">@{user.username}</p>
          <div className="flex gap-4 mt-2">
            <div><span className="font-bold">{user.followingCount}</span> <span className="text-light-secondary-text dark:text-twitter-gray">Following</span></div>
            <div><span className="font-bold">{user.followerCount}</span> <span className="text-light-secondary-text dark:text-twitter-gray">Followers</span></div>
          </div>
        </header>
        <nav className="flex-1 py-2 overflow-y-auto">
          <ul>
            {navItems.map(item => (
              <li key={item.text}>
                <button onClick={() => handleNavigate(item.page)} className="w-full flex items-center gap-4 p-4 text-xl hover:bg-light-hover dark:hover:bg-white/10">
                  <div className="relative">
                      {item.icon}
                      {item.count && item.count > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                              {item.count}
                          </span>
                      )}
                  </div>
                  <span className="font-bold">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <footer className="p-4 border-t border-light-border dark:border-twitter-border dim:border-dim-border">
           <ul>
            {bottomNavItems.map(item => (
              <li key={item.text}>
                <button onClick={() => handleNavigate(item.page)} className="w-full flex items-center gap-4 py-3 text-md hover:bg-light-hover dark:hover:bg-white/10">
                  {item.icon}
                  <span>{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </footer>
      </motion.div>
    </div>
  );
};

export default MobileDrawer;