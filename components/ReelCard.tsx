
import React, { useState, useRef, useEffect } from 'react';
import { Reel, Conversation, ReelComment } from '../types';
import { PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon, LikeIcon, HeartFillIcon, DislikeIcon, DislikeFillIcon, MessagesIcon, ShareIcon, MoreIcon, BookmarkFillIcon, BookmarkIcon } from './Icon';
import Avatar from './Avatar';
import { AnimatePresence } from 'framer-motion';
import ReelCommentsPanel from './ReelCommentsPanel';
import ShareReelModal from './ShareReelModal';
import ReelOptionsModal from './ReelOptionsModal';

interface ReelCardProps {
  reel: Reel;
  isCurrent: boolean;
  onPostComment: (reelId: string, text: string, replyTo?: ReelComment) => void;
  onLikeComment: (reelId: string, commentId: string) => void;
  onShareReel: (reelId: string, conversationIds: string[], message?: string) => void;
  conversations: Conversation[];
  onLikeReel: (reelId: string) => void;
  onDislikeReel: (reelId: string) => void;
  onToggleBookmark: (reelId: string) => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, isCurrent, onPostComment, onLikeComment, onShareReel, conversations, onLikeReel, onDislikeReel, onToggleBookmark }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    useEffect(() => {
        if (isCurrent && videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Autoplay failed", e));
        } else if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, [isCurrent]);

    const handleVideoClick = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    return (
        <div className="relative w-full h-full">
            <video
                ref={videoRef}
                src={reel.videoUrl}
                loop
                muted={isMuted}
                onClick={handleVideoClick}
                className="w-full h-full object-contain"
            />

            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <PlayIcon className="w-20 h-20 text-white/50" />
                </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                    <Avatar src={reel.user.avatarUrl} alt={reel.user.displayName} size="small" />
                    <span className="font-bold">{reel.user.displayName}</span>
                    <button className="border border-white px-3 py-1 text-sm rounded-md font-semibold">Follow</button>
                </div>
                <p className="mt-2 text-sm">{reel.caption}</p>
            </div>
            
            <div className="absolute right-2 bottom-4 flex flex-col items-center gap-4 text-white">
                 <button onClick={() => onLikeReel(reel.id)} className="flex flex-col items-center gap-1">
                    {reel.isLiked ? <HeartFillIcon className="w-7 h-7 text-red-500" /> : <LikeIcon className="w-7 h-7" />}
                    <span className="text-xs font-semibold">{reel.likeCount.toLocaleString()}</span>
                </button>
                 <button onClick={() => onDislikeReel(reel.id)} className="flex flex-col items-center gap-1">
                    {reel.isDisliked ? <DislikeFillIcon className="w-7 h-7" /> : <DislikeIcon className="w-7 h-7" />}
                 </button>
                 <button onClick={() => setIsCommentsOpen(true)} className="flex flex-col items-center gap-1">
                    <MessagesIcon className="w-7 h-7" />
                    <span className="text-xs font-semibold">{reel.commentCount.toLocaleString()}</span>
                </button>
                 <button onClick={() => setIsShareOpen(true)} className="flex flex-col items-center gap-1">
                    <ShareIcon className="w-7 h-7" />
                    <span className="text-xs font-semibold">{reel.shareCount.toLocaleString()}</span>
                </button>
                <button onClick={() => onToggleBookmark(reel.id)} className="flex flex-col items-center gap-1">
                     {reel.isBookmarked ? <BookmarkFillIcon className="w-7 h-7 text-twitter-blue" /> : <BookmarkIcon className="w-7 h-7" />}
                </button>
                <button onClick={() => setIsOptionsOpen(true)} className="p-2"><MoreIcon className="w-7 h-7" /></button>
            </div>

            <div className="absolute top-4 right-4">
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-black/40 rounded-full">
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </button>
            </div>

            <AnimatePresence>
                {isCommentsOpen && (
                    <div className="absolute inset-0 sm:inset-auto sm:top-0 sm:right-0 sm:bottom-0 sm:w-96">
                        <ReelCommentsPanel reel={reel} onClose={() => setIsCommentsOpen(false)} onPostComment={onPostComment} onLikeComment={onLikeComment} />
                    </div>
                )}
                {isShareOpen && <ShareReelModal reel={reel} conversations={conversations} onClose={() => setIsShareOpen(false)} onShare={onShareReel} />}
                {isOptionsOpen && <ReelOptionsModal isBookmarked={reel.isBookmarked} onToggleBookmark={() => onToggleBookmark(reel.id)} onClose={() => setIsOptionsOpen(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default ReelCard;
