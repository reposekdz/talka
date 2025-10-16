
import React, { useRef, useEffect } from 'react';
import { mockReels } from '../data/mockData';
import ReelCard from '../components/ReelCard';

const ReelsPage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target.querySelector('video');
                    if (video) {
                        if (entry.isIntersecting) {
                            video.play();
                        } else {
                            video.pause();
                        }
                    }
                });
            },
            { threshold: 0.5 }
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
            className="h-screen w-full snap-y snap-mandatory overflow-y-auto"
        >
            {mockReels.map(reel => (
                <div key={reel.id} className="reel-card-container snap-start h-screen w-full flex items-center justify-center bg-black">
                    <ReelCard reel={reel} />
                </div>
            ))}
        </div>
    );
};

export default ReelsPage;
