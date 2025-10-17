
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Moment } from '../types';
import { PhotoIcon, ChevronLeftIcon } from './Icon';

interface MomentCreatorProps {
    onPostMoment: (content: Moment['content']) => void;
}

const gradientOptions = [
    'linear-gradient(to top right, #3b82f6, #6366f1)',
    'linear-gradient(to top right, #a855f7, #ec4899)',
    'linear-gradient(to top right, #22c55e, #14b8a6)',
    'linear-gradient(to top right, #f97316, #ef4444)',
];

const MomentCreator: React.FC<MomentCreatorProps> = ({ onPostMoment }) => {
    const [mode, setMode] = useState<'text' | 'image'>('text');
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [background, setBackground] = useState(gradientOptions[0]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setMode('image');
        }
    };

    const handlePost = () => {
        let content: Moment['content'];
        if (mode === 'image' && imageUrl) {
            content = { text, imageUrl };
        } else {
            content = { text, background };
        }
        if (text.trim()) {
            onPostMoment(content);
        }
    };

    return (
        <div className="h-full bg-black flex flex-col relative overflow-hidden items-center justify-center p-4">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <div className="w-full max-w-sm aspect-[9/16] rounded-2xl flex flex-col justify-between items-center p-4 relative" style={{ background: mode === 'image' ? `url(${imageUrl}) center/cover` : background }}>
                <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Create a moment..."
                    className="w-full h-full bg-transparent text-white text-2xl font-bold text-center focus:outline-none resize-none flex items-center justify-center z-10"
                />
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 z-20 space-y-4">
                 {mode === 'text' && (
                    <div className="flex justify-center items-center gap-2 p-2 bg-black/30 rounded-full">
                        {gradientOptions.map(grad => (
                            <button key={grad} onClick={() => setBackground(grad)} className="w-8 h-8 rounded-full border-2" style={{ background: grad, borderColor: background === grad ? 'white' : 'transparent' }} />
                        ))}
                    </div>
                 )}
                 <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-white/20 text-white font-bold text-lg p-3 rounded-full backdrop-blur-sm">
                        <PhotoIcon />
                    </button>
                    <button onClick={handlePost} disabled={!text.trim()} className="flex-1 bg-white text-black font-bold text-lg p-3 rounded-full disabled:opacity-50">
                        Share Moment
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default MomentCreator;
