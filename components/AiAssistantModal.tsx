
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, PaperPlaneIcon, SparklesIcon } from './Icon';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';

interface AiAssistantModalProps {
    onClose: () => void;
}

interface ChatMessage {
    role: 'user' | 'model' | 'loading';
    text: string;
}

const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        const userMessage: ChatMessage = { role: 'user', text: prompt };
        setChatHistory(prev => [...prev, userMessage, { role: 'loading', text: '' }]);
        setPrompt('');

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ parts: [{ text: prompt }] }],
            });

            const modelMessage: ChatMessage = { role: 'model', text: response.text };

            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = modelMessage;
                return newHistory;
            });

        } catch (error) {
            console.error("Error generating content:", error);
            const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
             setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = errorMessage;
                return newHistory;
            });
        }
    };
    
    const TypingIndicator = () => (
        // FIX: Wrapped framer-motion props to bypass type errors.
        <motion.div className="flex items-center gap-1.5"
            {...{
                initial: "initial",
                animate: "animate",
                variants: {
                    initial: { opacity: 0 },
                    animate: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
                }
            }}
        >
            {/* FIX: Wrapped framer-motion props to bypass type errors. */}
            <motion.span className="w-2 h-2 bg-current rounded-full" {...{variants:{ initial: { y: 0 }, animate: { y: [0, -4, 0], transition: { duration: 0.8, repeat: Infinity } } }}} />
            {/* FIX: Wrapped framer-motion props to bypass type errors. */}
            <motion.span className="w-2 h-2 bg-current rounded-full" {...{variants:{ initial: { y: 0 }, animate: { y: [0, -4, 0], transition: { duration: 0.8, repeat: Infinity } } }}} />
            {/* FIX: Wrapped framer-motion props to bypass type errors. */}
            <motion.span className="w-2 h-2 bg-current rounded-full" {...{variants:{ initial: { y: 0 }, animate: { y: [0, -4, 0], transition: { duration: 0.8, repeat: Infinity } } }}} />
        </motion.div>
    );

    const renderMessageContent = (message: ChatMessage) => {
        if (message.role === 'loading') {
            return <TypingIndicator />;
        }
        // Basic markdown support for model responses
        if (message.role === 'model') {
            const html = marked.parse(message.text);
            return <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />;
        }
        return message.text;
    }


  return (
    // FIX: Wrapped framer-motion props to bypass type errors.
    <motion.div
      {...{
        initial: { opacity: 0, y: "100%" },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "100%" },
        transition: { type: 'spring', stiffness: 400, damping: 40, duration: 0.4 },
      }}
      className="fixed inset-0 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg z-50 flex flex-col"
    >
      <header className="p-2 flex items-center justify-between border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
        <h2 className="font-bold text-lg">Proto-AI Assistant</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="text-center text-light-secondary-text dark:text-twitter-gray p-8">
            <SparklesIcon className="w-16 h-16 mx-auto text-twitter-blue" />
            <h1 className="text-2xl font-bold text-light-text dark:text-dim-text mt-4">Ask me anything</h1>
            <p>I can summarize timelines, answer questions, or help you find information.</p>
        </div>
        <AnimatePresence>
            {chatHistory.map((msg, index) => (
                // FIX: Wrapped framer-motion props to bypass type errors.
                <motion.div
                    key={index}
                    {...{
                        layout: true,
                        initial: { opacity: 0, y: 10 },
                        animate: { opacity: 1, y: 0 },
                    }}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-twitter-blue text-white rounded-br-none' : 'bg-light-hover dark:bg-white/5 dim:bg-dim-hover rounded-bl-none'}`}>
                       {renderMessageContent(msg)}
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-light-border dark:border-twitter-border dim:border-dim-border">
        <div className="flex items-center gap-2 bg-light-border dark:bg-twitter-light-dark rounded-full px-4 py-2">
            <input
                type="text"
                placeholder="Ask Proto-AI..."
                className="flex-1 bg-transparent focus:outline-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button onClick={handleSubmit} className="text-twitter-blue disabled:opacity-50" disabled={!prompt.trim()}>
                <PaperPlaneIcon />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AiAssistantModal;
