import React, { useRef, useEffect } from 'react';
import { mockReels } from '../data/mockData';
import ReelCard from '../components/ReelCard';
import { Reel } from '../types';

interface ReelsPageProps {
    onOpenComments: (reel: Reel) => void;
}

const ReelsPage: React.FC<ReelsPageProps> = ({ onOpenComments }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target.querySelector('video');
                    if (video) {
                        if (entry.isIntersecting) {
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise.catch(error => {
                                    // Ignore the AbortError which can happen if the user scrolls
                                    // away quickly after the video starts playing.
                                    if (error.name !== 'AbortError') {
                                      console.error("Autoplay error:", error);
                                    }
                                });
                            }
                        } else {
                            video.pause();
                        }
                    }
                });
            },
            { threshold: 0.6 } // Increased threshold for more stable play/pause
        );

        const reels = containerRef.current?.querySelectorAll('.reel-card-container');
        reels?.forEach((reel) => observer.observe(reel));

        return () => {
            reels?.forEach((reel) => observer.unobserve(reel));
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="h-full w-full snap-y snap-mandatory overflow-y-auto"
        >
            {mockReels.map(reel => (
                <div key={reel.id} className="reel-card-container snap-start h-full w-full flex items-center justify-center bg-black">
                    <ReelCard reel={reel} onOpenComments={onOpenComments} />
                </div>
            ))}
        </div>
    );
};

export default ReelsPage;