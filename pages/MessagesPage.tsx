
import React, { useState } from 'react';
import { Conversation, User } from '../types';
import AvatarWithStatus from '../components/AvatarWithStatus';
import { VerifiedIcon, MoreIcon, PlusIcon } from '../components/Icon';
import { motion } from 'framer-motion';

interface ConversationItemProps {
    conversation: Conversation;
    onClick: () => void;
}
const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, onClick }) => {
    const { participant, lastMessage, unreadCount } = conversation;

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };
    
    const getLastMessageText = () => {
        if (lastMessage.type === 'voice') return '🎤 Voice message';
        if (lastMessage.type === 'gif') return '🖼️ GIF';
        if (lastMessage.type === 'image') return '📷 Image';
        if (lastMessage.type === 'reel-share') return '🎬 Reel';
        if (lastMessage.type === 'wave') return '👋';
        return lastMessage.text;
    }

    return (
        <div onClick={onClick} className="p-4 flex gap-3 cursor-pointer hover:bg-light-hover/50 dark:hover:bg-white/5 dim:hover:bg-dim-hover/50 transition-colors">
            <AvatarWithStatus user={participant} size="medium" />
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <span className="font-bold truncate">{participant.displayName}</span>
                        {participant.verified && <VerifiedIcon />}
                        <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text truncate">@{participant.username}</span>
                    </div>
                    <span className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">{formatTimestamp(lastMessage.timestamp)}</span>
                </div>
                <div className="flex justify-between items-start mt-1">
                     <p className={`text-sm truncate ${unreadCount > 0 ? 'font-bold text-light-text dark:text-white dim:text-dim-text' : 'text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text'}`}>
                        {conversation.isTyping ? <span className="text-twitter-blue italic">typing...</span> : getLastMessageText()}
                    </p>
                    {unreadCount > 0 && (
                        <span className="bg-twitter-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
                    )}
                </div>
            </div>
        </div>
    );
};


interface MessagesPageProps {
    openChat: (user: User) => void;
    conversations: Conversation[];
}

const MessagesPage: React.FC<MessagesPageProps> = ({ openChat, conversations }) => {

    return (
        <div className="flex h-full flex-col">
            <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex justify-between items-center">
                <h1 className="text-xl font-bold">Messages</h1>
                <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><PlusIcon/></button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.map(conv => (
                    <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        onClick={() => openChat(conv.participant)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MessagesPage;