import React from 'react';
import { Message } from '../types';
import { ReplyIcon, AddReactionIcon } from './Icon';
import AudioPlayer from './AudioPlayer';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onReply: (message: Message) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, onReply }) => {
  const { text, type, replyTo, reactions, audioUrl, duration } = message;

  return (
    <div className={`flex group ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`relative max-w-xs md:max-w-md p-3 rounded-t-2xl ${isOwnMessage ? 'bg-twitter-blue text-white rounded-l-2xl' : 'bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-r-2xl'}`}>
        
        {/* Reply Content */}
        {replyTo && (
            <div className="border-l-2 border-white/50 pl-2 opacity-80 mb-2">
                <p className="text-xs font-bold">
                    {replyTo.senderId === 'u1' ? 'You' : 'Them'}
                </p>
                <p className="text-sm italic truncate">
                    {replyTo.type === 'text' ? replyTo.text : 'Voice message'}
                </p>
            </div>
        )}

        {/* Main Content */}
        {type === 'voice' && audioUrl && duration !== undefined ? (
            <AudioPlayer src={audioUrl} duration={duration} isOwnMessage={isOwnMessage} />
        ) : (
            <p className="whitespace-pre-wrap break-words">{text}</p>
        )}

        {/* Reactions */}
        {reactions && reactions.length > 0 && (
            <div className="absolute -bottom-3 right-2 flex gap-1">
                {reactions.map((reaction, index) => (
                    <div key={index} className="bg-light-bg dark:bg-twitter-light-dark dim:bg-dim-bg px-2 py-0.5 rounded-full text-xs shadow border border-light-border dark:border-twitter-border dim:border-dim-border">
                        {reaction.emoji} {reaction.users.length}
                    </div>
                ))}
            </div>
        )}
        
        {/* Hover Actions */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${isOwnMessage ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
            <button className="p-1.5 bg-light-hover dark:bg-white/10 dim:bg-dim-hover rounded-full text-light-secondary-text dark:text-twitter-gray"><AddReactionIcon /></button>
            <button onClick={() => onReply(message)} className="p-1.5 bg-light-hover dark:bg-white/10 dim:bg-dim-hover rounded-full text-light-secondary-text dark:text-twitter-gray"><ReplyIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;