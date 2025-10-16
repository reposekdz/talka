import React, { useState } from 'react';
import { mockConversations, mockMessages, mockUser } from '../data/mockData';
import { Conversation, Message, User } from '../types';
import Avatar from '../components/Avatar';
import { VerifiedIcon, PhotoIcon, GifIcon, EmojiIcon, AudioCallIcon, VideoCallIcon, InfoIcon, MoreIcon } from '../components/Icon';

const ConversationItem: React.FC<{ conversation: Conversation, isSelected: boolean, onClick: () => void }> = ({ conversation, isSelected, onClick }) => {
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

    return (
        <div onClick={onClick} className={`p-4 flex gap-3 cursor-pointer ${isSelected ? 'bg-light-hover dark:bg-white/10 dim:bg-dim-hover' : 'hover:bg-light-hover/50 dark:hover:bg-white/5 dim:hover:bg-dim-hover/50'}`}>
            <Avatar src={participant.avatarUrl} alt={participant.displayName} />
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
                        {lastMessage.text}
                    </p>
                    {unreadCount > 0 && (
                        <span className="bg-twitter-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatView: React.FC<{ conversation: Conversation, messages: Message[], currentUser: User }> = ({ conversation, messages, currentUser }) => {
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar src={conversation.participant.avatarUrl} alt={conversation.participant.displayName} size="small" />
                    <div>
                        <div className="flex items-center">
                            <h2 className="font-bold">{conversation.participant.displayName}</h2>
                            {conversation.participant.verified && <VerifiedIcon />}
                        </div>
                        <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">@{conversation.participant.username}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
                    <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full"><AudioCallIcon /></button>
                    <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full"><VideoCallIcon /></button>
                    <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full"><InfoIcon /></button>
                </div>
            </div>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.senderId === currentUser.id ? 'bg-twitter-blue text-white rounded-br-none' : 'bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-bl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            {/* Input */}
            <div className="p-4 border-t border-light-border dark:border-twitter-border dim:border-dim-border">
                <div className="flex items-center gap-2 bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-4 py-2">
                     <div className="flex gap-1 text-twitter-blue">
                        <button className="p-2 hover:bg-twitter-blue/10 rounded-full"><PhotoIcon /></button>
                        <button className="p-2 hover:bg-twitter-blue/10 rounded-full"><GifIcon /></button>
                        <button className="p-2 hover:bg-twitter-blue/10 rounded-full"><EmojiIcon /></button>
                    </div>
                    <input type="text" placeholder="Start a new message" className="bg-transparent w-full focus:outline-none" />
                </div>
            </div>
        </div>
    );
};


const MessagesPage: React.FC = () => {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations[0]?.id || null);
    
    const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);
    const messages = selectedConversationId ? mockMessages[selectedConversationId] : [];

    return (
        <div className="flex h-screen">
            <div className="w-full md:w-2/5 border-r border-light-border dark:border-twitter-border dim:border-dim-border flex flex-col">
                <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex justify-between items-center">
                    <h1 className="text-xl font-bold">Messages</h1>
                    <MoreIcon/>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {mockConversations.map(conv => (
                        <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            isSelected={selectedConversationId === conv.id}
                            onClick={() => setSelectedConversationId(conv.id)}
                        />
                    ))}
                </div>
            </div>
            <div className="hidden md:flex flex-1 flex-col">
                {selectedConversation ? (
                    <ChatView conversation={selectedConversation} messages={messages} currentUser={mockUser}/>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                        <h2 className="text-2xl font-bold mb-2">Select a message</h2>
                        <p className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text max-w-sm">
                            Choose from your existing conversations, start a new one, or just keep swimming.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
