import React, { useRef, useEffect, useState } from 'react';
import ReelCard from '../components/ReelCard';
import { Reel, AppSettings, User } from '../types';

interface ReelsPageProps {
    reels: Reel[];
    currentUser: User;
    onOpenComments: (reel: Reel) => void;
    settings: AppSettings;
    onLikeReel: (reelId: string) => void;
    onDislikeReel: (reelId: string) => void;
    onBookmarkReel: (reelId: string) => void;
    onShareReel: (reel: Reel) => void;
    onFollowToggle: (userId: string) => void;
    onOpenOptions: (reel: Reel) => void;
}

const ReelsPage: React.FC<ReelsPageProps> = (props) => {
    const { reels, currentUser, onOpenComments, settings, onLikeReel, onDislikeReel, onBookmarkReel, onShareReel, onFollowToggle, onOpenOptions } = props;
    const [activeTab, setActiveTab] = useState<'For You' | 'Following'>('For You');
    const containerRef = useRef<HTMLDivElement>(null);
    const autoplaySetting = settings.accessibilityDisplayAndLanguages.videoAutoplay;

    useEffect(() => {
        if (autoplaySetting === 'never') return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const videos = entry.target.querySelectorAll('video');
                    videos.forEach((video) => {
                        if (entry.isIntersecting) {
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise.catch(error => {
                                    // Ignore errors that happen when the video is removed from the DOM during play.
                                    // This is a common, non-critical error in async media handling in React.
                                    if (error.name !== 'AbortError' && error.name !== 'NotSupportedError') {
                                      console.error("Autoplay error:", error);
                                    }
                                });
                            }
                        } else {
                            video.pause();
                        }
                    });
                });
            },
            { threshold: 0.6 }
        );

        const reelElements = containerRef.current?.querySelectorAll('.reel-card-container');
        reelElements?.forEach((reel) => observer.observe(reel));

        return () => {
            reelElements?.forEach((reel) => {
                const videos = reel.querySelectorAll('video');
                videos.forEach(video => video.pause());
                observer.unobserve(reel);
            });
        };
    }, [autoplaySetting, reels, activeTab]);
    
    const followingReels = reels.filter(reel => 
        currentUser.followingIds.includes(reel.user.id) || reel.user.id === currentUser.id
    );

    const displayedReels = activeTab === 'For You' ? reels : followingReels;

    return (
        <div className="h-full w-full flex flex-col bg-black relative">
             <header className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex justify-center items-center text-white font-bold h-14">
                    <button 
                        onClick={() => setActiveTab('Following')} 
                        className={`px-4 py-2 transition-colors ${activeTab === 'Following' ? 'text-white text-lg' : 'text-white/60'}`}
                    >
                        Following
                    </button>
                    <div className="h-4 w-px bg-white/40"></div>
                    <button 
                        onClick={() => setActiveTab('For You')} 
                        className={`px-4 py-2 transition-colors ${activeTab === 'For You' ? 'text-white text-lg' : 'text-white/60'}`}
                    >
                        For You
                    </button>
                </div>
            </header>

            <div 
                ref={containerRef}
                className="h-full w-full snap-y snap-mandatory overflow-y-auto no-scrollbar"
            >
                {displayedReels.map(reel => (
                    <div key={`${activeTab}-${reel.id}`} className="reel-card-container snap-start h-full w-full flex items-center justify-center">
                        <ReelCard 
                            reel={reel} 
                            currentUser={currentUser}
                            onOpenComments={onOpenComments}
                            onLike={onLikeReel}
                            onDislike={onDislikeReel}
                            onBookmark={onBookmarkReel}
                            onShare={onShareReel}
                            onFollowToggle={onFollowToggle}
                            onOpenOptions={onOpenOptions}
                        />
                    </div>
                ))}
                {displayedReels.length === 0 && activeTab === 'Following' && (
                    <div className="snap-start h-full w-full flex items-center justify-center text-center text-white/80 p-8">
                        <div>
                            <h2 className="text-2xl font-bold">No Reels Yet</h2>
                            <p>Reels from accounts you follow will appear here.</p>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ReelsPage;