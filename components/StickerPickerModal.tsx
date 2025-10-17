import React from 'react';
import { motion } from 'framer-motion';
import { CloseIcon } from './Icon';
import { mockStickers } from '../data/mockData';

interface StickerPickerModalProps {
  onClose: () => void;
  onSelectSticker: (url: string) => void;
}

const StickerPickerModal: React.FC<StickerPickerModalProps> = ({ onClose, onSelectSticker }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-light-bg dark:bg-twitter-dark w-full max-w-md h-[70vh] rounded-2xl flex flex-col shadow-lg"
      >
        <header className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
            <h2 className="font-bold text-lg">Add Sticker</h2>
          </div>
        </header>
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-3 gap-4">
          {mockStickers.map((sticker, index) => (
            <div key={index} className="aspect-square cursor-pointer" onClick={() => onSelectSticker(sticker)}>
              <img src={sticker} alt="Sticker" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StickerPickerModal;
