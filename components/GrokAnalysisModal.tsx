import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { CloseIcon, SparklesIcon } from './Icon';
import { Tweet } from '../types';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';
import TweetCard from './TweetCard'; // Using a simplified version for display
import { mockUser } from '../data/mockData';


interface GrokAnalysisModalProps {
    tweet: Tweet | null;
    onClose: () => void;
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


const GrokAnalysisModal: React.FC<GrokAnalysisModalProps> = ({ tweet, onClose }) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (tweet) {
            const generateAnalysis = async () => {
                setIsLoading(true);
                setAnalysis(null);
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                    const prompt = `Provide a concise analysis of the following tweet. Structure your response in Markdown with these sections: "**Sentiment**", "**Key Topics**", and "**Summary**".\n\nTweet: "${tweet.content}"`;
                    
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: [{ parts: [{ text: prompt }] }],
                    });
                    
                    setAnalysis(response.text);
                } catch (error) {
                    console.error("Error generating analysis:", error);
                    setAnalysis("Sorry, I couldn't analyze this post right now. Please try again later.");
                } finally {
                    setIsLoading(false);
                }
            };
            generateAnalysis();
        }
    }, [tweet]);

    return (
        <AnimatePresence>
            {tweet && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg w-full max-w-2xl h-auto max-h-[90vh] rounded-2xl flex flex-col shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                            <div className="flex items-center gap-2 text-twitter-blue font-bold">
                                <SparklesIcon />
                                <span>Analysis</span>
                            </div>
                            <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
                        </header>

                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="border border-light-border dark:border-twitter-border rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                    <img src={tweet.user.avatarUrl} alt={tweet.user.displayName} className="w-6 h-6 rounded-full" />
                                    <span className="font-bold">{tweet.user.displayName}</span>
                                    <span className="text-sm text-light-secondary-text dark:text-twitter-gray">@{tweet.user.username}</span>
                                </div>
                                <p className="mt-2">{tweet.content}</p>
                            </div>

                            <div className="mt-4">
                                {isLoading && <LoadingIndicator />}
                                {analysis && (
                                    <div 
                                        className="prose prose-sm dark:prose-invert max-w-none" 
                                        dangerouslySetInnerHTML={{ __html: marked.parse(analysis) }} 
                                    />
                                )}
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GrokAnalysisModal;