

import React from 'react';
import { Highlight } from '../types';
import { motion } from 'framer-motion';
import { PlusIcon } from './Icon';

interface ProfileHighlightsProps {
  highlights: Highlight[];
  isOwnProfile: boolean;
  onHighlightClick: (highlight: Highlight) => void;
  onOpenCreateHighlight: () => void;
}

const ProfileHighlights: React.FC<ProfileHighlightsProps> = ({ highlights, isOwnProfile, onHighlightClick, onOpenCreateHighlight }) => {
  return (
    <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Highlights</h2>
        <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mb-4">
            Keep your favorite stories on your profile
        </p>
      <div className="flex gap-4 overflow-x-auto no-scrollbar py-4">
        {isOwnProfile && (
            <div className="flex flex-col items-center flex-shrink-0 w-20">
                <button 
                    onClick={onOpenCreateHighlight} 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-light-secondary-text dark:text-twitter-gray transition-all duration-300 neumorphic-light dark:neumorphic-dark hover:scale-105"
                >
                    <PlusIcon />
                </button>
                <p className="text-sm mt-2">New</p>
            </div>
        )}
        {highlights.map((highlight) => (
          <motion.div 
            key={highlight.id} 
            className="flex flex-col items-center flex-shrink-0 w-20 cursor-pointer"
            onClick={() => onHighlightClick(highlight)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 p-0.5 rounded-full neumorphic-light dark:neumorphic-dark">
                <div className="w-full h-full rounded-full overflow-hidden transition-all duration-300 hover:scale-105">
                    <img src={highlight.coverUrl} alt={highlight.title} className="w-full h-full object-cover"/>
                </div>
            </div>
            <p className="text-sm mt-2 truncate w-full text-center">{highlight.title}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfileHighlights;