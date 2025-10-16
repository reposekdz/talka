import React from 'react';
import { MonetizationIcon, AnalyticsIcon } from '../components/Icon';

const CreatorStudioPage: React.FC = () => {
  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <h1 className="text-xl font-bold">Creator Studio</h1>
      </div>
      <div className="p-8 text-center">
        <div className="inline-block p-4 bg-twitter-blue/20 rounded-full mb-4">
            <MonetizationIcon />
        </div>
        <h2 className="text-2xl font-bold mb-2">Monetization & Analytics</h2>
        <p className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text max-w-md mx-auto">
          This is where you'll find tools to manage your creator subscriptions, view ad revenue sharing, and dive deep into your post analytics.
        </p>
        <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-4">(This is a placeholder page for the prototype)</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-light-hover dark:bg-white/5 dim:bg-dim-hover p-4 rounded-lg">
                <h3 className="font-bold flex items-center gap-2"><AnalyticsIcon/> Analytics</h3>
                <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-1">Track your impressions, engagement rate, and follower growth.</p>
            </div>
            <div className="bg-light-hover dark:bg-white/5 dim:bg-dim-hover p-4 rounded-lg">
                 <h3 className="font-bold flex items-center gap-2"><MonetizationIcon/> Monetization</h3>
                <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-1">Manage subscriptions and view your earnings.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorStudioPage;
