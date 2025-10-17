
import React from 'react';
import { Moment, User } from '../types';
import { PlusIcon, MomentIcon } from './Icon';
import { motion } from 'framer-motion';
import MomentCard from './MomentCard';

interface MomentsReelProps {
  moments: Moment[];
  currentUser: User;
  onOpenCreator: () => void;
}

const CreateMomentCard: React.FC<{ onOpenCreator: () => void; }> = ({ onOpenCreator }) => (
    <div className="flex-shrink-0">
        <motion.div 
            onClick={onOpenCreator}
            className="relative w-28 h-48 rounded-xl bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover flex flex-col items-center justify-center p-2 text-center cursor-pointer group overflow-hidden"
            whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
        >
            <div className="relative z-10 flex flex-col items-center">
                <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-white border-4 border-light-bg dark:border-twitter-dark dim:border-dim-bg mb-2 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    <MomentIcon />
                </motion.div>
                <p className="text-sm font-bold text-light-text dark:text-dim-text">Add Moment</p>
            </div>
        </motion.div>
    </div>
);


const MomentsReel: React.FC<MomentsReelProps> = ({ moments, currentUser, onOpenCreator }) => {
  return (
    <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
       <h2 className="font-bold text-lg mb-2">Moments</h2>
      <div className="flex space-x-3 overflow-x-auto pb-2 -mb-2 no-scrollbar">
        <CreateMomentCard onOpenCreator={onOpenCreator} />
        {moments.map((moment) => (
            <MomentCard key={moment.id} moment={moment} />
        ))}
      </div>
    </div>
  );
};

export default MomentsReel;
