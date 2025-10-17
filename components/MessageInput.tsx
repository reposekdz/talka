import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { GifIcon, EmojiIcon, MicrophoneIcon, SendIcon, TrashIcon, ChevronLeftIcon, PaperclipIcon, CloseIcon, WaveIcon, CheckmarkCircleIcon, SparklesIcon, ReplyIcon } from './Icon';
import EmojiPicker from './EmojiPicker';
import GifPickerModal from './GifPickerModal';
import { AnimatePresence, motion } from 'framer-motion';

type MessageContent = 
    | { type: 'text'; text: string }
    | { type: 'voice'; audioUrl: string; duration: number }
    | { type: 'gif'; gifUrl: string }
    | { type: 'wave' }
    | { type: 'image'; imageUrl: string; text?: string };

interface MessageInputProps {
  onSendMessage: (content: MessageContent, replyTo?: Message) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  editingMessage: Message | null;
  onCancelEdit: () => void;
  conversationId: string;
  messages: Message[];
  onAiAction: (action: 'suggest-reply' | 'summarize', context: Message[], conversationId: string) => void;
  aiSuggestedReply: { convoId: string, text: string } | null;
  onSuggestionUsed: () => void;
}

const AiMenu: React.FC<{onAction: (action: 'suggest-reply' | 'summarize') => void, onClose: () => void}> = ({ onAction, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute bottom-full mb-2 bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-lg shadow-lg border border-light-border dark:border-twitter-border z-20 text-sm w-48"
        >
            <button onClick={() => onAction('suggest-reply')} className="w-full text-left flex items-center gap-2 p-3 hover:bg-light-hover dark:hover:bg-white/10">
                <ReplyIcon/> Suggest reply
            </button>
            <button onClick={() => onAction('summarize')} className="w-full text-left flex items-center gap-2 p-3 hover:bg-light-hover dark:hover:bg-white/10">
                <SparklesIcon/> Summarize chat
            </button>
        </motion.div>
    );
};


