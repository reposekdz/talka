import React, { useRef, useEffect } from 'react';
import { mockReels } from '../data/mockData';
import ReelCard from '../components/ReelCard';
import { Reel, AppSettings } from '../types';

interface ReelsPageProps {
    onOpenComments: (reel: Reel) => void;
    settings: AppSettings;
}

const ReelsPage: React.FC<ReelsPageProps> = ({ onOpenComments, settings }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const autoplaySetting = settings.accessibilityDisplayAndLanguages.videoAutoplay;

    useEffect(() => {
        if (autoplaySetting === 'never') return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target.querySelector('video');
                    if (video) {
                        if (entry.isIntersecting) {
                            // Simple check for Wi-Fi vs cellular could be implemented here
                            // For this prototype, we'll assume 'on-wifi-only' and 'on-cellular-wifi' both allow play
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise.catch(error => {
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
            { threshold: 0.6 }
        );

        const reels = containerRef.current?.querySelectorAll('.reel-card-container');
        reels?.forEach((reel) => observer.observe(reel));

        return () => {
            reels?.forEach((reel) => observer.unobserve(reel));
        };
    }, [autoplaySetting]);

    return (
        <div 
            ref={containerRef}
            className="h-full w-full snap-y snap-mandatory overflow-y-auto no-scrollbar"
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
