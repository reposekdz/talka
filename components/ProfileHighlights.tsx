import React from 'react';
import { Highlight } from '../types';
import { motion } from 'framer-motion';
import { PlusIcon } from './Icon';

interface ProfileHighlightsProps {
  highlights: Highlight[];
  isOwnProfile: boolean;
  onHighlightClick: (index: number) => void;
  onOpenCreateHighlight: () => void;
}

const ProfileHighlights: React.FC<ProfileHighlightsProps> = ({ highlights, isOwnProfile, onHighlightClick, onOpenCreateHighlight }) => {
  return (
    <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Highlights</h2>
        <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mb-4">
            Keep your favorite stories on your profile
        </p>
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {isOwnProfile && (
            <div className="flex flex-col items-center flex-shrink-0 w-20">
                <button onClick={onOpenCreateHighlight} className="w-16 h-16 rounded-full border-2 border-dashed border-light-secondary-text dark:border-twitter-gray flex items-center justify-center text-light-secondary-text dark:text-twitter-gray hover:bg-light-hover dark:hover:bg-white/10 transition-colors">
                    <PlusIcon />
                </button>
                <p className="text-sm mt-2">New</p>
            </div>
        )}
        {highlights.map((highlight, index) => (
          <motion.div 
            key={highlight.id} 
            className="flex flex-col items-center flex-shrink-0 w-20 cursor-pointer"
            onClick={() => onHighlightClick(index)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-light-border dark:ring-twitter-border ring-offset-2 ring-offset-light-bg dark:ring-offset-twitter-dark">
                <img src={highlight.coverUrl} alt={highlight.title} className="w-full h-full object-cover"/>
            </div>
            <p className="text-sm mt-2 truncate w-full text-center">{highlight.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfileHighlights;