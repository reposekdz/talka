import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkIcon, CommunityIcon, CreatorStudioIcon, SettingsIcon, HelpIcon, DisplayIcon, MoreIcon } from './Icon';
import { Page } from '../types';

interface MobileMenuProps {
  onClose: () => void;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  openDisplayModal: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose, setCurrentPage, onLogout, openDisplayModal }) => {
  const menuItems = [
    { icon: <BookmarkIcon />, text: 'Bookmarks', page: Page.Bookmarks },
    { icon: <CommunityIcon />, text: 'Communities', page: Page.Communities },
    { icon: <CreatorStudioIcon />, text: 'Creator Studio', page: Page.CreatorStudio },
    { icon: <SettingsIcon />, text: 'Settings', page: Page.Settings },
    { icon: <HelpIcon />, text: 'Help Center', page: Page.HelpCenter },
    { icon: <DisplayIcon />, text: 'Display', action: openDisplayModal },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
          className="absolute top-0 right-0 h-full w-4/5 max-w-xs bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg flex flex-col shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
            <h2 className="text-xl font-bold">Menu</h2>
          </div>
          <nav className="flex-1 py-2">
            <ul>
              {menuItems.map((item) => (
                <li
                  key={item.text}
                  onClick={() => {
                    item.page ? setCurrentPage(item.page) : item.action?.();
                  }}
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10"
                >
                  {item.icon}
                  <span className="text-lg">{item.text}</span>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-light-border dark:border-twitter-border dim:border-dim-border">
            <button
              onClick={onLogout}
              className="w-full text-left flex items-center gap-4 p-3 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"
            >
              <img src="https://picsum.photos/seed/u1/200/200" alt="Current User" className="w-10 h-10 rounded-full" />
              <div className="flex flex-col items-start">
                <span className="font-bold text-light-text dark:text-white dim:text-dim-text">React Dev</span>
                <span className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">@reactdev</span>
              </div>
              <div className="ml-auto text-current">
                <MoreIcon />
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileMenu;
