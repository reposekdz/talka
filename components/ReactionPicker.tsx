
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const reactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect, onClose }) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    // FIX: Wrapped framer-motion props to bypass type errors.
    <motion.div
      ref={pickerRef}
      {...{
        initial: { opacity: 0, y: 10, scale: 0.8 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.8 },
        transition: { duration: 0.15, ease: 'easeOut' },
      }}
      className="absolute bottom-full mb-2 -left-2 bg-light-bg dark:bg-twitter-light-dark dim:bg-dim-bg p-2 rounded-full shadow-lg border border-light-border dark:border-twitter-border dim:border-dim-border z-20 flex gap-1"
    >
      {reactions.map(emoji => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="text-2xl p-1 rounded-full hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover transition-transform duration-150 hover:scale-125"
        >
          {emoji}
        </button>
      ))}
    </motion.div>
  );
};

export default ReactionPicker;
