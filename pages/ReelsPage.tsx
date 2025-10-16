
import React, { useMemo, useState } from 'react';
import { mockTweets } from '../data/mockData';
import ReelCard from '../components/ReelCard';
import ReelComments from '../components/ReelComments';
import { AnimatePresence } from 'framer-motion';

const ReelsPage: React.FC = () => {
  const [commentsReelId, setCommentsReelId] = useState<string | null>(null);

  const videoReels = useMemo(
    () => mockTweets.filter(t => t.mediaUrls && t.mediaUrls.some(url => url.endsWith('.mp4'))),
    []
  );

  const handleOpenComments = (reelId: string) => {
    setCommentsReelId(reelId);
  };
  
  const handleCloseComments = () => {
    setCommentsReelId(null);
  };
  
  const selectedReel = videoReels.find(r => r.id === commentsReelId);

  return (
    <div className="relative h-screen w-full flex justify-center bg-black overflow-hidden">
      <div className="absolute top-0 left-0 p-4 z-20">
          <h1 className="text-xl font-bold text-white drop-shadow-lg">Reels</h1>
      </div>
      <div className="h-screen w-full max-w-[480px] overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
        {videoReels.map(reel => (
          <ReelCard 
            key={reel.id} 
            reel={reel}
            onCommentClick={() => handleOpenComments(reel.id)} 
          />
        ))}
      </div>
      <AnimatePresence>
        {commentsReelId && selectedReel && (
          <ReelComments
            reel={selectedReel}
            onClose={handleCloseComments}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReelsPage;