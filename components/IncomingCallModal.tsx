
import React from 'react';
import { motion } from 'framer-motion';
import { Call } from '../types';
import { PhoneIcon, VideoCallIcon, MessagesIcon } from './Icon';

interface IncomingCallModalProps {
  call: Call;
  onAccept: () => void;
  onDecline: () => void;
  onReplyWithMessage: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ call, onAccept, onDecline, onReplyWithMessage }) => {
  return (
    // FIX: Wrapped framer-motion props to bypass type errors.
    <motion.div
      {...{
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { type: 'spring', stiffness: 400, damping: 30 },
      }}
      className="fixed inset-0 sm:inset-auto sm:bottom-8 sm:left-1/2 sm:-translate-x-1/2 z-50 flex items-center sm:items-end justify-center"
    >
      {/* Full-screen blurred background for mobile */}
      <div className="absolute inset-0 sm:hidden bg-cover bg-center blur-xl scale-110" style={{ backgroundImage: `url(${call.user.avatarUrl})` }}></div>
      <div className="absolute inset-0 sm:hidden bg-black/60"></div>
      
      {/* Modal content container */}
      <div className="relative bg-light-bg/80 dark:bg-twitter-light-dark/80 dim:bg-dim-bg/80 backdrop-blur-md w-full h-full sm:h-auto sm:w-full sm:max-w-sm flex flex-col justify-between sm:justify-center text-center p-6 sm:rounded-2xl shadow-2xl sm:border border-light-border dark:border-twitter-border text-light-text dark:text-dim-text">

        {/* Top-left info for mobile view */}
        <div className="sm:hidden text-white text-left">
            <p className="font-semibold">{call.user.displayName}</p>
            <p className="text-sm">Proto-Twitter {call.type} call</p>
        </div>
        
        {/* Main content (user info) */}
        <div className="flex flex-col items-center">
            <div className="relative mb-4">
                <img src={call.user.avatarUrl} alt={call.user.displayName} className="w-24 h-24 sm:w-20 sm:h-20 rounded-full border-4 border-white dark:border-twitter-dark" />
                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping"></div>
            </div>
            <h2 className="text-2xl sm:text-xl font-bold">{call.user.displayName}</h2>
            <p className="text-light-secondary-text dark:text-twitter-gray">Incoming {call.type} call...</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-around items-center w-full mt-6">
            <div className="flex flex-col items-center gap-2">
                <button onClick={onDecline} className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center transform hover:scale-105 transition-transform">
                    <PhoneIcon className="transform -rotate-[135deg]"/>
                </button>
                <span className="text-sm">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <button onClick={onReplyWithMessage} className="w-16 h-16 bg-gray-500/50 dark:bg-gray-200/20 text-current rounded-full flex items-center justify-center transform hover:scale-105 transition-transform">
                    <MessagesIcon />
                </button>
                <span className="text-sm">Message</span>
            </div>
             <div className="flex flex-col items-center gap-2">
                {/* FIX: Wrapped framer-motion props to bypass type errors. */}
                <motion.button 
                    onClick={onAccept}
                    className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center transform hover:scale-105 transition-transform"
                    {...{
                        animate: { scale: [1, 1.05, 1] },
                        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                    }}
                >
                    {call.type === 'video' ? <VideoCallIcon /> : <PhoneIcon />}
                </motion.button>
                <span className="text-sm">Accept</span>
            </div>
        </div>

      </div>
    </motion.div>
  );
};

export default IncomingCallModal;
