import React, { useState } from 'react';
import { AccountIcon, SecurityIcon, PrivacyIcon, NotificationsIcon, ChevronRightIcon, DisplayIcon } from '../components/Icon';
import SettingsDetailView from '../components/SettingsDetailView';
import { AnimatePresence } from 'framer-motion';
import { AppSettings, User } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  openDisplayModal: () => void;
  onUpdateProfileDetails: (updatedUser: Partial<User>) => void;
}

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, title, subtitle, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between p-4 cursor-pointer hover:bg-light-hover/50 dark:hover:bg-white/5 transition-colors duration-200">
    <div className="flex items-center gap-4">
      <div className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">{icon}</div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
    </div>
    <div className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
      <ChevronRightIcon />
    </div>
  </div>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdateSettings, openDisplayModal, onUpdateProfileDetails }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const settingsSections = [
    {
      icon: <AccountIcon />,
      title: "Your account",
      subtitle: "See information about your account, download an archive of your data, or learn about your account deactivation options",
      action: () => setActiveSection("Your account")
    },
    {
      icon: <SecurityIcon />,
      title: "Security and account access",
      subtitle: "Manage your account’s security and keep track of your account’s usage including apps that you have connected to your account.",
      action: () => setActiveSection("Security and account access")
    },
    {
      icon: <PrivacyIcon />,
      title: "Privacy and safety",
      subtitle: "Manage what information you see and share on Talka.",
      action: () => setActiveSection("Privacy and safety")
    },
    {
      icon: <NotificationsIcon />,
      title: "Notifications",
      subtitle: "Select the kinds of notifications you get about your activities, interests, and recommendations.",
      action: () => setActiveSection("Notifications")
    },
    {
      icon: <DisplayIcon />,
      title: "Accessibility, display, and languages",
      subtitle: "Manage how Talka content is displayed to you.",
      action: () => setActiveSection("Accessibility, display, and languages")
    },
     {
      icon: <DisplayIcon />,
      title: "Display",
      subtitle: "Customize your view. These settings affect all accounts on this browser.",
      action: openDisplayModal
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
                    className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-current placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                />
            </div>
            <div className="flex-1 overflow-y-auto px-4 space-y-4">
              <div className="bg-light-hover/50 dark:bg-white/5 rounded-2xl overflow-hidden">
                {settingsSections.map((item, index) => (
                  <div key={item.title} className={index !== 0 ? "border-t border-light-border dark:border-twitter-border dim:border-dim-border" : ""}>
                    <SettingsItem icon={item.icon} title={item.title} subtitle={item.subtitle} onClick={item.action} />
                  </div>
                ))}
              </div>
            </div>
        </div>
        <AnimatePresence>
            {activeSection && (
                <SettingsDetailView 
                    title={activeSection} 
                    onBack={() => setActiveSection(null)}
                    settings={settings}
                    onUpdateSettings={onUpdateSettings}
                    onUpdateProfileDetails={onUpdateProfileDetails}
                />
            )}
        </AnimatePresence>
    </div>
  );
};

export default SettingsPage;