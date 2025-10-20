
import React, { useState } from 'react';
import { CloseIcon, PaperPlaneIcon } from './Icon';
import { mockUser } from '../data/mockData';

interface CallChatPanelProps {
    onClose: () => void;
}

interface ChatMessage {
    id: string;
    user: { name: string; avatar: string; };
    text: string;
}

const CallChatPanel: React.FC<CallChatPanelProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages(prev => [...prev, {
                id: `chat-${Date.now()}`,
                user: { name: mockUser.displayName, avatar: mockUser.avatarUrl },
                text: newMessage
            }]);
            setNewMessage('');
        }
    };
    
    return (
        <div className="h-full flex flex-col">
            <header className="p-2 flex items-center justify-between border-b border-light-border/50 dark:border-twitter-border/50">
                <h3 className="font-bold ml-2">In-call messages</h3>
                <button onClick={onClose} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><CloseIcon /></button>
            </header>
            <div className="flex-1 p-2 space-y-3 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg.id} className="flex items-start gap-2 text-sm">
                        <img src={msg.user.avatar} alt={msg.user.name} className="w-6 h-6 rounded-full"/>
                        <div>
                            <p className="font-bold">{msg.user.name}</p>
                            <p className="text-light-secondary-text dark:text-dim-secondary-text">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-2 border-t border-light-border/50 dark:border-twitter-border/50">
                <div className="flex items-center gap-2 bg-light-border dark:bg-twitter-light-dark rounded-full px-4 py-2">
                    <input
                        type="text"
                        placeholder="Send a message..."
                        className="flex-1 bg-transparent focus:outline-none text-sm"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage} className="text-twitter-blue disabled:opacity-50" disabled={!newMessage.trim()}>
                        <PaperPlaneIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallChatPanel;