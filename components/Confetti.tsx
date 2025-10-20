
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  fire: boolean;
}

const ConfettiPiece: React.FC<{ initialX: number; initialY: number; color: string }> = ({ initialX, initialY, color }) => {
  const x = initialX + (Math.random() - 0.5) * 500;
  const y = initialY + (Math.random() - 0.5) * 500;
  const rotate = Math.random() * 360;

  return (
    <motion.div
      className="absolute"
      style={{
        left: initialX,
        top: initialY,
        width: 8,
        height: 8,
        backgroundColor: color,
        borderRadius: '50%',
      }}
      animate={{
        x,
        y,
        scale: [1, 1.5, 0],
        rotate,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 1.5,
        ease: "easeOut",
      }}
    />
  );
};


const Confetti: React.FC<ConfettiProps> = ({ fire }) => {
  const [pieces, setPieces] = React.useState<React.ReactNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (fire) {
      const newPieces = [];
      const colors = ['#1DA1F2', '#FFAD1F', '#E0245E', '#794BC4', '#17BF63'];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      for (let i = 0; i < 100; i++) {
        newPieces.push(<ConfettiPiece key={i} initialX={centerX} initialY={centerY} color={colors[i % colors.length]} />);
      }
      setPieces(newPieces);
      setTimeout(() => setPieces([]), 2000);
    }
  }, [fire]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">{pieces}</div>;
};

export default Confetti;