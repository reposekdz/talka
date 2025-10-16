import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LightboxProps {
  imageUrl: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ imageUrl, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-3xl z-20 font-light hover:scale-110 transition-transform">✕</button>
        <motion.div
            layoutId={imageUrl}
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={e => e.stopPropagation()}
        >
            <img src={imageUrl} alt="Lightbox view" className="object-contain max-w-full max-h-full rounded-lg shadow-2xl"/>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
