import React, { useState } from 'react';
import { TwitterIcon, HomeIcon, ExploreIcon, NotificationsIcon, MessagesIcon, ProfileIcon, MoreIcon, BookmarkIcon, ListIcon, CommunityIcon, ComposeIcon, ReelsIcon } from './Icon';
import MoreMenu from './MoreMenu';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  openDisplayModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, onLogout, openDisplayModal }) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navItems = [
    { icon: <HomeIcon />, text: 'Home', page: Page.Home },
    { icon: <ExploreIcon />, text: 'Explore', page: Page.Explore },
    { icon: <NotificationsIcon />, text: 'Notifications', page: Page.Notifications },
    { icon: <MessagesIcon />, text: 'Messages', page: Page.Messages },
    { icon: <ReelsIcon />, text: 'Reels', page: Page.Reels },
    { icon: <BookmarkIcon />, text: 'Bookmarks', page: Page.Bookmarks },
    { icon: <CommunityIcon />, text: 'Communities', page: Page.Communities },
    { icon: <ProfileIcon />, text: 'Profile', page: Page.Profile },
  ];
  
  const handleDisplayClick = () => {
    openDisplayModal();
    setIsMoreMenuOpen(false);
  };


  return (
    <header className="w-[88px] xl:w-[275px] h-screen sticky top-0 px-2 flex-col justify-between items-center xl:items-stretch hidden sm:flex transition-all duration-300">
      <div>
        <div className="p-3 my-2 text-current hover:bg-light-hover dark:hover:bg-twitter-blue/10 rounded-full w-min">
          <TwitterIcon />
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li 
                key={item.text} 
                onClick={() => setCurrentPage(item.page)} 
                className={`flex items-center justify-center xl:justify-start gap-4 text-xl p-3 my-1 cursor-pointer hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full transition-colors duration-200 w-auto`}
                >
                {item.icon}
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
        <button className="bg-twitter-blue w-14 h-14 xl:w-56 mt-4 text-white font-bold text-lg p-3 rounded-full hover:bg-opacity-90 flex items-center justify-center">
            <span className="hidden xl:inline">Post</span>
            <span className="xl:hidden"><ComposeIcon /></span>
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