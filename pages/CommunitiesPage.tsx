import React from 'react';
import { mockCommunities } from '../data/mockData';
import { Community } from '../types';
import Avatar from '../components/Avatar';
import { CommunityIcon } from '../components/Icon';

const CommunityCard: React.FC<{ community: Community }> = ({ community }) => (
    <div className="border-b border-light-border dark:border-twitter-border dim:border-dim-border p-4 hover:bg-light-hover dark:hover:bg-white/5 dim:hover:bg-dim-hover/50 transition-colors duration-200">
        <div className="relative h-24 rounded-lg bg-gray-300 dark:bg-gray-700">
             <img src={community.bannerUrl} alt={`${community.name} banner`} className="w-full h-full object-cover rounded-lg"/>
        </div>
        <div className="flex items-start gap-4 -mt-8 px-4">
            <div className="border-4 border-light-bg dark:border-twitter-dark dim:border-dim-bg rounded-lg">
                <Avatar src={community.avatarUrl} alt={community.name} size="large" />
            </div>
            <div className="pt-10 flex-1">
                 <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{community.name}</h3>
                    <button className="border border-current font-bold px-4 py-1.5 rounded-full hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover">Join</button>
                 </div>
                 <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-1">{community.description}</p>
                 <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-2">{community.memberCount.toLocaleString()} members</p>
            </div>
        </div>
    </div>
);


const CommunitiesPage: React.FC = () => {
    return (
        <div>
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                <h1 className="text-xl font-bold">Communities</h1>
            </div>

            <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                <h2 className="text-lg font-bold mb-2">Discover new Communities</h2>
                <p className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
                    Find groups that share your interests and connect with like-minded people.
                </p>
            </div>
            
            <div>
                {mockCommunities.map(community => (
                    <CommunityCard key={community.id} community={community} />
                ))}
            </div>
        </div>
    );
};

export default CommunitiesPage;
