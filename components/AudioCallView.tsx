
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { EndCallIcon, MicOffIcon, MicrophoneIcon, VolumeUpIcon } from './Icon';

interface AudioCallViewProps {
  user: User;
  status: 'outgoing' | 'active';
  onEndCall: () => void;
}

const AudioCallView: React.FC<AudioCallViewProps> = ({ user, status, onEndCall }) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (status !== 'active') return;
    const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  const controlButtonClasses = "p-4 rounded-full transition-colors duration-200 text-white";

  return (
    // FIX: Wrapped framer-motion props to bypass type errors.
    <motion.div
      {...{
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
      }}
      className="fixed inset-0 bg-gray-800 z-50 flex flex-col justify-between items-center p-8"
      style={{
          backgroundImage: `url(${user.avatarUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl"></div>
      
      <div className="relative z-10 text-white text-center">
        <h2 className="text-3xl font-bold">{user.displayName}</h2>
        <p className="text-lg mt-2">
            {status === 'outgoing' ? 'Ringing...' : `Audio Call - ${formatDuration(callDuration)}`}
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
            <img src={user.avatarUrl} alt={user.displayName} className="w-48 h-48 rounded-full border-4 border-white shadow-2xl" />
            {status === 'active' && <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping"></div>}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-6">
        <button onClick={() => setIsMicMuted(!isMicMuted)} className={`${controlButtonClasses} ${isMicMuted ? 'bg-white text-black' : 'bg-white/20'}`}>
          {isMicMuted ? <MicOffIcon /> : <MicrophoneIcon />}
        </button>
        <button className={`${controlButtonClasses} bg-white/20`}>
          <VolumeUpIcon />
        </button>
        <button onClick={onEndCall} className={`${controlButtonClasses} bg-red-600`}>
          <EndCallIcon />
        </button>
      </div>
    </motion.div>
  );
};

export default AudioCallView;
