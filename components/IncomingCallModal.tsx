import React from 'react';
import { motion } from 'framer-motion';
import { Call } from '../types';
import { PhoneIcon, VideoCallIcon } from './Icon';

interface IncomingCallModalProps {
  call: Call;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ call, onAccept, onDecline }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-light-bg dark:bg-twitter-light-dark dim:bg-dim-bg p-6 rounded-2xl shadow-2xl z-50 w-full max-w-sm border border-light-border dark:border-twitter-border"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
            <img src={call.user.avatarUrl} alt={call.user.displayName} className="w-20 h-20 rounded-full" />
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping"></div>
        </div>
        <h2 className="text-xl font-bold">{call.user.displayName}</h2>
        <p className="text-light-secondary-text dark:text-twitter-gray">Incoming {call.type} call...</p>
        
        <div className="flex justify-around w-full mt-6">
            <div className="flex flex-col items-center">
                <button onClick={onDecline} className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center transform hover:scale-105 transition-transform">
                    <PhoneIcon className="transform -rotate-[135deg]"/>
                </button>
                <span className="mt-2 text-sm">Decline</span>
            </div>
             <div className="flex flex-col items-center">
                <button onClick={onAccept} className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center transform hover:scale-105 transition-transform">
                    {call.type === 'video' ? <VideoCallIcon /> : <PhoneIcon />}
                </button>
                <span className="mt-2 text-sm">Accept</span>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IncomingCallModal;