const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, replyingTo, onCancelReply, editingMessage, onCancelEdit, conversationId, messages, onAiAction, aiSuggestedReply, onSuggestionUsed }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [slidePosition, setSlidePosition] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  const micButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const slidePositionRef = useRef(0);
  const recordingTimeRef = useRef(0);
  
  useEffect(() => {
    if (editingMessage) {
        setInputText(editingMessage.text || '');
        textInputRef.current?.focus();
    }
  }, [editingMessage]);

  useEffect(() => {
      recordingTimeRef.current = recordingTime;
  }, [recordingTime]);

  const handleSendMessage = () => {
    if (inputText.trim() || imagePreview) {
      if (imagePreview) {
        onSendMessage({ type: 'image', imageUrl: imagePreview, text: inputText.trim() }, replyingTo || undefined);
      } else if (inputText.trim()) {
        onSendMessage({ type: 'text', text: inputText.trim() }, replyingTo || undefined);
      }
      setInputText('');
      setImagePreview(null);
      onCancelReply();
      onCancelEdit();
    }
  };
  
  const handleSelectGif = (url: string) => {
    onSendMessage({ type: 'gif', gifUrl: url }, replyingTo || undefined);
    setIsGifModalOpen(false);
    onCancelReply();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

        if (slidePositionRef.current < -80) { // Canceled
             URL.revokeObjectURL(audioUrl);
        } else {
            onSendMessage({ type: 'voice', audioUrl: audioUrl, duration: recordingTimeRef.current }, replyingTo || undefined);
            onCancelReply();
        }
        stream.getTracks().forEach(track => track.stop());
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        
        setIsRecording(false);
        setRecordingTime(0);
        setSlidePosition(0);
        slidePositionRef.current = 0;
        recordingTimeRef.current = 0;
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
    const handleTouchEnd = () => stopRecording();
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchend', handleTouchEnd);
    }
  }, [isRecording]);

  const handleRecordingMove = (clientX: number) => {
    if (isRecording && micButtonRef.current) {
        const rect = micButtonRef.current.getBoundingClientRect();
        const newSlidePosition = clientX - (rect.left + rect.width / 2);
        const cappedSlidePosition = Math.min(0, newSlidePosition);
        setSlidePosition(cappedSlidePosition);
        slidePositionRef.current = cappedSlidePosition;
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

  const handleAiActionSelect = (action: 'suggest-reply' | 'summarize') => {
      onAiAction(action, messages, conversationId);
      setIsAiMenuOpen(false);
  }

  const cancelThreshold = -80;
  const isCancelZone = slidePosition < cancelThreshold;
  const showAttachmentIcons = !inputText && !imagePreview;

  return (
    <div className="p-2 border-t border-light-border dark:border-twitter-border dim:border-dim-border relative">
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <AnimatePresence>
        {aiSuggestedReply && aiSuggestedReply.convoId === conversationId && (
            <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-light-hover dark:bg-white/5 dim:bg-dim-hover p-2 rounded-lg mx-2 mb-2 flex justify-between items-center text-sm"
            >
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-twitter-blue" />
                    <p className="italic text-light-secondary-text dark:text-twitter-gray">{aiSuggestedReply.text}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => { setInputText(aiSuggestedReply.text); onSuggestionUsed(); }} 
                        className="font-semibold text-twitter-blue px-2 py-1 rounded-md hover:bg-twitter-blue/10"
                    >Use</button>
                    <button onClick={onSuggestionUsed} className="font-bold p-1">&times;</button>
                </div>
            </motion.div>
        )}
        {(replyingTo || editingMessage) && (
            <motion.div
                layout
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-light-hover dark:bg-white/5 dim:bg-dim-hover p-2 rounded-t-lg mx-2 flex justify-between items-center"
            >
            <div className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text border-l-2 border-twitter-blue pl-2">
                <p className="font-bold text-light-text dark:text-dim-text">
                    {editingMessage ? 'Editing message' : `Replying to ${replyingTo?.senderId === 'u1' ? 'yourself' : 'them'}`}
                </p>
                <p className="italic truncate max-w-xs">
                    {(editingMessage || replyingTo)?.type === 'text' ? (editingMessage || replyingTo)?.text : 'Media message'}
                </p>
            </div>
            <button onClick={editingMessage ? onCancelEdit : onCancelReply} className="font-bold text-xl p-1">&times;</button>
            </motion.div>
        )}
      </AnimatePresence>
     
      <div className="flex items-end min-h-[44px]">
        <AnimatePresence mode="wait">
            {isRecording ? (
                <motion.div 
                    key="recording-ui"
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-full flex items-center justify-between px-4 overflow-hidden relative"
                >
                    <div className="flex items-center gap-2 text-red-500">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-mono">{formatTime(recordingTime)}</span>
                    </div>
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-light-secondary-text dark:text-twitter-gray"
                        animate={{ opacity: isCancelZone ? 0 : 1, x: isCancelZone ? -20 : 0 }}
                    >
                        <ChevronLeftIcon />
                        <span>Slide to cancel</span>
                    </motion.div>
                     <motion.div
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isCancelZone ? 1 : 0, x: isCancelZone ? 0 : 20 }}
                    >
                        <TrashIcon />
                        <span>Release to cancel</span>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div 
                    key="text-input-ui"
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex-1 flex flex-col gap-2 mx-2"
                >
                    {imagePreview && (
                        <div className="relative w-24 h-24 ml-2 mt-1">
                            <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-lg"/>
                            <button onClick={() => setImagePreview(null)} className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full p-0.5"><CloseIcon/></button>
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border rounded-full px-2 sm:px-4 py-1 transition-all duration-200">
                      <div className="relative">
                          <button onClick={() => setIsAiMenuOpen(prev => !prev)} className="p-2 text-twitter-blue hover:bg-twitter-blue/10 rounded-full"><SparklesIcon /></button>
                          {isAiMenuOpen && <AiMenu onClose={() => setIsAiMenuOpen(false)} onAction={handleAiActionSelect} />}
                      </div>
                      <AnimatePresence>
                        {showAttachmentIcons && (
                            <motion.div 
                                className="flex"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                              <div className="flex gap-1 text-twitter-blue">
                                  <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-twitter-blue/10 rounded-full"><PaperclipIcon /></button>
                                  <button onClick={() => setIsGifModalOpen(true)} className="p-2 hover:bg-twitter-blue/10 rounded-full"><GifIcon /></button>
                                  <button onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)} className="p-2 hover:bg-twitter-blue/10 rounded-full"><EmojiIcon /></button>
                                  <button onClick={() => onSendMessage({type: 'wave'}, replyingTo || undefined)} className="p-2 hover:bg-twitter-blue/10 rounded-full"><WaveIcon/></button>
                              </div>
                            </motion.div>
                        )}
                      </AnimatePresence>
                      <input
                          ref={textInputRef}
                          type="text"
                          placeholder="Start a new message"
                          className="bg-transparent w-full focus:outline-none text-light-text dark:text-white dim:text-dim-text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        
        <div className="px-2">
            {(inputText || imagePreview) && !isRecording ? (
                 <button onClick={handleSendMessage} className="p-2 text-twitter-blue">
                    {editingMessage ? <CheckmarkCircleIcon className="w-6 h-6"/> : <SendIcon />}
                </button>
            ) : (
                <motion.button 
                    ref={micButtonRef}
                    onMouseDown={startRecording}
                    onTouchStart={startRecording}
                    className="p-2 text-twitter-blue relative"
                    animate={{ 
                        scale: isRecording ? 1.2 : 1, 
                        x: slidePosition 
                    }}
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