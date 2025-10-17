import React from 'react';
import { mockSpaces } from '../data/mockData';
import { Space } from '../types';
import { SpacesIcon } from './Icon';
import { motion } from 'framer-motion';

interface SpacesCardProps {
    onJoinSpace: (space: Space) => void;
}

const SpacesCard: React.FC<SpacesCardProps> = ({ onJoinSpace }) => {
    const space = mockSpaces[0]; // For demo, always show the first space

    return (
        <motion.div 
            className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
            <div className={`relative p-4 rounded-2xl overflow-hidden text-white bg-space-gradient`}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2">
                        <SpacesIcon />
                        <h3 className="font-bold">Happening Now</h3>
                    </div>
                    <h2 className="text-2xl font-bold my-2">{space.title}</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {space.speakers.slice(0, 3).map(speaker => (
                                <img key={speaker.id} src={speaker.avatarUrl} alt={speaker.displayName} className="w-6 h-6 rounded-full border-2 border-current"/>
                            ))}
                        </div>
                        <p className="text-sm">{space.listenerCount.toLocaleString()} listening</p>
                    </div>
                    <button 
                        onClick={() => onJoinSpace(space)}
                        className="mt-4 bg-white text-black font-bold px-4 py-2 rounded-full hover:bg-opacity-90 w-full text-center"
                    >
                        Listen live
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SpacesCard;