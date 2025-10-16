
import React from 'react';
import { VideoCallIcon } from './Icon';

const LiveCard: React.FC = () => {
  return (
    <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
      <div className="relative rounded-2xl overflow-hidden cursor-pointer group">
        <img src="https://picsum.photos/seed/live/600/338" alt="Live event" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">LIVE</div>
        <div className="absolute bottom-2 left-2 text-white drop-shadow-lg">
            <h3 className="font-bold text-lg">Live Coding Session: Building a Twitter Clone</h3>
            <p className="text-sm">with React Dev</p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
            <VideoCallIcon/>
        </div>
      </div>
    </div>
  );
};

export default LiveCard;
