import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const emojis = [
  '😀', '😂', '😍', '🤔', '😎', '😭', '😡', '👍',
  '👎', '❤️', '🔥', '🚀', '🎉', '💯', '🙏', '🤯'
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
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
    <motion.div
      ref={pickerRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-full mb-2 left-10 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg p-2 rounded-2xl shadow-lg border border-light-border dark:border-twitter-border dim:border-dim-border"
    >
      <div className="grid grid-cols-4 gap-2">
        {emojis.map(emoji => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-2xl p-2 rounded-lg hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default EmojiPicker;
