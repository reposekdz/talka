import React from 'react';
import { ProtoIcon, SettingsIcon, ChevronLeftIcon } from './Icon';
import { Page } from '../types';

interface MobileHeaderProps {
  pageHistory: Page[];
  onBack: () => void;
  setCurrentPage: (page: Page) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ pageHistory, onBack, setCurrentPage }) => {
  const showBackButton = pageHistory.length > 1;

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-30 sm:hidden border-b border-light-border dark:border-twitter-border dim:border-dim-border">
      <div className="container mx-auto flex items-center justify-between px-4 h-full max-w-[600px] relative">
        <div className="absolute left-4">
          {showBackButton && (
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
              <ChevronLeftIcon />
            </button>
          )}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-current">
          <ProtoIcon />
        </div>
        <div className="absolute right-4">
            <button onClick={() => setCurrentPage(Page.Settings)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full">
                <SettingsIcon />
            </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;