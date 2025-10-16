import React, { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';
import { PhotoIcon, GifIcon, ChartBarIcon, EmojiIcon, CalendarIcon, GlobeIcon, MicrophoneIcon, StopIcon, TrashIcon, CloseIcon, PlayIcon, MusicNoteIcon, PlusIcon } from './Icon';
import { mockUser } from '../data/mockData';
import { Tweet, Poll } from '../types';
import GifComposerModal from './GifComposerModal';

interface ComposerProps {
    onPostTweet: (tweet: Partial<Tweet>) => void;
}

const Composer: React.FC<ComposerProps> = ({ onPostTweet }) => {
    const [tweetText, setTweetText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isGifModalOpen, setIsGifModalOpen] = useState(false);
    const [mediaPreview, setMediaPreview] = useState<{ url: string, type: 'image' | 'video' | 'gif' | 'audio' } | null>(null);
    
    // Poll state
    const [isCreatingPoll, setIsCreatingPoll] = useState(false);
    const [pollOptions, setPollOptions] = useState(['', '']);
    const [pollDuration, setPollDuration] = useState({ days: 1, hours: 0, minutes: 0 });

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingIntervalRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const isPostDisabled = tweetText.trim().length === 0 && !mediaPreview && !isCreatingPoll;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            let type: 'image' | 'video' | 'audio' = 'image';
            if (file.type.startsWith('video/')) type = 'video';
            if (file.type.startsWith('audio/')) type = 'audio';
            setMediaPreview({ url, type });
            setIsCreatingPoll(false); // Can't have media and poll
        }
    };
    
    const iconButtons = [
        { icon: <PhotoIcon />, label: 'Media', action: () => fileInputRef.current?.click() },
        { icon: <GifIcon />, label: 'GIF', action: () => setIsGifModalOpen(true) },
        { icon: <ChartBarIcon />, label: 'Poll', action: () => { setIsCreatingPoll(!isCreatingPoll); if (!isCreatingPoll) setMediaPreview(null); }},
        { icon: <EmojiIcon />, label: 'Emoji' },
        { icon: <CalendarIcon />, label: 'Schedule' },
    ];
    
    const handlePost = () => {
        if (isPostDisabled) return;

        let pollData: Poll | undefined = undefined;
        if (isCreatingPoll && pollOptions.every(opt => opt.trim()) && pollOptions.length >= 2) {
            const endsAt = new Date();
            endsAt.setDate(endsAt.getDate() + pollDuration.days);
            endsAt.setHours(endsAt.getHours() + pollDuration.hours);
            endsAt.setMinutes(endsAt.getMinutes() + pollDuration.minutes);

            pollData = {
                id: `p-${Date.now()}`,
                options: pollOptions.map((opt, i) => ({ id: `po-${i}`, text: opt, votes: 0 })),
                endsAt: endsAt.toISOString(),
                totalVotes: 0,
            };
        }

        onPostTweet({ 
            content: tweetText,
            mediaUrls: mediaPreview ? [mediaPreview.url] : undefined,
            poll: pollData
        });

        // Reset state
        setTweetText('');
        setMediaPreview(null);
        setIsCreatingPoll(false);
        setPollOptions(['', '']);
        setPollDuration({ days: 1, hours: 0, minutes: 0 });
    };

    const handleSelectGif = (url: string) => {
        setMediaPreview({ url, type: 'gif' });
        setIsGifModalOpen(false);
        setIsCreatingPoll(false);
    }
    
    const startRecording = async () => {
        // ... (recording logic remains the same)
    };

    const stopRecording = (post: boolean = true) => {
        // ... (recording logic remains the same)
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderMediaPreview = () => {
        if (!mediaPreview) return null;
        // ... (render logic remains the same)
    };
    
    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addPollOption = () => {
        if (pollOptions.length < 4) {
            setPollOptions([...pollOptions, '']);
        }
    };
    
    const removePollOption = (index: number) => {
        if (pollOptions.length > 2) {
            const newOptions = [...pollOptions];
            newOptions.splice(index, 1);
            setPollOptions(newOptions);
        }
    };


    return (
        <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex gap-4">
            <input type="file" accept="image/*,video/*,audio/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            {isGifModalOpen && <GifComposerModal onSelectGif={handleSelectGif} onClose={() => setIsGifModalOpen(false)} />}
            <Avatar src={mockUser.avatarUrl} alt={mockUser.displayName} />
            <div className="flex-1 relative">
                <textarea
                    placeholder={isRecording ? "Add a comment to your voice tweet..." : "What's happening?!"}
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    className="w-full bg-transparent text-xl resize-none focus:outline-none placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text"
                    rows={isRecording ? 1 : (mediaPreview || isCreatingPoll ? 2 : 3)}
                />
                
                {mediaPreview && (
                    <div className="relative mt-2 max-w-sm">
                        {renderMediaPreview()}
                        <button 
                            onClick={() => setMediaPreview(null)}
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                )}
                
                {isCreatingPoll && (
                    <div className="mt-2 border border-light-border dark:border-twitter-border rounded-2xl p-4 space-y-3">
                        {pollOptions.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                    placeholder={`Choice ${index + 1}`}
                                    maxLength={25}
                                    className="w-full bg-transparent border border-light-border dark:border-twitter-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                                />
                                {pollOptions.length > 2 && (
                                    <button onClick={() => removePollOption(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><CloseIcon /></button>
                                )}
                            </div>
                        ))}
                        {pollOptions.length < 4 && (
                            <button onClick={addPollOption} className="text-twitter-blue font-bold text-sm flex items-center gap-1"><PlusIcon /> Add choice</button>
                        )}
                        <div className="border-t border-light-border dark:border-twitter-border my-2"></div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold">Poll length</span>
                            <select value={pollDuration.days} onChange={e => setPollDuration(p => ({...p, days: +e.target.value}))} className="bg-light-hover dark:bg-twitter-light-dark rounded-md p-1">
                                {Array.from({length: 8}, (_, i) => <option key={i} value={i}>{i} days</option>)}
                            </select>
                            <select value={pollDuration.hours} onChange={e => setPollDuration(p => ({...p, hours: +e.target.value}))} className="bg-light-hover dark:bg-twitter-light-dark rounded-md p-1">
                                 {Array.from({length: 24}, (_, i) => <option key={i} value={i}>{i} hours</option>)}
                            </select>
                             <select value={pollDuration.minutes} onChange={e => setPollDuration(p => ({...p, minutes: +e.target.value}))} className="bg-light-hover dark:bg-twitter-light-dark rounded-md p-1">
                                {Array.from({length: 60}, (_, i) => <option key={i} value={i}>{i} minutes</option>)}
                            </select>
                        </div>
                    </div>
                )}
                
                {isRecording && (
                    <div className="flex items-center gap-3 my-2 p-3 bg-light-hover dark:bg-white/5 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-mono text-light-secondary-text dark:text-twitter-gray">{formatTime(recordingTime)}</span>
                        <span className="flex-1 text-sm text-light-secondary-text dark:text-twitter-gray">Recording...</span>
                         <button onClick={() => stopRecording(false)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon/></button>
                    </div>
                )}
                
                {!isRecording && (
                     <button className="flex items-center gap-1 text-twitter-blue font-bold text-sm py-1 px-3 rounded-full hover:bg-twitter-blue/10 -ml-3">
                        <GlobeIcon />
                        <span>Everyone can reply</span>
                    </button>
                )}
               
                <div className="border-t border-light-border dark:border-twitter-border dim:border-dim-border my-2"></div>
                
                <div className="flex justify-between items-center">
                    <div className="flex gap-1 text-twitter-blue items-center">
                        {!isRecording && iconButtons.map(btn => (
                             <button key={btn.label} onClick={btn.action} className="p-2 hover:bg-twitter-blue/10 rounded-full" aria-label={btn.label}>
                                {btn.icon}
                            </button>
                        ))}
                        {!isRecording && (
                             <button onClick={startRecording} className="p-2 hover:bg-twitter-blue/10 rounded-full" aria-label="Record Voice Tweet">
                                <MicrophoneIcon />
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={isRecording ? () => stopRecording(true) : handlePost}
                        className="bg-twitter-blue text-white font-bold px-6 py-2 rounded-full hover:bg-opacity-90 disabled:opacity-50"
                        disabled={!isRecording && isPostDisabled}
                    >
                       {isRecording ? <StopIcon/> : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Composer;