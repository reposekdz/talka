import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingEmojisProps {
  emojis: { id: number; emoji: string }[];
  onComplete: (id: number) => void;
}

const FloatingEmojis: React.FC<FloatingEmojisProps> = ({ emojis, onComplete }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {emojis.map(({ id, emoji }) => (
          <motion.span
            key={id}
            initial={{ 
                y: 0, 
                x: "-50%",
                opacity: 1, 
                scale: 0.5 
            }}
            animate={{
              y: -500,
              opacity: 0,
              scale: 1.5,
              x: `${Math.random() * 100 - 50}%`,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: "easeOut",
            }}
            onAnimationComplete={() => onComplete(id)}
            className="absolute bottom-20 left-1/2 text-4xl"
            style={{ textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
          >
            {emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingEmojis;