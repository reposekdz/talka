
import React, { useState } from 'react';
import { User } from '../types';
import { CloseIcon, PhotoIcon } from './Icon';
import { motion } from 'framer-motion';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [website, setWebsite] = useState(user.website || '');
  
  const handleSave = () => {
    onSave({
      ...user,
      displayName,
      bio,
      location,
      website
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-10" onClick={onClose}>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-light-bg dark:bg-twitter-dark w-full max-w-[600px] rounded-2xl flex flex-col max-h-[90vh]"
      >
        <header className="p-2 pr-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
                <h2 className="font-bold text-lg">Edit profile</h2>
            </div>
            <button onClick={handleSave} className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-opacity-90">Save</button>
        </header>
        <div className="flex-1 overflow-y-auto">
            <div className="relative h-48 bg-gray-500">
                <img src={user.bannerUrl} alt="banner" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-4">
                    <button className="p-2 bg-black/50 rounded-full text-white"><PhotoIcon /></button>
                </div>
            </div>
            <div className="p-4 -mt-16">
                <div className="relative w-32 h-32">
                     <img src={user.avatarUrl} alt="avatar" className="w-32 h-32 rounded-full border-4 border-light-bg dark:border-twitter-dark"/>
                     <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                         <button className="p-2 bg-black/50 rounded-full text-white"><PhotoIcon /></button>
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-6">
                <div className="border border-light-border dark:border-twitter-border rounded-md p-2">
                    <label className="text-xs text-twitter-gray">Name</label>
                    <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-transparent focus:outline-none"/>
                </div>
                <div className="border border-light-border dark:border-twitter-border rounded-md p-2">
                    <label className="text-xs text-twitter-gray">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-transparent focus:outline-none resize-none" rows={3}/>
                </div>
                <div className="border border-light-border dark:border-twitter-border rounded-md p-2">
                    <label className="text-xs text-twitter-gray">Location</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-transparent focus:outline-none"/>
                </div>
                <div className="border border-light-border dark:border-twitter-border rounded-md p-2">
                    <label className="text-xs text-twitter-gray">Website</label>
                    <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-transparent focus:outline-none"/>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;
