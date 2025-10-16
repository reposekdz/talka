import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon } from './Icon';

interface SettingsDetailViewProps {
  title: string;
  onBack: () => void;
}

const SettingsDetailView: React.FC<SettingsDetailViewProps> = ({ title, onBack }) => {
  // Mock content based on title
  const renderContent = () => {
    switch(title) {
        case "Your account":
            return (
                <div className="p-4">
                    <p className="text-light-secondary-text dark:text-twitter-gray">Manage your account information like your phone number and email address.</p>
                    <button className="mt-4 w-full text-left p-4 hover:bg-light-hover dark:hover:bg-white/5 rounded-lg">Account information</button>
                    <button className="mt-2 w-full text-left p-4 hover:bg-light-hover dark:hover:bg-white/5 rounded-lg">Change your password</button>
                    <button className="mt-2 w-full text-left p-4 text-red-500 hover:bg-red-500/10 rounded-lg">Deactivate your account</button>
                </div>
            );
        case "Security and account access":
             return (
                <div className="p-4">
                    <p className="text-light-secondary-text dark:text-twitter-gray">Manage your account's security.</p>
                    <button className="mt-4 w-full text-left p-4 hover:bg-light-hover dark:hover:bg-white/5 rounded-lg">Two-factor authentication</button>
                    <button className="mt-2 w-full text-left p-4 hover:bg-light-hover dark:hover:bg-white/5 rounded-lg">Connected apps</button>
                </div>
            );
        default:
            return <p className="p-4 text-light-secondary-text dark:text-twitter-gray">Settings for {title} would be here.</p>;
    }
  }
  
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
      className="absolute top-0 left-0 w-full h-full bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg flex flex-col"
    >
      <div className="sticky top-0 flex items-center gap-4 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><ChevronLeftIcon /></button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default SettingsDetailView;
