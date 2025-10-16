import React from 'react';
import { Message } from '../types';
import { ReplyIcon, AddReactionIcon, ReadReceiptIcon } from './Icon';
import AudioPlayer from './AudioPlayer';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onReply: (message: Message) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, onReply }) => {
  const { text, type, replyTo, reactions, audioUrl, duration, gifUrl, isRead } = message;

  const renderContent = () => {
    switch(type) {
        case 'voice':
            return <AudioPlayer src={audioUrl!} duration={duration!} isOwnMessage={isOwnMessage} />;
        case 'gif':
            return <img src={gifUrl} alt="gif" className="rounded-lg max-w-full h-auto" />;
        case 'text':
        default:
            return <p className="whitespace-pre-wrap break-words">{text}</p>;
    }
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`flex items-end gap-2 group ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`relative max-w-xs md:max-w-md p-1 ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div className={`p-3 rounded-t-2xl ${isOwnMessage ? 'bg-twitter-blue text-white rounded-l-2xl' : 'bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-r-2xl'}`}>
            {replyTo && (
                <div className={`border-l-2 ${isOwnMessage ? 'border-white/50' : 'border-twitter-blue'} pl-2 opacity-80 mb-2`}>
                    <p className="text-xs font-bold">
                        {replyTo.senderId === 'u1' ? 'You' : 'Them'}
                    </p>
                    <p className="text-sm italic truncate">
                        {replyTo.type === 'text' ? replyTo.text : 'Voice message'}
                    </p>
                </div>
            )}

            {renderContent()}

        </div>
         {reactions && reactions.length > 0 && (
            <div className="absolute -bottom-3 right-2 flex gap-1 z-10">
                {reactions.map((reaction, index) => (
                    <div key={index} className="bg-light-bg dark:bg-twitter-light-dark dim:bg-dim-bg px-2 py-0.5 rounded-full text-xs shadow border border-light-border dark:border-twitter-border dim:border-dim-border">
                        {reaction.emoji} {reaction.users.length}
                    </div>
                ))}
            </div>
        )}
      </div>

       <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isOwnMessage ? 'order-1' : 'order-2'}`}>
            <button className="p-1.5 bg-light-hover dark:bg-white/10 dim:bg-dim-hover rounded-full text-light-secondary-text dark:text-twitter-gray"><AddReactionIcon /></button>
            <button onClick={() => onReply(message)} className="p-1.5 bg-light-hover dark:bg-white/10 dim:bg-dim-hover rounded-full text-light-secondary-text dark:text-twitter-gray"><ReplyIcon /></button>
        </div>

        {isOwnMessage && isRead && (
            <div className="text-twitter-blue mb-1 order-3">
                <ReadReceiptIcon />
            </div>
        )}
    </motion.div>
  );
};

export default MessageBubble;
