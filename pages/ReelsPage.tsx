
import React, { useMemo } from 'react';
import { mockTweets } from '../data/mockData';
import ReelCard from '../components/ReelCard';

const ReelsPage: React.FC = () => {
  const videoReels = useMemo(
    () => mockTweets.filter(t => t.mediaUrls && t.mediaUrls.some(url => url.endsWith('.mp4'))),
    []
  );

  return (
    <div className="relative h-screen w-full flex justify-center bg-black">
      <div className="absolute top-0 left-0 p-4 z-10">
          <h1 className="text-xl font-bold text-white drop-shadow-lg">Reels</h1>
      </div>
      <div className="h-screen w-full max-w-[480px] overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
        {videoReels.map(reel => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
};

export default ReelsPage;