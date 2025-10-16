import React, { useMemo } from 'react';

interface AudioWaveformProps {
  progress: number;
  isOwnMessage: boolean;
  isTweetPlayer?: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ progress, isOwnMessage, isTweetPlayer = false }) => {
  const bars = useMemo(() => Array.from({ length: 30 }, () => Math.random()), []);

  const barBg = isTweetPlayer ? 'bg-twitter-gray/30' : 'bg-black/20 dark:bg-white/20';
  const barFg = isOwnMessage ? 'bg-white' : 'bg-twitter-blue';

  return (
    <div className="w-full h-8 flex items-center gap-0.5">
      {bars.map((height, index) => {
        const barProgress = (index / bars.length) * 100;
        const isActive = progress > barProgress;
        return (
          <div
            key={index}
            className="w-full rounded-full"
            style={{
              height: `${10 + height * 80}%`,
              backgroundColor: isActive ? barFg : barBg,
              transition: 'background-color 0.1s ease-in-out'
            }}
          />
        );
      })}
    </div>
  );
};

export default AudioWaveform;