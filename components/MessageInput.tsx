import React, { useState, useRef } from 'react';
import { Message } from '../types';
import { PhotoIcon, GifIcon, EmojiIcon, MicrophoneIcon, SendIcon, TrashIcon, StopIcon } from './Icon';
import EmojiPicker from './EmojiPicker';
import GifPickerModal from './GifPickerModal';
import { AnimatePresence, motion } from 'framer-motion';
import AudioPlayer from './AudioPlayer';

type MessageContent = 
    | { type: 'text'; text: string }
    | { type: 'voice'; audioUrl: string; duration: number }
    | { type: 'gif'; gifUrl: string };

interface MessageInputProps {
  onSendMessage: (content: MessageContent, replyTo?: Message) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, replyingTo, onCancelReply }) => {
  const [inputText, setInputText] = useState('');
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'preview'>('idle');
  const [recordedAudio, setRecordedAudio] = useState<{ url: string, duration: number } | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage({ type: 'text', text: inputText.trim() }, replyingTo || undefined);
      setInputText('');
    }
  };
  
  const handleSelectGif = (url: string) => {
    onSendMessage({ type: 'gif', gifUrl: url }, replyingTo || undefined);
    setIsGifModalOpen(false);
  };
  
  const resetRecording = () => {
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    mediaRecorderRef.current = null;
    setRecordingState('idle');
    setRecordedAudio(null);
    setRecordingTime(0);
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
        alert("Audio recording is not supported by your browser.");
        return;
    }

    try {
        if (navigator.permissions) {
            const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            if (permissionStatus.state === 'denied') {
                alert("Microphone access has been denied. Please enable it in your browser settings to send voice notes.");
                return;
            }
        }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = event => audioChunks.push(event.data);

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({ url: audioUrl, duration: recordingTime });
        setRecordingState('preview');
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setRecordingState('recording');
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        // User denied the permission prompt.
      } else {
        alert("Microphone access is required to send voice notes. Please allow access when prompted.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
  };

  const sendVoiceMessage = () => {
    if (recordedAudio) {
      onSendMessage({ type: 'voice', audioUrl: recordedAudio.url, duration: recordedAudio.duration }, replyingTo || undefined);
      resetRecording();
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderInputState = () => {
    switch(recordingState) {
        case 'recording':
            return (
                <div className="flex items-center justify-between gap-2 bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-4 py-1 mx-2 w-full">
                   <div className="flex items-center gap-2 flex-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text font-mono">{formatTime(recordingTime)}</span>
                   </div>
                   <button onClick={stopRecording} className="p-2 text-twitter-blue bg-twitter-blue/20 rounded-full"><StopIcon /></button>
                </div>
            );
        case 'preview':
            if (!recordedAudio) return null;
            return (
                <div className="flex items-center justify-between gap-2 bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-4 py-1 mx-2 w-full">
                    <button onClick={resetRecording} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon /></button>
                    <div className="flex-1">
                        <AudioPlayer src={recordedAudio.url} duration={recordedAudio.duration} isOwnMessage={false} />
                    </div>
                    <button onClick={sendVoiceMessage} className="p-2 text-twitter-blue"><SendIcon /></button>
                </div>
            );
        case 'idle':
        default:
            return (
                 <div className="flex items-center gap-2 bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-2 sm:px-4 py-1 mx-2">
                    <div className="flex gap-1 text-twitter-blue">
                        <button className="p-2 hover:bg-twitter-blue/10 rounded-full"><PhotoIcon /></button>
                        <button onClick={() => setIsGifModalOpen(true)} className="p-2 hover:bg-twitter-blue/10 rounded-full"><GifIcon /></button>
                        <button onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)} className="p-2 hover:bg-twitter-blue/10 rounded-full"><EmojiIcon /></button>
                    </div>
                    <input
                        type="text"
                        placeholder="Start a new message"
                        className="bg-transparent w-full focus:outline-none text-light-text dark:text-white dim:text-dim-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    {inputText ? (
                        <button onClick={handleSendMessage} className="p-2 text-twitter-blue"><SendIcon /></button>
                    ) : (
                        <button onClick={startRecording} className="p-2 text-twitter-blue"><MicrophoneIcon /></button>
                    )}
                </div>
            );
    }
  }

  return (
    <div className="p-2 border-t border-light-border dark:border-twitter-border dim:border-dim-border relative">
      {replyingTo && (
        <div className="bg-light-hover dark:bg-white/5 dim:bg-dim-hover p-2 rounded-t-lg mx-2 flex justify-between items-center">
          <div className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">
            <p>Replying to {replyingTo.senderId === 'u1' ? 'yourself' : 'them'}</p>
            <p className="italic truncate max-w-xs">{replyingTo.type === 'text' ? replyingTo.text : 'Voice message'}</p>
          </div>
          <button onClick={onCancelReply} className="font-bold text-xl">&times;</button>
        </div>
      )}
     
      <div className="flex items-center">
         {renderInputState()}
      </div>
      
      {isEmojiPickerOpen && (
          <EmojiPicker 
            onSelect={(emoji) => setInputText(inputText + emoji)}
            onClose={() => setIsEmojiPickerOpen(false)}
          />
      )}

      <AnimatePresence>
        {isGifModalOpen && (
          <GifPickerModal 
            onClose={() => setIsGifModalOpen(false)}
            onSelectGif={handleSelectGif}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default MessageInput;