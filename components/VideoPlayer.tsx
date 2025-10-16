import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon } from './Icon';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Ignore errors from unmounting during play, which is a common race condition.
                        if (error.name !== 'AbortError' && error.name !== 'NotSupportedError') {
                           console.error("Autoplay failed", error);
                        }
                    });
                }
            } else {
                video.pause();
            }
        },
        { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
        if (video) {
            video.pause();
        }
        observer.disconnect();
    };
  }, [src]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
        videoRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const updateProgress = () => setProgress(video.currentTime);
    const updatePlaying = () => setIsPlaying(!video.paused);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('play', updatePlaying);
    video.addEventListener('pause', updatePlaying);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('play', updatePlaying);
      video.removeEventListener('pause', updatePlaying);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <div 
        ref={containerRef}
        className="relative aspect-video w-full h-full bg-black rounded-lg overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        loop
        muted={isMuted}
        className="w-full h-full object-cover"
      />
      <AnimatePresence>
        {showControls && (
            // FIX: Wrapped framer-motion props to bypass type errors.
            <motion.div 
                {...{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
                <button onClick={handlePlayPause} className="text-white bg-black/50 rounded-full p-3">
                    {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8"/>}
                </button>
            </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showControls && (
            // FIX: Wrapped framer-motion props to bypass type errors.
            <motion.div 
                {...{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 20 },
                }}
                className="absolute bottom-0 left-0 right-0 p-3 text-white bg-gradient-to-t from-black/70 to-transparent"
            >
                <div className="w-full bg-white/30 h-1 rounded-full cursor-pointer">
                    <div className="bg-twitter-blue h-1 rounded-full" style={{ width: `${(progress/duration) * 100}%`}}/>
                </div>
                 <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                        <button onClick={toggleMute}>
                            {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 accent-white"
                        />
                    </div>
                    <span className="text-xs font-mono">{formatTime(progress)} / {formatTime(duration)}</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;