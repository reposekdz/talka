import React, { useState, useMemo } from 'react';
import { User } from '../types';
import WhoToFollow from './WhoToFollow';
import { CloseIcon } from './Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface UserListModalProps {
    user: User;
    initialTab: 'followers' | 'following';
    allUsers: User[];
    currentUser: User;
    onClose: () => void;
    onFollowToggle: (userId: string) => void;
    onViewProfile: (user: User) => void;
    onRemoveFollower: (userId: string) => void;
}

const UserListModal: React.FC<UserListModalProps> = (props) => {
    const { user, initialTab, allUsers, currentUser, onClose, onFollowToggle, onViewProfile, onRemoveFollower } = props;
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);

    const userList = useMemo(() => {
        const ids = activeTab === 'followers' ? user.followerIds : user.followingIds;
        return allUsers.filter(u => ids.includes(u.id));
    }, [activeTab, user, allUsers]);

    return (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-10"
          onClick={onClose}
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg w-full max-w-[600px] max-h-[80vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-2 pr-4 flex items-center gap-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                    <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full"><CloseIcon /></button>
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
                                {activeTab === tabId && <motion.div layoutId="userListModalTabIndicator" className="absolute bottom-0 left-0 w-full h-1 bg-twitter-blue rounded-full" />}
                            </div>
                        )
                    })}
                </div>

                <div className="flex-1 overflow-y-auto">
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
            </motion.div>
        </div>
    );
};

export default UserListModal;
