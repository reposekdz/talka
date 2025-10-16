
import React, { useState } from 'react';
import { Reel, Conversation, ReelComment } from '../types';
import ReelCard from '../components/ReelCard';

interface ReelsPageProps {
  reels: Reel[];
  onPostComment: (reelId: string, text: string, replyTo?: ReelComment) => void;
  onLikeComment: (reelId: string, commentId: string) => void;
  onShareReel: (reelId: string, conversationIds: string[], message?: string) => void;
  conversations: Conversation[];
}

const ReelsPage: React.FC<ReelsPageProps> = ({ reels, onPostComment, onLikeComment, onShareReel, conversations }) => {
    const [currentReelIndex, setCurrentReelIndex] = useState(0);

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight } = event.currentTarget;
        const index = Math.round(scrollTop / clientHeight);
        if (index !== currentReelIndex) {
            setCurrentReelIndex(index);
        }
    };
    
    return (
        <div 
            className="h-screen w-full snap-y snap-mandatory overflow-y-scroll no-scrollbar"
            onScroll={handleScroll}
        >
            {reels.map((reel, index) => (
                <div key={reel.id} className="h-full w-full snap-start flex items-center justify-center bg-black relative">
                   <ReelCard 
                        reel={reel}
                        isCurrent={index === currentReelIndex}
                        onPostComment={onPostComment}
                        onLikeComment={onLikeComment}
                        onShareReel={onShareReel}
                        conversations={conversations}
                    />
                </div>
            ))}
        </div>
    );
};

export default ReelsPage;
