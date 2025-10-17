import React, { useState, useEffect } from 'react';
import { User, Page } from '../types';
import { TalkaIcon, CreateIcon, NotificationsIcon, SearchIcon } from './Icon';
import Avatar from './Avatar';
import TopRightMenu from './TopRightMenu';
// FIX: Import AnimatePresence from framer-motion to resolve 'Cannot find name' errors.
import { AnimatePresence } from 'framer-motion';

interface HeaderProps {
    currentUser: User;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    notificationCount: number;
    onOpenCreator: (mode?: 'select' | 'story' | 'reel' | 'post') => void;
    openSearchModal: () => void;
    onLogout: () => void;
    openDisplayModal: () => void;
    onOpenDrawer: () => void; // For mobile
}

const Header: React.FC<HeaderProps> = (props) => {
    const { currentUser, setCurrentPage, notificationCount, onOpenCreator, openSearchModal, onLogout, openDisplayModal, onOpenDrawer } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const useIsMobile = () => {
        const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
        useEffect(() => {
            const handleResize = () => setIsMobile(window.innerWidth < 640);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);
        return isMobile;
    };
    const isMobile = useIsMobile();
    
    const handleAvatarClick = () => {
        if (isMobile) {
            onOpenDrawer();
        } else {
            setIsMenuOpen(!isMenuOpen);
        }
    };
    
    return (
        <header className="sticky top-0 z-30 w-full bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md border-b border-light-border dark:border-twitter-border dim:border-dim-border">
            <div className="container mx-auto flex items-center justify-between h-14 px-4 max-w-[1300px]">
                {/* Left Side */}
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentPage(Page.Home)} className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-white/10">
                        <TalkaIcon className="w-7 h-7" />
                    </button>
                </div>

                {/* Center Search (Desktop) */}
                <div className="hidden sm:flex flex-1 justify-center px-8">
                    <div
                        onClick={openSearchModal}
                        className="w-full max-w-md bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-light-secondary-text dark:text-twitter-gray rounded-full px-4 py-2 cursor-pointer flex items-center gap-3 hover:bg-light-hover/80 dark:hover:bg-white/5 dim:hover:bg-dim-hover/80 transition-colors"
                    >
                        <SearchIcon />
                        <span>Search</span>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                     <button onClick={openSearchModal} className="p-2 rounded-full hover:bg-light-hover dark:hover:bg-white/10 sm:hidden">
                        <SearchIcon />
                    </button>
                    <button onClick={() => onOpenCreator('select')} className="hidden md:flex items-center gap-2 bg-twitter-blue text-white font-bold px-4 py-2 rounded-full hover:bg-opacity-90">
                        <CreateIcon />
                        <span className="hidden lg:inline">Create</span>
                    </button>
                     <button onClick={() => setCurrentPage(Page.Notifications)} className="relative p-2 rounded-full hover:bg-light-hover dark:hover:bg-white/10">
                        <NotificationsIcon />
                        {notificationCount > 0 && (
                            <span className="absolute -top-0 -right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-light-bg dark:border-twitter-dark">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    <button onClick={handleAvatarClick}>
                        <Avatar src={currentUser.avatarUrl} alt={currentUser.displayName} size="small" />
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {!isMobile && isMenuOpen && (
                    <TopRightMenu
                        user={currentUser}
                        onClose={() => setIsMenuOpen(false)}
                        setCurrentPage={setCurrentPage}
                        onDisplayClick={openDisplayModal}
                        onLogout={onLogout}
                    />
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
