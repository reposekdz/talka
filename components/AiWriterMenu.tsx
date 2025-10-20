
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AiWriterAction } from '../types';
import { SparklesIcon, RefreshIcon } from './Icon';
import { GoogleGenAI } from '@google/genai';

interface AiWriterMenuProps {
    currentText: string;
    onApplyText: (newText: string) => void;
    onClose: () => void;
}

const AiWriterMenu: React.FC<AiWriterMenuProps> = ({ currentText, onApplyText, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleAction = async (action: AiWriterAction) => {
        setIsLoading(true);
        setError(null);
        
        let prompt = '';
        switch (action) {
            case 'improve':
                prompt = `Improve the following text to make it clearer and more engaging:\n\n"${currentText}"`;
                break;
            case 'shorten':
                prompt = `Shorten the following text while keeping the main point:\n\n"${currentText}"`;
                break;
            case 'casual':
                prompt = `Rewrite the following text in a more casual and friendly tone:\n\n"${currentText}"`;
                break;
            case 'professional':
                 prompt = `Rewrite the following text in a more professional and formal tone:\n\n"${currentText}"`;
                break;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            onApplyText(response.text.trim().replace(/"/g, '')); // Remove quotes from response
            onClose();
        } catch (e) {
            console.error('AI Writer Error:', e);
            setError('Could not process request.');
        } finally {
            setIsLoading(false);
        }
    };

    const menuItems: { action: AiWriterAction, label: string }[] = [
        { action: 'improve', label: 'Improve Writing' },
        { action: 'shorten', label: 'Make Shorter' },
        { action: 'casual', label: 'Make it Casual' },
        { action: 'professional', label: 'Make it Professional' },
    ];

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-4 transform -translate-y-full w-56 bg-light-bg/80 dark:bg-twitter-dark/80 backdrop-blur-xl rounded-lg shadow-lg border border-light-border/50 dark:border-twitter-border/50 z-10 overflow-hidden"
        >
            {isLoading ? (
                <div className="p-4 flex items-center justify-center gap-2">
                    <RefreshIcon className="animate-spin w-5 h-5" />
                    <span>Thinking...</span>
                </div>
            ) : error ? (
                 <div className="p-4 text-red-500 text-center">{error}</div>
            ) : (
                <ul>
                    {menuItems.map(item => (
                        <li key={item.action}>
                            <button onClick={() => handleAction(item.action)} className="w-full text-left p-3 hover:bg-light-hover dark:hover:bg-white/10 flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4 text-twitter-blue" />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </motion.div>
    );
};

export default AiWriterMenu;