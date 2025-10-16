import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Space } from '../types';
import { CloseIcon, MicrophoneIcon, HandRaiseIcon, LeaveIcon, ChevronRightIcon, ChevronLeftIcon } from './Icon';

interface SpacesPlayerProps {
  space: Space;
  onClose: () => void;
}

const SpacesPlayer: React.FC<SpacesPlayerProps> = ({ space, onClose }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const controlButtonClasses = "p-3 rounded-full transition-colors duration-200 text-white";

    if (!isExpanded) {
        return (
            <motion.div
                layoutId={`space-player-${space.id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                onClick={() => setIsExpanded(true)}
                className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-16 z-40 p-3 rounded-2xl cursor-pointer ${space.color} text-white shadow-lg`}
            >
                <div className="flex items-center gap-3">
                    <MicrophoneIcon />
                    <div>
                        <p className="font-bold text-sm">{space.title}</p>
                        <p className="text-xs">{space.listenerCount.toLocaleString()} listening</p>
                    </div>
                    <ChevronLeftIcon />
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            layoutId={`space-player-${space.id}`}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className={`fixed bottom-0 sm:bottom-4 right-0 sm:right-4 z-40 w-full sm:w-96 h-full sm:h-[600px] rounded-t-2xl sm:rounded-2xl ${space.color} text-white shadow-2xl flex flex-col`}
        >
            <div className="p-4 flex justify-between items-center">
                <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-white/10 rounded-full"><ChevronRightIcon /></button>
                <h2 className="font-bold">Live Audio</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><CloseIcon /></button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <h1 className="text-3xl font-bold">{space.title}</h1>
                <div className="mt-4">
                    <h3 className="font-semibold text-white/80">Host</h3>
                    <div className="flex items-center gap-3 p-2">
                        <img src={space.host.avatarUrl} alt={space.host.displayName} className="w-12 h-12 rounded-full"/>
                        <div>
                            <p className="font-bold">{space.host.displayName}</p>
                            <p className="text-sm text-white/70">@{space.host.username}</p>
                        </div>
                    </div>
                </div>
                 <div className="mt-4">
                    <h3 className="font-semibold text-white/80">Speakers</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                       {space.speakers.map(speaker => (
                           <div key={speaker.id} className="flex flex-col items-center text-center">
                               <img src={speaker.avatarUrl} alt={speaker.displayName} className="w-16 h-16 rounded-full"/>
                               <p className="font-bold text-sm mt-1 truncate w-full">{speaker.displayName}</p>
                           </div>
                       ))}
                    </div>
                </div>
                 <div className="mt-4">
                    <h3 className="font-semibold text-white/80">Listeners ({space.listenerCount.toLocaleString()})</h3>
                     {/* Placeholder for listener grid */}
                </div>
            </div>

            <div className="p-4 border-t border-white/20 flex justify-between items-center">
                <button onClick={() => setIsMuted(!isMuted)} className={`${controlButtonClasses} ${isMuted ? 'bg-white/30' : 'bg-transparent border border-white/30'}`}>
                    <MicrophoneIcon />
                </button>
                 <button className={`${controlButtonClasses} bg-white/30`}>
                    <HandRaiseIcon />
                </button>
                <button onClick={onClose} className="text-red-400 font-bold flex items-center gap-2 py-2 px-4 rounded-full bg-white/20 hover:bg-white/30">
                    <LeaveIcon /> Leave
                </button>
            </div>
        </motion.div>
    );
};

export default SpacesPlayer;