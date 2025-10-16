import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { PhotoIcon, GifIcon, EmojiIcon, MicrophoneIcon, SendIcon, TrashIcon, ChevronLeftIcon } from './Icon';
import EmojiPicker from './EmojiPicker';
import GifPickerModal from './GifPickerModal';
import { AnimatePresence, motion } from 'framer-motion';

type MessageContent = 
    | { type: 'text'; text: string }
    | { type: 'voice'; audioUrl: string; duration: number }
    | { type: 'gif'; gifUrl: string }
    | { type: 'wave' };

interface MessageInputProps {
  onSendMessage: (content: MessageContent, replyTo?: Message) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, replyingTo, onCancelReply }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [slidePosition, setSlidePosition] = useState(0);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage({ type: 'text', text: inputText.trim() }, replyingTo || undefined);
      setInputText('');
      onCancelReply();
    }
  };
  
  const handleSelectGif = (url: string) => {
    onSendMessage({ type: 'gif', gifUrl: url }, replyingTo || undefined);
    setIsGifModalOpen(false);
    onCancelReply();
  };
  
  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
    }
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
    setRecordingTime(0);
    setSlidePosition(0);
  };

  const startRecording = async (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!navigator.mediaDevices?.getUserMedia) {
        alert("Audio recording is not supported by your browser.");
        return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = event => audioChunks.push(event.data);

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (slidePosition < -50) { // Cancelled
             URL.revokeObjectURL(audioUrl);
        } else {
            onSendMessage({ type: 'voice', audioUrl: audioUrl, duration: recordingTime }, replyingTo || undefined);
            onCancelReply();
        }
        stream.getTracks().forEach(track => track.stop());
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        setIsRecording(false);
        setRecordingTime(0);
        setSlidePosition(0);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = window.setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  useEffect(() => {
    const handleMouseUp = () => stopRecording();
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchend', handleMouseUp);
    }
  }, [isRecording]);

  const handleRecordingMove = (clientX: number) => {
    if (isRecording && micButtonRef.current) {
        const rect = micButtonRef.current.getBoundingClientRect();
        const newSlidePosition = clientX - (rect.left + rect.width / 2);
        setSlidePosition(Math.min(0, newSlidePosition));
    }
  };

  const handleMouseMove = (event: MouseEvent) => handleRecordingMove(event.clientX);
  const handleTouchMove = (event: TouchEvent) => handleRecordingMove(event.touches[0].clientX);

  useEffect(() => {
    if (isRecording) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove);
    }
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
    }
  }, [isRecording]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-2 border-t border-light-border dark:border-twitter-border dim:border-dim-border relative">
      <AnimatePresence>
        {replyingTo && (
            <motion.div
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-light-hover dark:bg-white/5 dim:bg-dim-hover p-2 rounded-t-lg mx-2 flex justify-between items-center"
            >
            <div className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text border-l-2 border-twitter-blue pl-2">
                <p className="font-bold text-light-text dark:text-dim-text">Replying to {replyingTo.senderId === 'u1' ? 'yourself' : 'them'}</p>
                <p className="italic truncate max-w-xs">{replyingTo.type === 'text' ? replyingTo.text : 'Voice message'}</p>
            </div>
            <button onClick={onCancelReply} className="font-bold text-xl p-1">&times;</button>
            </motion.div>
        )}
      </AnimatePresence>
     
      <div className="flex items-center min-h-[44px]">
        {isRecording ? (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex items-center justify-between px-4">
                <div className="flex items-center gap-2 text-red-500">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-mono">{formatTime(recordingTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-light-secondary-text dark:text-twitter-gray">
                    <ChevronLeftIcon />
                    <span>Slide to cancel</span>
                </div>
            </motion.div>
        ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex items-center gap-2 bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-2 sm:px-4 py-1 mx-2">
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
            </motion.div>
        )}
        
        <div className="px-2">
            {inputText && !isRecording ? (
                <button onClick={handleSendMessage} className="p-2 text-twitter-blue"><SendIcon /></button>
            ) : (
                <motion.button 
                    ref={micButtonRef}
                    onMouseDown={startRecording}
                    onTouchStart={startRecording}
                    className="p-2 text-twitter-blue relative"
                    animate={{ scale: isRecording ? 1.2 : 1, x: slidePosition }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    <MicrophoneIcon />
                </motion.button>
            )}
        </div>
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