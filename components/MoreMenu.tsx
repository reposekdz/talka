import React from 'react';
import { SettingsIcon, CreatorStudioIcon, DisplayIcon, HelpIcon, MonetizationIcon, CommunityIcon } from './Icon';
import { Page } from '../types';

interface MoreMenuProps {
  onDisplayClick: () => void;
  closeMenu: () => void;
  setCurrentPage: (page: Page) => void;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ onDisplayClick, closeMenu, setCurrentPage }) => {
  const menuItems = [
    { icon: <CommunityIcon />, text: 'Communities', action: () => setCurrentPage(Page.Communities) },
    { icon: <MonetizationIcon />, text: 'Monetization', action: () => setCurrentPage(Page.CreatorStudio) },
    { icon: <CreatorStudioIcon />, text: 'Creator Studio', action: () => setCurrentPage(Page.CreatorStudio) },
    { icon: <SettingsIcon />, text: 'Settings and privacy', action: () => setCurrentPage(Page.Settings) },
    { icon: <HelpIcon />, text: 'Help Center', action: () => setCurrentPage(Page.HelpCenter) },
    { icon: <DisplayIcon />, text: 'Display', action: onDisplayClick },
  ];

  return (
    <div 
      className="absolute bottom-20 left-0 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-2xl shadow-lg w-80 border border-light-border dark:border-twitter-border dim:border-dim-border z-20"
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
            className="flex items-center gap-4 p-4 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover transition-colors duration-200"
          >
            {item.icon}
            <span className="font-bold">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoreMenu;