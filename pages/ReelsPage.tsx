import React, { useState, useRef, useEffect } from 'react';
import { Reel, Conversation, ReelComment } from '../types';
import ReelCard from '../components/ReelCard';
import { motion, useAnimation } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

interface ReelsPageProps {
  reels: Reel[];
  onPostComment: (reelId: string, text: string, replyTo?: ReelComment) => void;
  onLikeComment: (reelId: string, commentId: string) => void;
  onShareReel: (reelId: string, conversationIds: string[], message?: string) => void;
  conversations: Conversation[];
  onLikeReel: (reelId: string) => void;
  onDislikeReel: (reelId: string) => void;
  onToggleBookmark: (reelId: string) => void;
}

const ReelsPage: React.FC<ReelsPageProps> = (props) => {
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    const snapToReel = (index: number) => {
        const container = containerRef.current;
        if (!container) return;
        const reelHeight = container.clientHeight;
        controls.start({ y: -index * reelHeight });
        setCurrentReelIndex(index);
    };

    const bind = useDrag(
        ({ down, movement: [, my], velocity: [, vy], direction: [, dy], cancel }) => {
            if (down && Math.abs(my) > 50) {
                 const newIndex = currentReelIndex + (dy > 0 ? 1 : -1);
                 if (newIndex >= 0 && newIndex < props.reels.length) {
                    snapToReel(newIndex);
                 }
                 cancel();
            }
        },
        { axis: 'y', filterTaps: true, rubberband: 0.2 }
    );

    return (
        <div 
            ref={containerRef}
            className="h-screen w-full overflow-hidden relative bg-black"
        >
            <motion.div
                className="h-full w-full"
                animate={controls}
                transition={{ type: 'spring', stiffness: 500, damping: 50 }}
                {...bind()}
            >
                {props.reels.map((reel, index) => (
                    <div key={reel.id} className="h-full w-full flex items-center justify-center relative">
                       <ReelCard 
                            {...props}
                            reel={reel}
                            isCurrent={index === currentReelIndex}
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default ReelsPage;