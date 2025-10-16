import React from 'react';
import { ListIcon, PlusIcon } from '../components/Icon';

const mockLists = [
    { id: 'l1', name: 'Tech Twitter', memberCount: 15, description: 'People I follow for tech news.' },
    { id: 'l2', name: 'Designers', memberCount: 8, description: 'Inspiration for UI/UX.' },
    { id: 'l3', name: 'Personal Friends', memberCount: 22, description: 'Updates from friends.' },
];

const ListsPage = () => {
    return (
        <div>
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex justify-between items-center">
                <h1 className="text-xl font-bold">Lists</h1>
                <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><PlusIcon /></button>
            </div>
            <div>
                <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                    <h2 className="font-bold text-lg">Your Lists</h2>
                </div>
                {mockLists.map(list => (
                    <div key={list.id} className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex items-center gap-4 cursor-pointer hover:bg-light-hover dark:hover:bg-white/5">
                        <div className="w-12 h-12 bg-light-border dark:bg-twitter-light-dark rounded-lg flex items-center justify-center">
                            <ListIcon />
                        </div>
                        <div>
                            <p className="font-bold">{list.name}</p>
                            <p className="text-sm text-light-secondary-text dark:text-twitter-gray">{list.description}</p>
                            <p className="text-sm text-light-secondary-text dark:text-twitter-gray">{list.memberCount} Members</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListsPage;
