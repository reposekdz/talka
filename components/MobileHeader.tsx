import React from 'react';
import { User } from '../types';
import Avatar from './Avatar';
import { TalkaIcon } from './Icon';

interface MobileHeaderProps {
    user: User;
    onOpenDrawer: () => void;
    onLogoClick: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ user, onOpenDrawer, onLogoClick }) => {
    return (
        <header className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-20 px-4 py-2 flex items-center justify-between sm:hidden border-b border-light-border dark:border-twitter-border dim:border-dim-border">
            <button onClick={onOpenDrawer} className="p-2 -ml-2">
                <Avatar src={user.avatarUrl} alt={user.displayName} size="small" />
            </button>
            <div onClick={onLogoClick} className="cursor-pointer">
                <TalkaIcon className="w-8 h-8" />
            </div>
            <div className="w-10"></div> {/* Spacer */}
        </header>
    );
};

export default MobileHeader;
