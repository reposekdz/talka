
import React, { useState, useRef } from 'react';
import { Tweet, PollOption } from '../types';
import { PhotoIcon, GifIcon, ChartBarIcon, EmojiIcon, CalendarIcon, GlobeIcon, MicrophoneIcon, StopIcon, TrashIcon, SparklesIcon } from './Icon';
import Avatar from './Avatar';
import { mockUser } from '../data/mockData';
import GifComposerModal from './GifComposerModal';
import AiImageGeneratorModal from './AiImageGeneratorModal';

interface ComposerProps {
  onPostTweet: (tweet: Partial<Tweet>) => void;
  placeholder?: string;
}

const Composer: React.FC<ComposerProps> = ({ onPostTweet, placeholder = "What is happening?!" }) => {
  const [text, setText] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [isPollVisible, setIsPollVisible] = useState(false);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: 'po1', text: '', votes: 0 },
    { id: 'po2', text: '', votes: 0 },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [isAiImageModalOpen, setIsAiImageModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const urls = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setMedia(prev => [...prev, ...urls]);
    }
  };

  const handlePost = () => {
    const newTweet: Partial<Tweet> = { content: text };
    if (media.length > 0) newTweet.mediaUrls = media;
    if (isPollVisible) {
      newTweet.poll = {
        id: `p${Date.now()}`,
        options: pollOptions.filter(opt => opt.text.trim()),
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        totalVotes: 0
      };
    }
    onPostTweet(newTweet);
    setText('');
    setMedia([]);
    setIsPollVisible(false);
  };
  
  const handleAttachImageFromAI = (base64Image: string) => {
    setMedia(prev => [...prev, base64Image]);
    setIsAiImageModalOpen(false);
  };

  const isDisabled = text.trim().length === 0 && media.length === 0;

  return (
    <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex gap-4">
      <div className="flex-shrink-0">
        <Avatar src={mockUser.avatarUrl} alt={mockUser.displayName} />
      </div>
      <div className="flex-1">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-xl resize-none focus:outline-none placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text"
          rows={1}
        />
        {media.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {media.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="media preview" className="rounded-lg w-full h-full object-cover" />
                <button onClick={() => setMedia(m => m.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1">
                    <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-twitter-blue">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*,video/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-twitter-blue/10 rounded-full"><PhotoIcon /></button>
            <button onClick={() => setIsGifModalOpen(true)} className="p-2 hover:bg-twitter-blue/10 rounded-full"><GifIcon /></button>
            <button onClick={() => setIsPollVisible(!isPollVisible)} className="p-2 hover:bg-twitter-blue/10 rounded-full"><ChartBarIcon /></button>
            <button className="p-2 hover:bg-twitter-blue/10 rounded-full"><EmojiIcon /></button>
            <button className="p-2 hover:bg-twitter-blue/10 rounded-full"><CalendarIcon /></button>
            <button onClick={() => setIsAiImageModalOpen(true)} className="p-2 hover:bg-twitter-blue/10 rounded-full"><SparklesIcon /></button>
          </div>
          <button 
            onClick={handlePost}
            className="bg-twitter-blue text-white font-bold px-6 py-2 rounded-full hover:bg-opacity-90 disabled:opacity-50"
            disabled={isDisabled}
          >
            Post
          </button>
        </div>
      </div>
      {isGifModalOpen && <GifComposerModal onClose={() => setIsGifModalOpen(false)} onSelectGif={(url) => { setMedia([...media, url]); setIsGifModalOpen(false); }} />}
      {isAiImageModalOpen && <AiImageGeneratorModal onClose={() => setIsAiImageModalOpen(false)} onAttachImage={handleAttachImageFromAI} />}
    </div>
  );
};

export default Composer;
