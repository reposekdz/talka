import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Call } from '../types';
import { EndCallIcon, MicOffIcon, MicrophoneIcon, CameraOnIcon, CameraOffIcon, MinimizeIcon, EmojiIcon, ScreenShareIcon, ChatBubbleIcon } from './Icon';
import FloatingEmojis from './FloatingEmojis';
import ReactionPicker from './ReactionPicker';

interface CallViewProps {
  call: Call;
  onEndCall: () => void;
  onMinimize: () => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onSendReaction: (emoji: string) => void;
  reactions: { id: number; emoji: string }[];
  setReactions: React.Dispatch<React.SetStateAction<{ id: number; emoji: string }[]>>;
}

const AudioVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const draw = () => {
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            const bars = 30;
            const barWidth = width / bars / 2;
            const radius = height / 4;
            const centerX = width / 2;
            const centerY = height / 2;

            for (let i = 0; i < bars; i++) {
                const angle = (i / bars) * 2 * Math.PI;
                const barHeight = 10 + (Math.sin(Date.now() * 0.005 + i * 0.5) + 1) * 20;
                
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(angle);

                const gradient = ctx.createLinearGradient(0, -radius - barHeight, 0, -radius);
                gradient.addColorStop(0, 'rgba(29, 161, 242, 0.8)');
                gradient.addColorStop(1, 'rgba(29, 161, 242, 0.2)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(-barWidth / 2, -radius - barHeight, barWidth, barHeight);
                ctx.restore();
            }
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};


const CallView: React.FC<CallViewProps> = (props) => {
  const { call, onEndCall, onMinimize, onToggleMic, onToggleCamera, onSendReaction, reactions, setReactions } = props;
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: call.type === 'video', audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream; // Simulate remote stream
      } catch (err) {
        console.error("Error accessing media devices.", err);
        onEndCall();
      }
    };
    startStream();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [call.type, onEndCall]);
  
  const onEmojiComplete = (id: number) => {
    setReactions(prev => prev.filter(e => e.id !== id));
  };

  const handleSelectReaction = (emoji: string) => {
      onSendReaction(emoji);
      setIsReactionPickerOpen(false);
  }

  const controlButtonClasses = "p-3 bg-white/10 text-white backdrop-blur-md rounded-full hover:bg-white/20 transition-colors";

  return (
    <motion.div
        drag
        dragMomentum={false}
        dragConstraints={{ top: 16, left: 16, right: window.innerWidth - 384, bottom: window.innerHeight - 500 }}
        className="fixed top-16 left-1/2 -translate-x-1/2 w-[384px] h-[500px] bg-black rounded-2xl shadow-2xl z-50 overflow-hidden cursor-grab active:cursor-grabbing flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
    >
      <FloatingEmojis emojis={reactions} onComplete={onEmojiComplete} />
      {call.type === 'video' ? (
        <video ref={remoteVideoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <AudioVisualizer />
            <img src={call.user.avatarUrl} alt={call.user.displayName} className="w-32 h-32 rounded-full z-10"/>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/20"></div>

      <header className="relative z-10 p-4 flex justify-between items-center text-white">
        <div >
            <h2 className="font-bold">{call.user.displayName}</h2>
            <p className="text-sm">{call.status === 'outgoing' ? 'Ringing...' : 'Connected'}</p>
        </div>
        <button onClick={onMinimize} className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors">
            <MinimizeIcon className="w-5 h-5" />
        </button>
      </header>
      
      {call.type === 'video' && (
        <motion.div
            drag
            dragConstraints={{ top: 0, left: 0, right: 384 - 128, bottom: 500 - 96 }}
            className="absolute top-20 right-4 w-32 h-24 rounded-lg overflow-hidden shadow-lg cursor-grab active:cursor-grabbing z-20"
        >
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </motion.div>
      )}

      <footer className="relative z-10 mt-auto p-4">
        <div className="flex justify-center items-center gap-3">
          <button onClick={onToggleMic} className={`${controlButtonClasses} ${call.isMicMuted ? 'bg-white text-black' : ''}`}>
            {call.isMicMuted ? <MicOffIcon /> : <MicrophoneIcon />}
          </button>
          {call.type === 'video' && (
            <button onClick={onToggleCamera} className={`${controlButtonClasses} ${call.isCameraOff ? 'bg-white text-black' : ''}`}>
                {call.isCameraOff ? <CameraOffIcon /> : <CameraOnIcon />}
            </button>
          )}
          <button onClick={() => setIsReactionPickerOpen(true)} className={`${controlButtonClasses} relative`}>
            <EmojiIcon />
            {isReactionPickerOpen && <ReactionPicker onSelect={handleSelectReaction} onClose={() => setIsReactionPickerOpen(false)} />}
          </button>
           <button onClick={onEndCall} className="p-4 bg-red-600 text-white rounded-full">
            <EndCallIcon />
          </button>
        </div>
      </footer>
    </motion.div>
  );
};

export default CallView;
