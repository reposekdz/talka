
import React, { useState } from 'react';
import Avatar from './Avatar';
import { PhotoIcon, GifIcon, ChartBarIcon, EmojiIcon, CalendarIcon, GlobeIcon } from './Icon';
import { mockUser } from '../data/mockData';

const Composer: React.FC = () => {
    const [tweetText, setTweetText] = useState('');
    const isDisabled = tweetText.trim().length === 0;

    const iconButtons = [
        { icon: <PhotoIcon />, label: 'Media' },
        { icon: <GifIcon />, label: 'GIF' },
        { icon: <ChartBarIcon />, label: 'Poll' },
        { icon: <EmojiIcon />, label: 'Emoji' },
        { icon: <CalendarIcon />, label: 'Schedule' },
    ];

    return (
        <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex gap-4">
            <Avatar src={mockUser.avatarUrl} alt={mockUser.displayName} />
            <div className="flex-1">
                <textarea
                    placeholder="What's happening?!"
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    className="w-full bg-transparent text-xl resize-none focus:outline-none placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text"
                    rows={2}
                />
                <button className="flex items-center gap-1 text-twitter-blue font-bold text-sm py-1 px-3 rounded-full hover:bg-twitter-blue/10 -ml-3">
                    <GlobeIcon />
                    <span>Everyone can reply</span>
                </button>
                <div className="border-t border-light-border dark:border-twitter-border dim:border-dim-border my-2"></div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-1 text-twitter-blue">
                        {iconButtons.map(btn => (
                             <button key={btn.label} className="p-2 hover:bg-twitter-blue/10 rounded-full" aria-label={btn.label}>
                                {btn.icon}
                            </button>
                        ))}
                    </div>
                    <button 
                        className="bg-twitter-blue text-white font-bold px-6 py-2 rounded-full hover:bg-opacity-90 disabled:opacity-50"
                        disabled={isDisabled}
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Composer;
