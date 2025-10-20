
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { CloseIcon, DollarSignIcon, CheckmarkCircleIcon } from './Icon';
import Confetti from './Confetti';

interface TipModalProps {
    user: User;
    onClose: () => void;
}

const TipModal: React.FC<TipModalProps> = ({ user, onClose }) => {
    const [selectedAmount, setSelectedAmount] = useState<number>(5);
    const [isSent, setIsSent] = useState(false);
    
    const tipAmounts = [1, 5, 10, 20];

    const handleSendTip = () => {
        setIsSent(true);
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Confetti fire={isSent} />
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-light-bg/80 dark:bg-twitter-dark/80 backdrop-blur-xl w-full max-w-sm rounded-2xl flex flex-col shadow-lg border border-light-border/50 dark:border-twitter-border/50"
            >
                <AnimatePresence mode="wait">
                    {isSent ? (
                        <motion.div
                            key="sent"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 flex flex-col items-center justify-center text-center h-80"
                        >
                            <CheckmarkCircleIcon className="w-20 h-20 text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold">Tip Sent!</h2>
                            <p className="text-light-secondary-text dark:text-twitter-gray">You sent ${selectedAmount} to {user.displayName}.</p>
                        </motion.div>
                    ) : (
                        <motion.div key="tip" exit={{ opacity: 0, scale: 0.8 }}>
                             <header className="p-2 pr-4 flex items-center justify-between">
                                <h2 className="font-bold text-lg ml-4">Send a Tip</h2>
                                <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
                            </header>
                            <div className="p-6 flex flex-col items-center text-center">
                                <img src={user.avatarUrl} alt={user.displayName} className="w-20 h-20 rounded-full mb-2" />
                                <p className="font-bold">Show your support for</p>
                                <p className="text-xl font-bold">{user.displayName}</p>
                                <p className="text-sm text-light-secondary-text dark:text-twitter-gray">@{user.username}</p>
                                
                                <div className="flex gap-2 my-6">
                                    {tipAmounts.map(amount => (
                                        <button 
                                            key={amount}
                                            onClick={() => setSelectedAmount(amount)}
                                            className={`w-16 h-12 rounded-lg font-bold border-2 transition-colors ${selectedAmount === amount ? 'bg-twitter-blue border-twitter-blue text-white' : 'bg-light-hover dark:bg-white/10 border-transparent'}`}
                                        >
                                            ${amount}
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    onClick={handleSendTip}
                                    className="w-full bg-twitter-blue text-white font-bold py-3 rounded-full flex items-center justify-center gap-2"
                                >
                                    <DollarSignIcon /> Send Tip
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default TipModal;