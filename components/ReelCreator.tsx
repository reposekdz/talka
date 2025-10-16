import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoIcon } from './Icon';

interface ReelCreatorProps {
    onPostReel: (videoUrl: string, caption: string) => void;
}

const ReelCreator: React.FC<ReelCreatorProps> = ({ onPostReel }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [step, setStep] = useState<'upload' | 'caption'>('upload');
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            setStep('caption');
        }
    };

    const handlePost = () => {
        if (!videoUrl) return;
        onPostReel(videoUrl, caption);
    };

    return (
        <div className="h-full bg-light-bg dark:bg-black flex flex-col relative overflow-hidden">
            <AnimatePresence mode="wait">
                {step === 'upload' && (
                    <motion.div
                        key="upload"
                        exit={{ opacity: 0, x: -100 }}
                        className="h-full flex flex-col items-center justify-center text-center p-4"
                    >
                         <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                         <PhotoIcon />
                         <h2 className="text-2xl font-bold mt-4">Create a Reel</h2>
                         <p className="text-light-secondary-text dark:text-twitter-gray mt-2 mb-6">Select a video file to get started.</p>
                         <button onClick={() => fileInputRef.current?.click()} className="bg-twitter-blue text-white font-bold px-6 py-3 rounded-full">
                             Select From Device
                         </button>
                    </motion.div>
                )}

                {step === 'caption' && videoUrl && (
                    <motion.div
                        key="caption"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="h-full flex flex-col md:flex-row gap-4 p-4"
                    >
                        <div className="w-full md:w-1/2 aspect-[9/16] bg-black rounded-lg overflow-hidden flex-shrink-0">
                            <video src={videoUrl} autoPlay loop muted className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <h2 className="text-xl font-bold mb-2">Add a caption</h2>
                            <textarea 
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write a caption..."
                                className="w-full h-32 bg-light-hover dark:bg-white/5 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                            />
                            {/* Placeholder for more options */}
                            <div className="my-4 p-4 border border-dashed border-light-border dark:border-twitter-border rounded-lg text-center text-light-secondary-text dark:text-twitter-gray">
                                Add Music, Effects, and more... (Coming soon)
                            </div>
                            <div className="mt-auto flex gap-4">
                                <button onClick={() => setStep('upload')} className="flex-1 bg-light-hover dark:bg-white/10 font-bold p-3 rounded-full">Back</button>
                                <button onClick={handlePost} className="flex-1 bg-twitter-blue text-white font-bold p-3 rounded-full">Share Reel</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReelCreator;
