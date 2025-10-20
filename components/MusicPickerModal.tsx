
import React from 'react';
import { motion } from 'framer-motion';
import { CloseIcon, PlayIcon } from './Icon';
import { mockMusic } from '../data/mockData';

interface MusicPickerModalProps {
  onClose: () => void;
  onSelectMusic: (music: { artist: string; title: string }) => void;
}

const MusicPickerModal: React.FC<MusicPickerModalProps> = ({ onClose, onSelectMusic }) => {
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
            <h2 className="font-bold text-lg">Add Music</h2>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          {mockMusic.map(music => (
            <div key={music.id} className="p-3 flex items-center gap-4 hover:bg-light-hover dark:hover:bg-white/5">
              <img src={music.coverUrl} alt={`${music.title} cover`} className="w-12 h-12 rounded-md" />
              <div className="flex-1">
                <p className="font-bold">{music.title}</p>
                <p className="text-sm text-light-secondary-text dark:text-twitter-gray">{music.artist}</p>
              </div>
              <button onClick={() => onSelectMusic(music)} className="bg-twitter-blue text-white font-bold px-4 py-1.5 rounded-full text-sm">
                Add
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MusicPickerModal;
