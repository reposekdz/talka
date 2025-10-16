import React from 'react';
import { TwitterIcon, NotificationsIcon, MoreIcon } from './Icon';
import Avatar from './Avatar';
import { User, Page } from '../types';

interface MobileHeaderProps {
  user: User;
  setCurrentPage: (page: Page) => void;
  onMenuClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ user, setCurrentPage, onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-30 sm:hidden border-b border-light-border dark:border-twitter-border dim:border-dim-border">
      <div className="container mx-auto flex items-center justify-between px-4 h-full max-w-[600px] ">
        <button onClick={() => setCurrentPage(Page.Profile)}>
          <Avatar src={user.avatarUrl} alt={user.displayName} size="small" />
        </button>
        <div className="text-current">
          <TwitterIcon />
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Page.Notifications)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
                <NotificationsIcon />
            </button>
            <button onClick={onMenuClick} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
                <MoreIcon />
            </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
