import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tweet, User } from '../types';
import { CloseIcon, SparklesIcon } from './Icon';
import TweetCard from './TweetCard';
import { mockUser } from '../data/mockData';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';

interface GrokAnalysisModalProps {
  tweet: Tweet;
  onClose: () => void;
  onTranslateTweet: (tweetId: string) => void;
  onPinTweet: (tweetId: string) => void;
  onFeatureTweet: (tweetId: string) => void;
  onOpenChat: (user: User) => void;
  onLikeTweet: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onDeleteTweet: (tweetId: string) => void;
  liveReactions: { id: number; emoji: string; tweetId: string }[];
}

const GrokAnalysisModal: React.FC<GrokAnalysisModalProps> = ({ tweet, onClose, onTranslateTweet, onPinTweet, onFeatureTweet, onOpenChat, onLikeTweet, onRetweet, onDeleteTweet, liveReactions }) => {
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!process.env.API_KEY) {
                    throw new Error("API_KEY environment variable not set.");
                }
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                const prompt = `Provide a brief, insightful analysis of this social media post. Explain the context, potential impact, and key takeaways. Be concise and use markdown for formatting.\n\nPost by @${tweet.user.username}:\n"${tweet.content}"`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setAnalysis(response.text);
            } catch (err) {
                console.error("Error fetching Grok analysis:", err);
                setError("Sorry, I couldn't analyze this post right now.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [tweet]);
    
    const analysisHtml = marked.parse(analysis);

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-10"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg w-full max-w-[600px] max-h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border">
                    <button onClick={onClose} className="p-2 text-xl hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full">✕</button>
                    <div className="flex items-center gap-2 font-bold">
                        <SparklesIcon className="text-purple-500" />
                        <span>AI Analysis</span>
                    </div>
                    <div className="w-10"></div>
                </header>
                <div className="flex-1 overflow-y-auto">
                    <TweetCard 
                        tweet={tweet} 
                        currentUser={mockUser} 
                        onImageClick={() => {}} 
                        onViewProfile={() => {}} 
                        onReply={() => {}} 
                        onToggleBookmark={() => {}} 
                        onVote={() => {}} 
                        onQuote={() => {}} 
                        onEdit={() => {}} 
                        onGrok={() => {}} 
                        onTranslateTweet={onTranslateTweet} 
                        onPinTweet={onPinTweet} 
                        onFeatureTweet={onFeatureTweet}
                        onOpenChat={onOpenChat} 
                        onLikeTweet={onLikeTweet} 
                        onRetweet={onRetweet}
                        onDeleteTweet={onDeleteTweet}
                        liveReactions={liveReactions} 
                    />
                    <div className="p-4">
                        {isLoading && <p>Analyzing...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {analysis && <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: analysisHtml}} />}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default GrokAnalysisModal;