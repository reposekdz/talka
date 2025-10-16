import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Call } from '../types';
import { PhoneIcon, VideoCallIcon, MessagesIcon } from './Icon';

interface IncomingCallModalProps {
  call: Call;
  onAccept: () => void;
  onDecline: () => void;
  onReplyWithMessage: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ call, onAccept, onDecline, onReplyWithMessage }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const quickReplies = ["I'll call you back.", "Can't talk right now.", "In a meeting."];
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    const getMedia = async () => {
      if (call.type === 'video') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setLocalStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Couldn't access camera for preview:", err);
        }
      }
    };
    getMedia();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [call.type]);

  const handleQuickReply = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowQuickReplies(true);
  }

  const handleSelectQuickReply = () => {
      onReplyWithMessage();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col justify-between items-center text-center p-8 text-white"
    >
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover blur-xl scale-110" />
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 text-left w-full sm:text-center">
        <p className="font-semibold">{call.user.displayName}</p>
        <p className="text-sm text-white/80">Proto-Twitter {call.type} call</p>
      </div>

      <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-4">
              <img src={call.user.avatarUrl} alt={call.user.displayName} className="w-28 h-28 rounded-full border-4 border-white mb-4"/>
              <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold">Incoming {call.type} call...</h2>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence>
            {showQuickReplies && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute bottom-full left-0 right-0 mb-4 bg-black/50 backdrop-blur-md rounded-xl p-2 space-y-2"
                >
                    {quickReplies.map(reply => (
                        <button key={reply} onClick={handleSelectQuickReply} className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20">{reply}</button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
        <div className="flex justify-around items-center w-full">
            <div className="flex flex-col items-center gap-2">
                <button onClick={onDecline} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform">
                    <PhoneIcon className="transform -rotate-[135deg]"/>
                </button>
                <span className="text-sm">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <button onClick={handleQuickReply} className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform">
                    <MessagesIcon />
                </button>
                <span className="text-sm">Reply</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <motion.button 
                    onClick={onAccept}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    {call.type === 'video' ? <VideoCallIcon /> : <PhoneIcon />}
                </motion.button>
                <span className="text-sm">Accept</span>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default IncomingCallModal;
