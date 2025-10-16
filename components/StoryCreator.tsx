import React, { useState, useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Story, TextOverlay } from '../types';
import { PencilIcon, PhotoIcon } from './Icon';

interface StoryCreatorProps {
    onPostStory: (newStory: Omit<Story, 'id' | 'timestamp'>) => void;
}

const colors = ['#FFFFFF', '#000000', '#1DA1F2', '#FFAD1F', '#E0245E', '#794BC4'];
const styles = [{ name: 'Classic', value: 'classic'}, { name: 'Neon', value: 'neon'}];

const StoryCreator: React.FC<StoryCreatorProps> = ({ onPostStory }) => {
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [text, setText] = useState('');
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [textStyle, setTextStyle] = useState<'classic' | 'neon'>('classic');
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setMediaUrl(url);
            setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
        }
    };

    const handlePost = () => {
        if (!mediaUrl) return;

        const newStory: Omit<Story, 'id' | 'timestamp'> = {
            mediaUrl,
            type: mediaType,
            duration: 5, // default duration
            textOverlays: text ? [{
                text,
                color: textColor,
                style: textStyle,
                position: textPosition
            }] : []
        };
        onPostStory(newStory);
    };

    const textStyles = {
        classic: {
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(0,0,0,0.4)',
            padding: '4px 12px',
            borderRadius: '6px'
        },
        neon: {
            textShadow: `0 0 5px ${textColor}, 0 0 10px ${textColor}, 0 0 15px ${textColor}`,
            backgroundColor: 'transparent',
            padding: '4px 12px'
        }
    }

    if (!mediaUrl) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-4">
                 <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                 <PhotoIcon />
                 <h2 className="text-2xl font-bold mt-4">Create a Story</h2>
                 <p className="text-light-secondary-text dark:text-twitter-gray mt-2 mb-6">Share a photo or video.</p>
                 <button onClick={() => fileInputRef.current?.click()} className="bg-twitter-blue text-white font-bold px-6 py-3 rounded-full">
                     Select File
                 </button>
            </div>
        )
    }

    return (
        <div className="h-full bg-black flex flex-col relative overflow-hidden">
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-end gap-4">
                <button onClick={() => {}} className="bg-black/50 p-3 rounded-full text-white"><PencilIcon /></button>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
                {mediaType === 'image' ? (
                     <img src={mediaUrl} alt="Story preview" className="max-h-full max-w-full object-contain" />
                ) : (
                    <video src={mediaUrl} autoPlay loop muted className="max-h-full max-w-full object-contain" />
                )}
                
                <motion.div
                    drag
                    dragMomentum={false}
                    onDragEnd={(event, info: PanInfo) => {
                         setTextPosition({ x: textPosition.x + info.offset.x, y: textPosition.y + info.offset.y });
                    }}
                    className="absolute cursor-grab active:cursor-grabbing"
                    style={{ x: textPosition.x, y: textPosition.y }}
                >
                    <input 
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Start typing"
                        className="bg-transparent text-3xl font-bold text-center w-auto focus:outline-none"
                        style={{ color: textColor, ...textStyles[textStyle] }}
                    />
                </motion.div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="flex items-center justify-center gap-2 mb-4">
                    {styles.map(s => (
                         <button key={s.value} onClick={() => setTextStyle(s.value as any)} className={`px-3 py-1 text-sm rounded-full border-2 ${textStyle === s.value ? 'border-white bg-white/30' : 'border-transparent'}`}>
                             {s.name}
                         </button>
                    ))}
                    <div className="w-px h-6 bg-white/30 mx-2"></div>
                    {colors.map(c => (
                        <button key={c} onClick={() => setTextColor(c)} className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: c, borderColor: textColor === c ? '#1DA1F2' : 'transparent' }} />
                    ))}
                </div>
                <button onClick={handlePost} className="w-full bg-white text-black font-bold text-lg p-3 rounded-full">
                    Share Story
                </button>
            </div>
        </div>
    );
};

export default StoryCreator;
