import React from 'react';
import { Page, User } from '../types';
import Avatar from './Avatar';
import { ProtoIcon } from './Icon';

interface MobileHeaderProps {
  currentPage: Page;
  currentUser: User;
  onProfileClick: () => void;
}

const getPageTitle = (page: Page) => {
    switch(page) {
        case Page.Explore: return "Explore";
        case Page.Notifications: return "Notifications";
        case Page.Messages: return "Messages";
        case Page.Bookmarks: return "Bookmarks";
        case Page.Communities: return "Communities";
        case Page.Reels: return "Reels";
        default: return null;
    }
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ currentPage, currentUser, onProfileClick }) => {
    const title = getPageTitle(currentPage);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-30 sm:hidden border-b border-light-border dark:border-twitter-border dim:border-dim-border">
      <div className="container mx-auto flex justify-between items-center h-full px-4 max-w-[600px]">
        <div onClick={onProfileClick}>
            <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="small" />
        </div>
        <div className="font-bold text-lg">
            {title ? title : <ProtoIcon />}
        </div>
        {/* Placeholder for settings or other actions */}
        <div className="w-10"></div>
      </div>
    </header>
  );
};

export default MobileHeader;
