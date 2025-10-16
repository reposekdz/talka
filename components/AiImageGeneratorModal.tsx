
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { CloseIcon, SparklesIcon } from './Icon';

interface AiImageGeneratorModalProps {
    onClose: () => void;
    onAttachImage: (base64Image: string) => void;
}

const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const dotVariants: Variants = {
    initial: { y: 0 },
    animate: { y: [0, -4, 0], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } }
};

const LoadingIndicator: React.FC = () => (
    <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex items-center justify-center gap-4 text-twitter-blue my-8"
    >
        <motion.div variants={dotVariants} className="w-3 h-3 rounded-full bg-current" />
        <motion.div variants={dotVariants} className="w-3 h-3 rounded-full bg-current" />
        <motion.div variants={dotVariants} className="w-3 h-3 rounded-full bg-current" />
    </motion.div>
);

const AiImageGeneratorModal: React.FC<AiImageGeneratorModalProps> = ({ onClose, onAttachImage }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                },
            });
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            setGeneratedImage(base64ImageBytes);
        } catch (e) {
            console.error("Error generating image:", e);
            setError('Failed to generate image. The model may have refused the prompt. Please try again with a different prompt.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttach = () => {
        if (generatedImage) {
            onAttachImage(`data:image/png;base64,${generatedImage}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-light-bg dark:bg-twitter-dark w-full max-w-lg rounded-2xl flex flex-col shadow-lg"
            >
                <header className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border">
                    <div className="flex items-center gap-2 font-bold">
                       <SparklesIcon className="w-6 h-6 text-twitter-blue" />
                       <span>Generate Image with AI</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
                </header>

                <div className="p-4 space-y-4">
                    <div>
                        <label htmlFor="ai-prompt" className="font-semibold mb-1 block">Prompt</label>
                        <textarea
                            id="ai-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A cat wearing sunglasses, photorealistic"
                            className="w-full bg-light-border dark:bg-twitter-light-dark rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                            rows={3}
                        />
                    </div>
                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading || !prompt.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-twitter-blue text-white font-bold py-2 rounded-full disabled:opacity-50"
                    >
                        {isLoading ? 'Generating...' : <> <SparklesIcon className="w-5 h-5"/> Generate </>}
                    </button>
                    
                    <div className="aspect-square bg-light-hover dark:bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                        {isLoading && <LoadingIndicator />}
                        {error && <p className="text-red-500 p-4 text-center">{error}</p>}
                        {generatedImage && (
                            <img src={`data:image/png;base64,${generatedImage}`} alt="AI generated" className="w-full h-full object-cover"/>
                        )}
                        {!isLoading && !generatedImage && !error && (
                             <p className="text-light-secondary-text dark:text-twitter-gray">Your image will appear here</p>
                        )}
                    </div>
                </div>

                <footer className="p-4 border-t border-light-border dark:border-twitter-border">
                    <button 
                        onClick={handleAttach} 
                        disabled={!generatedImage}
                        className="w-full bg-white text-black font-bold py-2 rounded-full disabled:opacity-50"
                    >
                        Attach to Post
                    </button>
                </footer>
            </motion.div>
        </div>
    );
};

export default AiImageGeneratorModal;
