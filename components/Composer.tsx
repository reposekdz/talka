
import React, { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';
import { PhotoIcon, GifIcon, ChartBarIcon, EmojiIcon, CalendarIcon, GlobeIcon, MicrophoneIcon, StopIcon, TrashIcon, CloseIcon } from './Icon';
import { mockUser } from '../data/mockData';
import { Tweet } from '../types';
import GifComposerModal from './GifComposerModal';

interface ComposerProps {
    onPostTweet: (tweet: Partial<Tweet>) => void;
}

const Composer: React.FC<ComposerProps> = ({ onPostTweet }) => {
    const [tweetText, setTweetText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isGifModalOpen, setIsGifModalOpen] = useState(false);
    const [selectedGif, setSelectedGif] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingIntervalRef = useRef<number | null>(null);
    
    const isDisabled = tweetText.trim().length === 0 && !selectedGif;

    const iconButtons = [
        { icon: <PhotoIcon />, label: 'Media' },
        { icon: <GifIcon />, label: 'GIF', action: () => setIsGifModalOpen(true) },
        { icon: <ChartBarIcon />, label: 'Poll' },
        { icon: <EmojiIcon />, label: 'Emoji' },
        { icon: <CalendarIcon />, label: 'Schedule' },
    ];
    
    const handlePost = () => {
        if (!isDisabled) {
            onPostTweet({ 
                content: tweetText,
                mediaUrls: selectedGif ? [selectedGif] : undefined,
            });
            setTweetText('');
            setSelectedGif(null);
        }
    };

    const handleSelectGif = (url: string) => {
        setSelectedGif(url);
        setIsGifModalOpen(false);
    }
    
    const startRecording = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            alert("Audio recording is not supported by your browser.");
            return;
        }

        try {
            if (navigator.permissions) {
                 const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                 if (permissionStatus.state === 'denied') {
                     alert("Microphone access has been denied. Please enable it in your browser settings to record a voice tweet.");
                     return;
                 }
            }
           
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            
            const audioChunks: Blob[] = [];
            recorder.ondataavailable = event => audioChunks.push(event.data);
    
            recorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                onPostTweet({ isVoiceTweet: true, audioUrl: audioUrl, content: tweetText });
                setTweetText('');
                stream.getTracks().forEach(track => track.stop());
            };
    
            recorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            recordingIntervalRef.current = window.setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
                // User denied the permission prompt. The console error is sufficient.
            } else {
                 alert("Microphone access is required to record a voice tweet. Please allow access when prompted.");
            }
        }
    };

    const stopRecording = (post: boolean = true) => {
        if (mediaRecorderRef.current) {
            if (post) {
                mediaRecorderRef.current.stop();
            } else {
                 mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
            mediaRecorderRef.current = null;
        }
        setIsRecording(false);
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex gap-4">
            {isGifModalOpen && <GifComposerModal onSelectGif={handleSelectGif} onClose={() => setIsGifModalOpen(false)} />}
            <Avatar src={mockUser.avatarUrl} alt={mockUser.displayName} />
            <div className="flex-1 relative">
                <textarea
                    placeholder={isRecording ? "Add a comment to your voice tweet..." : "What's happening?!"}
                    value={tweetText}
                    onChange={(e) => setTweetText(e.target.value)}
                    className="w-full bg-transparent text-xl resize-none focus:outline-none placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text"
                    rows={isRecording ? 1 : 2}
                />
                
                {selectedGif && (
                    <div className="relative mt-2 max-w-sm">
                        <img src={selectedGif} alt="Selected GIF" className="rounded-2xl w-full h-auto" />
                        <button 
                            onClick={() => setSelectedGif(null)}
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                        >
                            <CloseIcon />
                        </button>
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
                        disabled={!isRecording && isDisabled}
                    >
                       {isRecording ? <StopIcon/> : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Composer;
