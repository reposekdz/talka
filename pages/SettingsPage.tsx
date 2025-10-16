import React, { useState } from 'react';
import { AccountIcon, SecurityIcon, PrivacyIcon, NotificationsIcon, ChevronRightIcon, DisplayIcon } from '../components/Icon';
import SettingsDetailView from '../components/SettingsDetailView';
import { AnimatePresence } from 'framer-motion';
import { AppSettings } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, title, subtitle, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between p-4 cursor-pointer hover:bg-light-hover dark:hover:bg-white/5 dim:hover:bg-dim-hover/50 transition-colors duration-200">
    <div className="flex items-center gap-4">
      <div className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">{icon}</div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">{subtitle}</p>
      </div>
    </div>
    <div className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
      <ChevronRightIcon />
    </div>
  </div>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdateSettings }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const settingsSections = [
    {
      icon: <AccountIcon />,
      title: "Your account",
      subtitle: "See information about your account, download an archive of your data, or learn about your account deactivation options"
    },
    {
      icon: <SecurityIcon />,
      title: "Security and account access",
      subtitle: "Manage your account’s security and keep track of your account’s usage including apps that you have connected to your account."
    },
    {
      icon: <PrivacyIcon />,
      title: "Privacy and safety",
      subtitle: "Manage what information you see and share on Proto-Twitter."
    },
    {
      icon: <NotificationsIcon />,
      title: "Notifications",
      subtitle: "Select the kinds of notifications you get about your activities, interests, and recommendations."
    },
    {
      icon: <DisplayIcon />,
      title: "Accessibility, display, and languages",
      subtitle: "Manage how Proto-Twitter content is displayed to you."
    }
  ];

  return (
    <div className="relative h-full overflow-hidden">
        <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                <h1 className="text-xl font-bold">Settings</h1>
            </div>
            <div className="p-4">
                <input
                    type="text"
                    placeholder="Search settings"
                    className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-current placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                />
            </div>
            <div className="flex-1 overflow-y-auto">
                {settingsSections.map(item => (
                <SettingsItem key={item.title} {...item} onClick={() => setActiveSection(item.title)} />
                ))}
            </div>
        </div>
        <AnimatePresence>
            {activeSection && (
                <SettingsDetailView 
                    title={activeSection} 
                    onBack={() => setActiveSection(null)}
                    settings={settings}
                    onUpdateSettings={onUpdateSettings}
                />
            )}
        </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
