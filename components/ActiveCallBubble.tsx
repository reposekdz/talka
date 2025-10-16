import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Call } from '../types';
import { MaximizeIcon, MicOffIcon, EndCallIcon } from './Icon';

interface ActiveCallBubbleProps {
    call: Call;
    onMaximize: () => void;
    onEndCall: () => void;
}

const ActiveCallBubble: React.FC<ActiveCallBubbleProps> = ({ call, onMaximize, onEndCall }) => {
    const [callDuration, setCallDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragConstraints={{ top: 16, left: 16, right: window.innerWidth - 200, bottom: window.innerHeight - 80 }}
            className="fixed bottom-24 right-4 sm:right-8 md:right-16 z-50 w-48 h-16 bg-light-bg/80 dark:bg-twitter-light-dark/80 dim:bg-dim-bg/80 backdrop-blur-md rounded-full shadow-2xl flex items-center p-2 cursor-grab active:cursor-grabbing"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
        >
            <img src={call.user.avatarUrl} alt={call.user.displayName} className="w-12 h-12 rounded-full"/>
            <div className="flex-1 text-center" onClick={onMaximize}>
                <p className="text-sm font-semibold">{call.user.displayName}</p>
                <p className="text-xs text-light-secondary-text dark:text-twitter-gray">{formatDuration(callDuration)}</p>
            </div>
            <button onClick={onEndCall} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center mr-1">
                <EndCallIcon className="w-4 h-4" />
            </button>
             {call.isMicMuted && <div className="absolute top-0 right-10 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-light-bg dark:border-twitter-dark"><MicOffIcon className="w-2 h-2 text-white" /></div>}
        </motion.div>
    );
};

export default ActiveCallBubble;
