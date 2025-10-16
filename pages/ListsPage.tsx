import React, { useState } from 'react';
import { ListIcon, PlusIcon, CloseIcon } from '../components/Icon';
import { motion, AnimatePresence } from 'framer-motion';

interface List {
    id: string;
    name: string;
    description: string;
    memberCount: number;
}

const mockInitialLists: List[] = [
    { id: 'l1', name: 'Tech Twitter', memberCount: 15, description: 'People I follow for tech news.' },
    { id: 'l2', name: 'Designers', memberCount: 8, description: 'Inspiration for UI/UX.' },
    { id: 'l3', name: 'Personal Friends', memberCount: 22, description: 'Updates from friends.' },
];

const CreateListModal: React.FC<{onClose: () => void; onCreate: (name: string, description: string) => void}> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = () => {
        if (name.trim()) {
            onCreate(name, description);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-light-bg dark:bg-twitter-dark w-full max-w-md rounded-2xl p-6"
            >
                <h2 className="text-xl font-bold mb-4">Create a new List</h2>
                <input 
                    type="text"
                    placeholder="List name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-light-border dark:bg-twitter-light-dark rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                />
                 <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-light-border dark:bg-twitter-light-dark rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                    rows={3}
                />
                <button 
                    onClick={handleCreate}
                    disabled={!name.trim()}
                    className="w-full bg-twitter-blue text-white font-bold py-2 rounded-full disabled:opacity-50"
                >
                    Create
                </button>
            </motion.div>
        </div>
    )
}

const ListsPage = () => {
    const [lists, setLists] = useState<List[]>(mockInitialLists);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const handleCreateList = (name: string, description: string) => {
        const newList: List = {
            id: `l-new-${Date.now()}`,
            name,
            description,
            memberCount: 0,
        };
        setLists(prev => [newList, ...prev]);
        setIsCreateModalOpen(false);
    }

    return (
        <div>
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex justify-between items-center">
                <h1 className="text-xl font-bold">Lists</h1>
                <button onClick={() => setIsCreateModalOpen(true)} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><PlusIcon /></button>
            </div>
            <div>
                <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                    <h2 className="font-bold text-lg">Your Lists</h2>
                </div>
                {lists.map(list => (
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
            <AnimatePresence>
                {isCreateModalOpen && <CreateListModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateList} />}
            </AnimatePresence>
        </div>
    );
};

export default ListsPage;