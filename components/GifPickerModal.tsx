
import React, { useState } from 'react';

interface GifPickerModalProps {
  onClose: () => void;
  onSelectGif: (url: string) => void;
}

const mockGifs = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3dmaXRsdm9rZ2Z2d2FqMHk0am54ZWNpOHdza211MmV4bDl2d213bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VbnUQpnihPSIgIXuZv/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG12ZHBtd29hMXAyb25rN2N4cHJldWk2aDZoemx5d2Q3aDdqM3NqZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o72F5tx9CEhSDxonC/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzh6MGFjcmg3dmM3N2M3amI3N2E2aHRyNmlrMW9rbnlscHR2aDdycyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2zbskZp2j8wniE/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHQ4cjV1M2R0a2Fsc2dxeDRucG83NHo2aWFwYmQ2cmQ0cnl6dDJldyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WJjA8j7iL3pja/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDBzZndsaG50am9oc2R5MnhnaHhyc25zY29jZ3VqOWlqcWZnZ2IyaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/y8fXirTJjj6E0/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmZnZzJ1eTFvcmhwbDV6cDh4cGphcDIzeHZ1eTJjbHV4dmZpOWp4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M9gbBd9nbDrOTu1Mqx/giphy.gif',
];

const GifPickerModal: React.FC<GifPickerModalProps> = ({ onClose, onSelectGif }) => {
    const [searchTerm, setSearchTerm] = useState('');

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-2xl w-[600px] max-w-[90vw] h-[80vh] flex flex-col p-4 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
            <button onClick={onClose} className="text-2xl font-light hover:scale-110 transition-transform">✕</button>
            <h2 className="text-xl font-bold">Search for GIFs</h2>
            <div></div>
        </div>
        <input
            type="text"
            placeholder="Search for GIFs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-4 py-2 mb-4 focus:outline-none"
        />
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-2">
            {mockGifs.map(url => (
                <div key={url} className="aspect-square cursor-pointer" onClick={() => onSelectGif(url)}>
                    <img src={url} alt="gif" className="w-full h-full object-cover rounded-md" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GifPickerModal;
