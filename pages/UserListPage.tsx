
import React from 'react';
import { otherUsers } from '../data/mockData';
import WhoToFollow from '../components/WhoToFollow';
import { ChevronLeftIcon } from '../components/Icon';

const UserListPage: React.FC = () => {
    // This is a placeholder page. In a real app, you would fetch
    // the list of users (e.g., followers) based on a user ID.
  return (
    <div>
        <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-2 flex items-center gap-4">
             <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><ChevronLeftIcon /></button>
            <div>
                <h1 className="text-xl font-bold">Following</h1>
                <p className="text-sm text-twitter-gray">@reactdev</p>
            </div>
        </div>
        <div>
            {otherUsers.map(user => (
                <WhoToFollow key={user.id} user={user} />
            ))}
        </div>
    </div>
  );
};

export default UserListPage;
