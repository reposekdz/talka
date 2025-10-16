import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from './Icon';

interface AudioPlayerProps {
  src: string;
  duration: number; // Can be a placeholder for tweet audio
  isOwnMessage: boolean;
  isTweetPlayer?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, duration, isOwnMessage, isTweetPlayer = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [actualDuration, setActualDuration] = useState(duration);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const onLoadedMetadata = () => {
    if (audioRef.current) {
        setActualDuration(audioRef.current.duration);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);
  
  const formatTime = (seconds: number) => {
      if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const barBg = isTweetPlayer ? 'bg-twitter-gray/30' : 'bg-black/20 dark:bg-white/20';
  const barFg = isOwnMessage ? 'bg-white' : 'bg-twitter-blue';
  const textClass = isOwnMessage 
    ? 'text-white/80' 
    : isTweetPlayer 
        ? 'text-light-secondary-text dark:text-twitter-gray' 
        : 'text-light-secondary-text dark:text-twitter-gray';

  return (
    <div className={`flex items-center gap-2 ${isTweetPlayer ? 'w-full' : 'w-56'}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <button onClick={togglePlayPause} className="flex-shrink-0">
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className={`w-full h-1.5 ${barBg} rounded-full overflow-hidden`}>
        <div 
          className={`h-full rounded-full ${barFg}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className={`text-xs font-mono flex-shrink-0 ${textClass}`}>
        {formatTime(actualDuration)}
      </span>
    </div>
  );
};

export default AudioPlayer;