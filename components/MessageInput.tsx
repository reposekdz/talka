import React, { useState, useRef } from 'react';
import { Message } from '../types';
import { PhotoIcon, GifIcon, EmojiIcon, MicrophoneIcon, SendIcon, TrashIcon, StopIcon } from './Icon';
import EmojiPicker from './EmojiPicker';
import GifPickerModal from './GifPickerModal';
import { AnimatePresence } from 'framer-motion';

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
  const [isRecording, setIsRecording] = useState(false);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = event => audioChunks.push(event.data);

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage({ type: 'voice', audioUrl, duration: recordingTime }, replyingTo || undefined);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone access is required to send voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setRecordingTime(0);
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
      {!isRecording ? (
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
      ) : (
        <div className="flex items-center justify-between gap-2 bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-4 py-1 mx-2">
           <button onClick={cancelRecording} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><TrashIcon /></button>
           <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text font-mono">{formatTime(recordingTime)}</span>
           </div>
           <button onClick={stopRecording} className="p-2 text-twitter-blue bg-twitter-blue/20 rounded-full"><StopIcon /></button>
        </div>
      )}
      
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
