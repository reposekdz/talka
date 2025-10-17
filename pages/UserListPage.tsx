import React, { useState, useMemo } from 'react';
import { User } from '../types';
import WhoToFollow from '../components/WhoToFollow';
import { ChevronLeftIcon } from '../components/Icon';
import { motion } from 'framer-motion';

interface UserListPageProps {
    user: User;
    listType: 'followers' | 'following';
    allUsers: User[];
    currentUser: User;
    onBack: () => void;
    onFollowToggle: (userId: string) => void;
    onViewProfile: (user: User) => void;
    onRemoveFollower: (userId: string) => void;
}

const UserListPage: React.FC<UserListPageProps> = ({ user, listType, allUsers, currentUser, onBack, onFollowToggle, onViewProfile, onRemoveFollower }) => {
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(listType);

    const userList = useMemo(() => {
        const ids = activeTab === 'followers' ? user.followerIds : user.followingIds;
        return allUsers.filter(u => ids.includes(u.id));
    }, [activeTab, user, allUsers]);

    return (
        <div>
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-2 flex items-center gap-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                <button onClick={onBack} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><ChevronLeftIcon /></button>
                <div>
                    <h1 className="text-xl font-bold">{user.displayName}</h1>
                    <p className="text-sm text-twitter-gray">@{user.username}</p>
                </div>
            </div>
            
            <div className="flex border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                {['Followers', 'Following'].map(tabName => {
                    const tabId = tabName.toLowerCase() as 'followers' | 'following';
                    return (
                        <div key={tabId} onClick={() => setActiveTab(tabId)} className="flex-1 text-center font-bold p-4 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover cursor-pointer relative">
                            <span className={activeTab === tabId ? 'text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}>
                                {tabName}
                            </span>
                            {activeTab === tabId && <motion.div layoutId="userListTabIndicator" className="absolute bottom-0 left-0 w-full h-1 bg-twitter-blue rounded-full" />}
                        </div>
                    )
                })}
            </div>

            <div>
                {userList.length > 0 ? (
                    userList.map(listUser => (
                        <WhoToFollow 
                            key={listUser.id} 
                            user={listUser} 
                            currentUser={currentUser}
                            onFollowToggle={onFollowToggle}
                            onViewProfile={onViewProfile}
                            isFollowerOfCurrentUser={activeTab === 'followers' && user.id === currentUser.id}
                            onRemoveFollower={onRemoveFollower}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center text-twitter-gray">
                        <h2 className="text-xl font-bold mb-2">No users to see here</h2>
                        <p>This user doesn't have any {activeTab} yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserListPage;