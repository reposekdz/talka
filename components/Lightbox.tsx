import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from './Icon';

interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const Lightbox: React.FC<LightboxProps> = ({ images, startIndex, onClose }) => {
    const [[page, direction], setPage] = useState([startIndex, 0]);

    const paginate = (newDirection: number) => {
        let newIndex = page + newDirection;
        if (newIndex < 0) {
            newIndex = images.length - 1;
        } else if (newIndex >= images.length) {
            newIndex = 0;
        }
        setPage([newIndex, newDirection]);
    };
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                paginate(1);
            } else if (e.key === 'ArrowLeft') {
                paginate(-1);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [page]);


  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-20 font-light hover:scale-110 transition-transform">✕</button>
        
        <AnimatePresence initial={false} custom={direction}>
            <motion.img
                key={page}
                src={images[page]}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x);
                    if (swipe > 50) {
                        paginate(offset.x > 0 ? -1 : 1);
                    }
                }}
                className="absolute max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={e => e.stopPropagation()}
            />
        </AnimatePresence>
        
        {images.length > 1 && (
            <>
                <button 
                    onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white hover:bg-black/60"
                >
                    <ChevronLeftIcon />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); paginate(1); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 rounded-full text-white hover:bg-black/60"
                >
                    <ChevronRightIcon />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i === page ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                </div>
            </>
        )}
      </motion.div>
  );
};

export default Lightbox;