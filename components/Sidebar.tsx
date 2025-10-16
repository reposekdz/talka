import React, { useState } from 'react';
import { TalkaIcon, HomeIcon, ExploreIcon, NotificationsIcon, MessagesIcon, ProfileIcon, MoreIcon, BookmarkIcon, ListIcon, CommunityIcon, CreateIcon, ReelsIcon } from './Icon';
import MoreMenu from './MoreMenu';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  openDisplayModal: () => void;
  activeChatCount: number;
  onOpenCreator: (mode?: 'select' | 'story' | 'reel' | 'post') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout, openDisplayModal, activeChatCount, onOpenCreator }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navItems = [
    { icon: <HomeIcon isActive={currentPage === Page.Home} />, text: 'Home', page: Page.Home },
    { icon: <ExploreIcon isActive={currentPage === Page.Explore} />, text: 'Explore', page: Page.Explore },
    { icon: <NotificationsIcon isActive={currentPage === Page.Notifications} />, text: 'Notifications', page: Page.Notifications },
    { icon: <MessagesIcon isActive={currentPage === Page.Messages} />, text: 'Messages', page: Page.Messages, notificationCount: activeChatCount },
    { icon: <ReelsIcon isActive={currentPage === Page.Reels} />, text: 'Reels', page: Page.Reels },
    { icon: <ListIcon />, text: 'Lists', page: Page.Lists },
    { icon: <BookmarkIcon isActive={currentPage === Page.Bookmarks} />, text: 'Bookmarks', page: Page.Bookmarks },
    { icon: <ProfileIcon isActive={currentPage === Page.Profile} />, text: 'Profile', page: Page.Profile },
  ];
  
  const handleDisplayClick = () => {
    openDisplayModal();
    setIsMoreMenuOpen(false);
  };


  return (
    <header className="w-[88px] xl:w-[275px] h-screen sticky top-0 px-2 flex-col justify-between items-center xl:items-stretch hidden sm:flex transition-all duration-300">
      <div>
        <div className="p-3 my-2 text-current hover:bg-light-hover dark:hover:bg-twitter-blue/10 rounded-full w-min">
          <TalkaIcon />
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li 
                key={item.text} 
                onClick={() => {
                    if (item.page === Page.Profile) {
                        setCurrentPage(Page.Profile);
                    } else {
                        setCurrentPage(item.page);
                    }
                }} 
                className={`flex items-center justify-center xl:justify-start gap-4 text-xl p-3 my-1 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full transition-colors duration-200 w-auto`}
                >
                <div className="relative">
                    {item.icon}
                    {item.notificationCount && item.notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-twitter-blue text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {item.notificationCount}
                        </span>
                    )}
                </div>
                <span className={`hidden xl:inline ${currentPage === item.page ? 'font-bold' : ''}`}>{item.text}</span>
              </li>
            ))}
             <li 
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} 
                className={`relative flex items-center justify-center xl:justify-start gap-4 text-xl p-3 my-1 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full transition-colors duration-200 w-auto`}
                >
                <MoreIcon />
                <span className="hidden xl:inline">More</span>
                {isMoreMenuOpen && <MoreMenu onDisplayClick={handleDisplayClick} setCurrentPage={setCurrentPage} closeMenu={() => setIsMoreMenuOpen(false)}/>}
              </li>
          </ul>
        </nav>
        <button onClick={() => onOpenCreator('select')} className="bg-twitter-blue w-14 h-14 xl:w-56 mt-4 text-white font-bold text-lg p-3 rounded-full hover:bg-opacity-90 flex items-center justify-center">
            <span className="hidden xl:inline">Create</span>
            <span className="xl:hidden"><CreateIcon /></span>
        </button>
      </div>

      <div className="my-4 w-full">
         <button onClick={onLogout} className="flex items-center justify-center xl:justify-between gap-4 p-3 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full w-full text-left">
            <img src="https://picsum.photos/seed/u1/200/200" alt="Current User" className="w-10 h-10 rounded-full"/>
            <div className="hidden xl:flex flex-col items-start">
                <span className="font-bold text-light-text dark:text-white dim:text-dim-text">React Dev</span>
                <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">@reactdev</span>
            </div>
            <div className="hidden xl:inline ml-auto text-current">
                <MoreIcon />
            </div>
        </button>
      </div>
    </header>
  );
};

export default Sidebar;