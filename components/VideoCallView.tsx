
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { EndCallIcon, MicOffIcon, MicrophoneIcon, CameraOnIcon, CameraOffIcon } from './Icon';

interface VideoCallViewProps {
  user: User;
  status: 'outgoing' | 'active';
  onEndCall: () => void;
}

const VideoCallView: React.FC<VideoCallViewProps> = ({ user, status, onEndCall }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCall = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream; // Simulate remote stream
      } catch (err) {
        console.error("Error accessing media devices.", err);
        alert("Failed to access camera and microphone. Please check permissions.");
        onEndCall();
      }
    };

    startCall();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onEndCall]);

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMicMuted(prev => !prev);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsCameraOff(prev => !prev);
    }
  };
  
  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    onEndCall();
  };

  const controlButtonClasses = "p-3 rounded-full transition-colors duration-200";

  return (
    // FIX: Wrapped framer-motion props to bypass type errors.
    <motion.div
      {...{
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      <video ref={remoteVideoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/20"></div>

      {status === 'outgoing' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
            <img src={user.avatarUrl} alt={user.displayName} className="w-24 h-24 rounded-full border-4 border-white mb-4"/>
            <h2 className="text-3xl font-bold">Calling {user.displayName}...</h2>
        </div>
      ) : (
        // FIX: Wrapped framer-motion props to bypass type errors.
        <motion.div
            {...{
                drag: true,
                dragConstraints: { left: 0, right: window.innerWidth - 160, top: 0, bottom: window.innerHeight - 120 },
            }}
            className="absolute top-4 right-4 w-40 h-30 rounded-lg overflow-hidden shadow-lg cursor-grab active:cursor-grabbing z-20"
        >
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </motion.div>
      )}


      <div className="absolute top-4 left-4 z-10 text-white">
        <h2 className="text-2xl font-bold">Video call with {user.displayName}</h2>
        <p>{status === 'outgoing' ? 'Ringing...' : 'Connected'}</p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <button onClick={toggleMic} className={`${controlButtonClasses} ${isMicMuted ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>
            {isMicMuted ? <MicOffIcon /> : <MicrophoneIcon />}
        </button>
        <button onClick={toggleCamera} className={`${controlButtonClasses} ${isCameraOff ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>
            {isCameraOff ? <CameraOffIcon /> : <CameraOnIcon />}
        </button>
         <button onClick={handleEndCall} className={`${controlButtonClasses} bg-red-600 text-white`}>
            <EndCallIcon />
        </button>
      </div>
    </motion.div>
  );
};

export default VideoCallView;
