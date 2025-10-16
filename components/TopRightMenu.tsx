import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookmarkIcon, CommunityIcon, SettingsIcon, HelpIcon, DisplayIcon, CreatorStudioIcon, MonetizationIcon } from './Icon';
import { Page } from '../types';

interface TopRightMenuProps {
  onDisplayClick: () => void;
  closeMenu: () => void;
  setCurrentPage: (page: Page) => void;
}

const TopRightMenu: React.FC<TopRightMenuProps> = ({ onDisplayClick, closeMenu, setCurrentPage }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { icon: <BookmarkIcon />, text: 'Bookmarks', action: () => setCurrentPage(Page.Bookmarks) },
    { icon: <CommunityIcon />, text: 'Communities', action: () => setCurrentPage(Page.Communities) },
    { icon: <MonetizationIcon />, text: 'Monetization', action: () => setCurrentPage(Page.CreatorStudio) },
    { icon: <CreatorStudioIcon />, text: 'Creator Studio', action: () => setCurrentPage(Page.CreatorStudio) },
    { icon: <SettingsIcon />, text: 'Settings and privacy', action: () => setCurrentPage(Page.Settings) },
    { icon: <HelpIcon />, text: 'Help Center', action: () => setCurrentPage(Page.HelpCenter) },
    { icon: <DisplayIcon />, text: 'Display', action: onDisplayClick },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMenu]);

  return (
    <div className="fixed inset-0 z-40" onClick={closeMenu}>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10, x: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10, x: 10 }}
        transition={{ duration: 0.15 }}
        className="absolute top-14 right-4 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-2xl shadow-lg w-80 max-w-[80vw] border border-light-border dark:border-twitter-border dim:border-dim-border z-20 origin-top-right"
        onClick={e => e.stopPropagation()}
      >
        <ul>
          {menuItems.map(item => (
            <li
              key={item.text}
              onClick={() => {
                item.action?.();
                closeMenu();
              }}
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl"
            >
              {item.icon}
              <span className="font-bold">{item.text}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default TopRightMenu;
