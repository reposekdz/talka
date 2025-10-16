import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from './Icon';

interface AudioPlayerProps {
  src: string;
  duration: number;
  isOwnMessage: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, duration, isOwnMessage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
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

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 w-56">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button onClick={togglePlayPause} className="flex-shrink-0">
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="w-full h-1.5 bg-black/20 dark:bg-white/20 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${isOwnMessage ? 'bg-white' : 'bg-twitter-blue'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className={`text-xs font-mono flex-shrink-0 ${isOwnMessage ? 'text-white/80' : 'text-light-secondary-text dark:text-twitter-gray'}`}>
        {formatTime(duration)}
      </span>
    </div>
  );
};

export default AudioPlayer;