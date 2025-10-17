import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookmarkIcon, ListIcon, CommunityIcon, SettingsIcon, HelpIcon, DisplayIcon, CreatorStudioIcon, MonetizationIcon, ProfileIcon } from './Icon';
import { Page, User } from '../types';

interface TopRightMenuProps {
  user: User;
  onClose: () => void;
  setCurrentPage: (page: Page) => void;
  onDisplayClick: () => void;
  onLogout: () => void;
}

const TopRightMenu: React.FC<TopRightMenuProps> = ({ user, onClose, setCurrentPage, onDisplayClick, onLogout }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (page: Page) => {
      setCurrentPage(page);
      onClose();
  };

  const menuItems = [
    { icon: <ProfileIcon />, text: 'Profile', action: () => handleNavigate(Page.Profile) },
    { icon: <BookmarkIcon />, text: 'Bookmarks', action: () => handleNavigate(Page.Bookmarks) },
    { icon: <ListIcon />, text: 'Lists', action: () => handleNavigate(Page.Lists) },
    { icon: <CommunityIcon />, text: 'Communities', action: () => handleNavigate(Page.Communities) },
    { icon: <MonetizationIcon />, text: 'Monetization', action: () => handleNavigate(Page.CreatorStudio) },
    { icon: <CreatorStudioIcon />, text: 'Creator Studio', action: () => handleNavigate(Page.CreatorStudio) },
  ];
  
  const settingsItems = [
     { icon: <SettingsIcon />, text: 'Settings and privacy', action: () => handleNavigate(Page.Settings) },
     { icon: <HelpIcon />, text: 'Help Center', action: () => handleNavigate(Page.HelpCenter) },
     { icon: <DisplayIcon />, text: 'Display', action: () => { onDisplayClick(); onClose(); } },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-20" onClick={onClose}>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="absolute top-16 right-4 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-2xl shadow-lg w-80 max-w-[80vw] border border-light-border dark:border-twitter-border dim:border-dim-border z-30 origin-top-right overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-light-border dark:border-twitter-border">
             <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt={user.displayName} className="w-12 h-12 rounded-full" />
                <div>
                    <p className="font-bold">{user.displayName}</p>
                    <p className="text-sm text-light-secondary-text dark:text-twitter-gray">@{user.username}</p>
                </div>
            </div>
        </div>
        <ul>
          {menuItems.map(item => (
            <li key={item.text}>
                 <button onClick={item.action} className="w-full flex items-center gap-4 p-4 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover transition-colors duration-200">
                    {item.icon}
                    <span className="font-bold">{item.text}</span>
                 </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-light-border dark:border-twitter-border">
             <ul>
                 {settingsItems.map(item => (
                    <li key={item.text}>
                         <button onClick={item.action} className="w-full flex items-center gap-4 p-4 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover transition-colors duration-200">
                            {item.icon}
                            <span>{item.text}</span>
                         </button>
                    </li>
                 ))}
                 <li>
                    <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover transition-colors duration-200">
                        <span>Log out @{user.username}</span>
                    </button>
                 </li>
             </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default TopRightMenu;
