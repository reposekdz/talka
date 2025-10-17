
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Tweet } from '../types';
import { CloseIcon, SparklesIcon } from './Icon';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';

interface AiSummaryModalProps {
  user: User;
  tweets: Tweet[];
  onClose: () => void;
}

const AiSummaryModal: React.FC<AiSummaryModalProps> = ({ user, tweets, onClose }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!process.env.API_KEY) {
                    throw new Error("API_KEY environment variable not set.");
                }
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                
                const tweetsContent = tweets.slice(0, 10).map(t => `- "${t.content}"`).join('\n');
                const prompt = `Provide a "catch me up" summary of what this user, ${user.displayName} (@${user.username}), has been posting about recently. Be conversational and concise, as if explaining it to a friend. Use markdown for formatting (like bullet points or bold text). Here are their recent posts:\n\n${tweetsContent}`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setSummary(response.text);
            } catch (err) {
                console.error("Error fetching AI summary:", err);
                setError("Sorry, I couldn't generate a summary right now.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSummary();
    }, [user, tweets]);
    
    const summaryHtml = marked.parse(summary);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-light-bg dark:bg-twitter-dark w-full max-w-lg rounded-2xl flex flex-col shadow-lg max-h-[80vh]"
            >
                <header className="p-2 pr-4 flex items-center justify-between border-b border-light-border dark:border-twitter-border">
                    <div className="flex items-center gap-2 font-bold">
                       <SparklesIcon className="w-6 h-6 text-purple-400" />
                       <span>Catch me up</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Here's what {user.displayName} has been up to:</h2>
                    {isLoading && <p>Thinking...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {summary && <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{__html: summaryHtml}} />}
                </div>
            </motion.div>
        </div>
    );
};

export default AiSummaryModal;
