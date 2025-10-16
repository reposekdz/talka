import React, { useState, useEffect, useRef } from 'react';
import { mockConversations, mockMessages, mockUser } from '../data/mockData';
import { Conversation, Message, User } from '../types';
import Avatar from '../components/Avatar';
import { VerifiedIcon, MoreIcon, InfoIcon, VideoCallIcon, AudioCallIcon, ChevronLeftIcon } from '../components/Icon';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { motion, AnimatePresence } from 'framer-motion';

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
                        {lastMessage.type === 'voice' ? 'Voice message' : lastMessage.text}
                    </p>
                    {unreadCount > 0 && (
                        <span className="bg-twitter-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatView: React.FC<{
    conversation: Conversation;
    messages: Message[];
    currentUser: User;
    onSendMessage: (convId: string, msg: Omit<Message, 'id' | 'timestamp' | 'isRead' | 'senderId'>) => void;
    onBack: () => void;
}> = ({ conversation, messages, currentUser, onSendMessage, onBack }) => {
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (content: { type: 'text'; text: string } | { type: 'voice'; audioUrl: string; duration: number }, replyTo?: Message) => {
        onSendMessage(conversation.id, {
            ...content,
            replyTo: replyTo ?? undefined
        });
        setReplyingTo(null);
    };
    
    return (
        <div className="flex flex-col h-full bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg">
            <div className="p-2 md:p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex items-center justify-between sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full md:hidden"><ChevronLeftIcon /></button>
                    <Avatar src={conversation.participant.avatarUrl} alt={conversation.participant.displayName} size="small" />
                    <div>
                        <div className="flex items-center">
                            <h2 className="font-bold">{conversation.participant.displayName}</h2>
                            {conversation.participant.verified && <VerifiedIcon />}
                        </div>
                        <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">@{conversation.participant.username}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-current">
                    <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full"><AudioCallIcon /></button>
                    <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full"><VideoCallIcon /></button>
                    <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover rounded-full"><InfoIcon /></button>
                </div>
            </div>
            
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUser.id} onReply={setReplyingTo} />
                ))}
                {conversation.isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-light-secondary-text dark:text-twitter-gray px-4 py-2 rounded-t-xl rounded-br-xl">
                            <span className="italic">typing...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput
                onSendMessage={handleSendMessage}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
            />
        </div>
    );
};

const MessagesPage: React.FC = () => {
    const [conversations, setConversations] = useState(mockConversations);
    const [messages, setMessages] = useState(mockMessages);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations[0]?.id || null);
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id);
        setMobileView('chat');
    };

    const handleBackToList = () => {
        setMobileView('list');
    };
    
    const selectedConversation = conversations.find(c => c.id === selectedConversationId);
    const selectedMessages = selectedConversationId ? messages[selectedConversationId] : [];

    const handleSendMessage = (convId: string, msgContent: Omit<Message, 'id' | 'timestamp' | 'isRead' | 'senderId'>) => {
        const newMessage: Message = {
            id: `m-${Date.now()}`,
            senderId: mockUser.id,
            timestamp: new Date().toISOString(),
            isRead: false,
            ...msgContent,
        };

        setMessages(prev => ({
            ...prev,
            [convId]: [...prev[convId], newMessage]
        }));
    };

    return (
        <div className="flex h-screen relative overflow-hidden">
            <motion.div
                className="w-full md:w-2/5 md:static absolute top-0 left-0 h-full border-r border-light-border dark:border-twitter-border dim:border-dim-border flex flex-col bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg z-20"
                animate={{ x: mobileView === 'chat' ? '-100%' : '0%' }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            >
                <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex justify-between items-center sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
                    <h1 className="text-xl font-bold">Messages</h1>
                    <button className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><MoreIcon/></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            isSelected={selectedConversationId === conv.id}
                            onClick={() => handleSelectConversation(conv.id)}
                        />
                    ))}
                </div>
            </motion.div>
           
            <AnimatePresence>
            {mobileView === 'chat' && selectedConversation && (
                 <motion.div
                    className="md:hidden absolute top-0 left-0 w-full h-full z-30"
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                >
                    <ChatView
                        conversation={selectedConversation}
                        messages={selectedMessages}
                        currentUser={mockUser}
                        onSendMessage={handleSendMessage}
                        onBack={handleBackToList}
                    />
                </motion.div>
            )}
            </AnimatePresence>
            
            <div className="hidden md:flex flex-1 flex-col">
                {selectedConversation ? (
                     <ChatView
                        conversation={selectedConversation}
                        messages={selectedMessages}
                        currentUser={mockUser}
                        onSendMessage={handleSendMessage}
                        onBack={() => {}}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg">
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