import React from 'react';
import { MonetizationIcon, AnalyticsIcon, PeopleIcon } from '../components/Icon';
import BarChart from '../components/BarChart';

const CreatorStudioPage: React.FC = () => {
    const analyticsData = {
        impressions: [
            { label: 'Jan', value: 12000 }, { label: 'Feb', value: 18000 }, { label: 'Mar', value: 15000 },
            { label: 'Apr', value: 22000 }, { label: 'May', value: 25000 }, { label: 'Jun', value: 30000 },
        ],
        followers: [
            { label: 'Jan', value: 100 }, { label: 'Feb', value: 150 }, { label: 'Mar', value: 120 },
            { label: 'Apr', value: 200 }, { label: 'May', value: 250 }, { label: 'Jun', value: 310 },
        ]
    };

  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <h1 className="text-xl font-bold">Creator Studio</h1>
      </div>
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><AnalyticsIcon/> Analytics</h2>
                <BarChart data={analyticsData.impressions} title="Impressions (Last 6 months)" />
                <BarChart data={analyticsData.followers} title="Follower Growth" />
            </div>

            <div className="space-y-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2"><MonetizationIcon/> Monetization</h2>
                 <div className="bg-light-hover dark:bg-white/5 dim:bg-dim-hover p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Subscriptions</h3>
                    <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mb-4">Offer your followers exclusive content and a special badge by enabling subscriptions.</p>
                     <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-extrabold">$49.90</span>
                        <span className="text-light-secondary-text dark:text-twitter-gray">/ month (estimated)</span>
                    </div>
                     <div className="flex items-center gap-2 text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mb-4">
                        <PeopleIcon />
                        <span>10 active subscribers</span>
                    </div>
                    <button className="w-full bg-twitter-blue text-white font-bold py-2 rounded-full hover:bg-opacity-90">
                        Manage Subscriptions
                    </button>
                 </div>
                 <div className="bg-light-hover dark:bg-white/5 dim:bg-dim-hover p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Ad Revenue Sharing</h3>
                    <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">Earn money from ads served in the replies to your posts.</p>
                    <p className="mt-4 text-green-400 font-bold">You are eligible!</p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorStudioPage;