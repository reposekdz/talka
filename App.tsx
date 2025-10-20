

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import BookmarksPage from './pages/BookmarksPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ReelsPage from './pages/ReelsPage';
import CreatorStudioPage from './pages/CreatorStudioPage';
import SettingsPage from './pages/SettingsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ListsPage from './pages/ListsPage';
import DisplayModal from './components/DisplayModal';
import SearchModal from './components/SearchModal';
import Lightbox from './components/Lightbox';
import ReplyModal from './components/ReplyModal';
import QuoteTweetModal from './components/QuoteTweetModal';
import EditTweetModal from './components/EditTweetModal';
import StoryViewer from './components/StoryViewer';
import FloatingChatManager from './components/FloatingChatManager';
import InAppNotification from './components/InAppNotification';
import IncomingCallModal from './components/IncomingCallModal';
import ActiveCallBubble from './components/ActiveCallBubble';
import SpacesPlayer from './components/SpacesPlayer';
import Toast from './components/Toast';
import CreatorFlowModal from './components/CreatorFlowModal';
import GrokAnalysisModal from './components/GrokAnalysisModal';
import EditProfileModal from './components/EditProfileModal';
import AiAssistantModal from './components/AiAssistantModal';
import AiSummaryModal from './components/AiSummaryModal';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MobileDrawer from './components/MobileDrawer';
import MobileExploreDrawer from './components/MobileExploreDrawer';
import CallView from './components/CallView';
import CreateHighlightModal from './components/CreateHighlightModal';
import HighlightViewerModal from './components/HighlightViewerModal';
import UserListModal from './components/UserListModal';
import ListenAlongModal from './components/ListenAlongModal';


import { Page, Theme, Tweet, User, AppSettings, UserStory, Highlight, Conversation, Message, ChatTheme, Reel, Story, Call, Space, ReelComment, Moment } from './types';
import { mockUser as initialMockUser, otherUsers as initialOtherUsers, mockTweets as initialMockTweets, mockNotifications, mockConversations as initialMockConversations, mockMessages as initialMockMessages, initialUserStories, mockHighlights as initialMockHighlights, mockReels as initialMockReels, mockMoments as initialMockMoments } from './data/mockData';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';

type MessageContent = | { type: 'text'; text: string } | { type: 'voice'; audioUrl: string; duration: number } | { type: 'gif'; gifUrl: string } | { type: 'wave' } | { type: 'image', imageUrl: string, text?: string } | { type: 'reel-share', reelId: string };


const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [currentUser, setCurrentUser] = useState<User>(initialMockUser);
    const [otherUsers, setOtherUsers] = useState<User[]>(initialOtherUsers);
    const [tweets, setTweets] = useState<Tweet[]>(initialMockTweets);
    const [userStories, setUserStories] = useState<UserStory[]>(initialUserStories);
    const [highlights, setHighlights] = useState<Highlight[]>(initialMockHighlights);
    const [reels, setReels] = useState<Reel[]>(initialMockReels);
    const [moments, setMoments] = useState<Moment[]>(initialMockMoments);
    
    // Modals and overlays state
    const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [lightboxState, setLightboxState] = useState<{ images: string[], startIndex: number } | null>(null);
    const [replyingToTweet, setReplyingToTweet] = useState<Tweet | null>(null);
    const [quotingTweet, setQuotingTweet] = useState<Tweet | null>(null);
    const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
    const [storyViewerState, setStoryViewerState] = useState<{ stories: UserStory[], initialUserIndex: number } | null>(null);
    const [viewingHighlight, setViewingHighlight] = useState<Highlight | null>(null);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [creatorMode, setCreatorMode] = useState<'select' | 'story' | 'reel' | 'post' | 'moment' | undefined>(undefined);
    const [grokTweet, setGrokTweet] = useState<Tweet | null>(null);
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [isAiSummaryOpen, setIsAiSummaryOpen] = useState<{ user: User; tweets: Tweet[] } | null>(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isCreateHighlightModalOpen, setIsCreateHighlightModalOpen] = useState(false);

    // Chat state
    const [allKnownConversations, setAllKnownConversations] = useState<Conversation[]>(initialMockConversations);
    const [activeChats, setActiveChats] = useState<Conversation[]>([]);
    const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(initialMockMessages);
    const [inAppNotification, setInAppNotification] = useState<{ conversation: Conversation; message: Message; } | null>(null);
    const [aiSuggestedReply, setAiSuggestedReply] = useState<{ convoId: string, text: string } | null>(null);
    
    // Call state
    const [activeCall, setActiveCall] = useState<Call | null>(null);
    const [incomingCall, setIncomingCall] = useState<Call | null>(null);
    const [callReactions, setCallReactions] = useState<{ id: number; emoji: string }[]>([]);

    // Spaces state
    const [activeSpace, setActiveSpace] = useState<Space | null>(null);
    const [listenAlongSpace, setListenAlongSpace] = useState<Space | null>(null);
    
    // User list modal state
    const [userListModal, setUserListModal] = useState<{user: User, initialTab: 'followers' | 'following'} | null>(null);

    // Mobile specific state
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ message: string, id: number, duration?: number, actionText?: string, onAction?: () => void } | null>(null);

    // Live Reactions
    const [liveReactions, setLiveReactions] = useState<{ id: number; emoji: string; tweetId: string }[]>([]);


    const showToast = (message: string, duration: number = 3, actionText?: string, onAction?: () => void) => {
        setToast({ message, id: Date.now(), duration, actionText, onAction });
    };

    const [appSettings, setAppSettings] = useState<AppSettings>({
        privacyAndSafety: { protectPosts: false, photoTagging: 'everyone', dmRequests: 'everyone' },
        security: { twoFactorEnabled: false },
        notifications: { mutedWords: [], likes: true, retweets: true, dms: true },
        accessibilityDisplayAndLanguages: { reduceMotion: false, videoAutoplay: 'on-cellular-wifi', language: 'English' },
    });
    
    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);
    
    const filteredTweetsForYou = useMemo(() => {
        const { mutedWords } = appSettings.notifications;
        if (mutedWords.length === 0) return tweets;
        return tweets.filter(tweet => !mutedWords.some(word => tweet.content.toLowerCase().includes(word.toLowerCase())));
    }, [tweets, appSettings.notifications.mutedWords]);

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    const handlePostTweet = (tweetContent: Partial<Tweet>) => {
        const newTweet: Tweet = {
            id: `t-new-${Date.now()}`,
            user: currentUser,
            content: tweetContent.content || '',
            timestamp: new Date().toISOString(),
            replyCount: 0,
            retweetCount: 0,
            likeCount: 0,
            shareCount: 0,
            viewCount: 0,
            ...tweetContent
        };
        setTweets(prev => [newTweet, ...prev]);
        showToast("Your Post was sent.");
        setIsCreatorOpen(false);
        setCurrentPage(Page.Home);
    };

     const handlePostStory = (newStoryData: Omit<Story, 'id' | 'timestamp'>) => {
        const newStory: Story = {
            ...newStoryData,
            id: `s-new-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };

        setUserStories(prev => {
            const userStoryIndex = prev.findIndex(us => us.user.id === currentUser.id);
            if (userStoryIndex > -1) {
                const updatedStories = [...prev];
                updatedStories[userStoryIndex].stories.push(newStory);
                updatedStories[userStoryIndex].hasUnseen = true;
                return updatedStories;
            } else {
                return [{ user: currentUser, stories: [newStory], hasUnseen: true }, ...prev];
            }
        });

        showToast("Your story was posted.");
        setIsCreatorOpen(false);
        setCurrentPage(Page.Home);
    };

    const handlePostReel = (videoUrl: string, caption: string) => {
        const newReel: Reel = {
            id: `r-new-${Date.now()}`,
            user: currentUser,
            videoUrl,
            caption,
            likeCount: 0,
            dislikeCount: 0,
            commentCount: 0,
            shareCount: 0,
            isLiked: false,
            isDisliked: false,
            isBookmarked: false,
            comments: [],
        };
        setReels(prev => [newReel, ...prev]);
        showToast("Your reel was shared.");
        setIsCreatorOpen(false);
        setCurrentPage(Page.Reels);
    };
    
    const handlePostMoment = (content: Moment['content']) => {
        const newMoment: Moment = {
            id: `m-new-${Date.now()}`,
            user: currentUser,
            content,
            timestamp: new Date().toISOString(),
        };
        setMoments(prev => [newMoment, ...prev]);
        showToast("Your Moment was shared.");
        setIsCreatorOpen(false);
        setCurrentPage(Page.Home);
    };

    const handlePostReelComment = (reelId: string, text: string, replyTo?: ReelComment) => {
        const newComment: ReelComment = {
            id: `rc-new-${Date.now()}`,
            user: currentUser,
            text,
            timestamp: new Date().toISOString(),
            likeCount: 0,
            isLiked: false,
            replyToUsername: replyTo?.user.username,
        };
        setReels(prev => prev.map(r => {
            if (r.id === reelId) {
                return {
                    ...r,
                    comments: [newComment, ...r.comments],
                    commentCount: r.commentCount + 1,
                };
            }
            return r;
        }));
        showToast('Comment posted!');
    };

    const handleLikeReelComment = (reelId: string, commentId: string) => {
        setReels(prev => prev.map(r => {
            if (r.id === reelId) {
                return {
                    ...r,
                    comments: r.comments.map(c => {
                        if (c.id === commentId) {
                            return {
                                ...c,
                                isLiked: !c.isLiked,
                                likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1,
                            };
                        }
                        return c;
                    }),
                };
            }
            return r;
        }));
    };

    const handleShareReel = (reelId: string, conversationIds: string[], message?: string) => {
        conversationIds.forEach(convoId => {
            const newReelShareMessage: Message = {
                id: `msg-reelshare-${Date.now()}`,
                senderId: currentUser.id,
                timestamp: new Date().toISOString(),
                isRead: true,
                type: 'reel-share',
                reelId: reelId,
                text: message,
            };

            setAllMessages(prev => ({
                ...prev,
                [convoId]: [...(prev[convoId] || []), newReelShareMessage]
            }));
            
            const updateLastMessage = (c: Conversation) => c.id === convoId ? { ...c, lastMessage: newReelShareMessage } : c;
            setAllKnownConversations(prev => prev.map(updateLastMessage));
            setActiveChats(prev => prev.map(updateLastMessage));
        });

        showToast(`Reel shared to ${conversationIds.length} chat(s).`);
    };

    const handleLikeReel = (reelId: string) => {
        setReels(prev => prev.map(r => {
            if (r.id === reelId) {
                const isLiked = !r.isLiked;
                const isDisliked = isLiked ? false : r.isDisliked; // Can't like and dislike at same time
                return {
                    ...r,
                    isLiked,
                    isDisliked,
                    likeCount: isLiked ? r.likeCount + 1 : r.likeCount - 1,
                    dislikeCount: (r.isDisliked && isLiked) ? r.dislikeCount -1 : r.dislikeCount,
                }
            }
            return r;
        }))
    };

    const handleDislikeReel = (reelId: string) => {
        setReels(prev => prev.map(r => {
            if (r.id === reelId) {
                const isDisliked = !r.isDisliked;
                const isLiked = isDisliked ? false : r.isLiked;
                return {
                    ...r,
                    isDisliked,
                    isLiked,
                    dislikeCount: isDisliked ? r.dislikeCount + 1 : r.dislikeCount - 1,
                    likeCount: (r.isLiked && isDisliked) ? r.likeCount - 1 : r.likeCount,
                }
            }
            return r;
        }))
    };

    const handleToggleReelBookmark = (reelId: string) => {
        const reel = reels.find(r => r.id === reelId);
        if (!reel) return;
        setReels(prev => prev.map(r => r.id === reelId ? { ...r, isBookmarked: !r.isBookmarked } : r));
        showToast(reel.isBookmarked ? 'Reel removed from Bookmarks' : 'Reel added to your Bookmarks');
    };

    const handleCreateHighlight = ({ title, stories }: { title: string, stories: Story[] }) => {
        const newHighlight: Highlight = {
            id: `h-new-${Date.now()}`,
            title,
            stories,
            coverUrl: stories[0].mediaUrl, // Use the first story as cover
        };
        setHighlights(prev => [newHighlight, ...prev]);
        showToast("New Highlight created!");
        setIsCreateHighlightModalOpen(false);
    };

    const handlePinTweet = (tweetIdToPin: string) => {
        const isCurrentlyPinned = tweets.find(t => t.id === tweetIdToPin)?.pinned;

        setTweets(prevTweets => 
            prevTweets.map(tweet => {
                if (tweet.id === tweetIdToPin) {
                    return { ...tweet, pinned: !isCurrentlyPinned };
                }
                if (tweet.pinned && !isCurrentlyPinned) {
                    return { ...tweet, pinned: false };
                }
                return tweet;
            })
        );
        showToast(isCurrentlyPinned ? 'Unpinned from profile' : 'Pinned to your profile');
    };
    
    const handleFeatureTweet = (tweetIdToFeature: string) => {
        const isCurrentlyFeatured = tweets.find(t => t.id === tweetIdToFeature)?.isFeatured;

        setTweets(prevTweets => 
            prevTweets.map(tweet => {
                if (tweet.id === tweetIdToFeature) {
                    return { ...tweet, isFeatured: !isCurrentlyFeatured };
                }
                // Ensure only one tweet is featured at a time
                if (tweet.isFeatured && !isCurrentlyFeatured) {
                    return { ...tweet, isFeatured: false };
                }
                return tweet;
            })
        );
        showToast(isCurrentlyFeatured ? 'Un-featured from profile' : 'Featured on your profile');
    };

    const handleRemoveFollower = (followerIdToRemove: string) => {
        setCurrentUser(prev => ({
            ...prev,
            followerIds: prev.followerIds.filter(id => id !== followerIdToRemove),
            followerCount: prev.followerCount - 1,
        }));
        setOtherUsers(prev => prev.map(user => {
            if (user.id === followerIdToRemove) {
                return {
                    ...user,
                    followingIds: user.followingIds.filter(id => id !== currentUser.id),
                    followingCount: user.followingCount - 1,
                }
            }
            return user;
        }));
        showToast("Follower removed.");
    };


    const handleUpdateProfileDetails = (updatedUser: Partial<User>) => {
        setCurrentUser(prev => ({ ...prev, ...updatedUser }));
        showToast("Profile details updated.");
    };

    const handleLikeTweet = (tweetId: string) => {
        const tweet = tweets.find(t => t.id === tweetId);
        if (!tweet) return;

        setTweets(prev => prev.map(t => t.id === tweetId ? { ...t, isLiked: !t.isLiked, likeCount: t.isLiked ? t.likeCount - 1 : t.likeCount + 1 } : t));
        
        // Update likedTweetIds for the user
        setCurrentUser(prevUser => {
            const newLikedIds = tweet.isLiked
                ? prevUser.likedTweetIds.filter(id => id !== tweetId)
                : [...prevUser.likedTweetIds, tweetId];
            return { ...prevUser, likedTweetIds: newLikedIds };
        });

        if (!tweet.isLiked) {
            const newReaction = { id: Date.now(), emoji: '❤️', tweetId };
            setLiveReactions(prev => [...prev, newReaction]);
            setTimeout(() => {
                setLiveReactions(prev => prev.filter(r => r.id !== newReaction.id));
            }, 1500);
        }
    };
    
    const handleRetweet = (tweetId: string) => {
        setTweets(prev => prev.map(t => {
            if (t.id === tweetId) {
                const isRetweeted = !!t.isRetweeted;
                return {
                    ...t,
                    isRetweeted: !isRetweeted,
                    retweetCount: isRetweeted ? t.retweetCount - 1 : t.retweetCount + 1
                };
            }
            return t;
        }));
    };

    const handleDeleteTweet = (tweetId: string) => {
        setTweets(prev => prev.filter(t => t.id !== tweetId));
        showToast("Your Post was deleted.");
    };
    
    const handleToggleBookmark = (tweetId: string) => {
        const isBookmarked = tweets.find(t => t.id === tweetId)?.isBookmarked;
        setTweets(prev => prev.map(t => t.id === tweetId ? { ...t, isBookmarked: !t.isBookmarked } : t));
        showToast(isBookmarked ? 'Bookmark removed' : 'Post added to your Bookmarks');
    };
    
    const handleVote = (tweetId: string, optionId: string) => {
        setTweets(prev => prev.map(t => {
            if (t.id === tweetId && t.poll && !t.votedOnPollId) {
                return {
                    ...t,
                    votedOnPollId: optionId,
                    poll: {
                        ...t.poll,
                        totalVotes: t.poll.totalVotes + 1,
                        options: t.poll.options.map(opt =>
                            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                        ),
                    },
                };
            }
            return t;
        }));
        showToast('Your vote has been counted!');
    };


    const handleTranslateTweet = async (tweetId: string) => {
        const tweetToTranslate = tweets.find(t => t.id === tweetId);
        if (!tweetToTranslate || tweetToTranslate.translation) return;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Translate the following text to English: "${tweetToTranslate.content}"`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            
            setTweets(prev => prev.map(t => t.id === tweetId ? { ...t, translation: { text: response.text, sourceLang: 'unknown', targetLang: 'en' } } : t));
        } catch (error) {
            console.error("Translation failed:", error);
            showToast("Failed to translate post.");
        }
    };

    const handleFollowToggle = (userId: string) => {
      setCurrentUser(prev => {
          const isFollowing = prev.followingIds.includes(userId);
          const followingIds = isFollowing ? prev.followingIds.filter(id => id !== userId) : [...prev.followingIds, userId];
          return { ...prev, followingIds, followingCount: followingIds.length };
      });
      setOtherUsers(users => users.map(u => {
          if (u.id === userId) {
              const isFollowed = u.followerIds.includes(currentUser.id);
              const followerIds = isFollowed ? u.followerIds.filter(id => id !== currentUser.id) : [...u.followerIds, currentUser.id];
              return { ...u, followerIds, followerCount: followerIds.length };
          }
          return u;
      }));
    };
    
    const allUsers = useMemo(() => [currentUser, ...otherUsers], [currentUser, otherUsers]);
    
    const handleOpenChat = useCallback((user: User) => {
        if (user.id === currentUser.id) return;

        const existingActiveChat = activeChats.find(c => c.participant.id === user.id);
        if (existingActiveChat) {
            if (activeChats.length > 0 && activeChats[activeChats.length - 1].id !== existingActiveChat.id) {
                setActiveChats(prev => [...prev.filter(c => c.id !== existingActiveChat.id), existingActiveChat]);
            }
            return;
        }

        const knownChat = allKnownConversations.find(c => c.participant.id === user.id);
        if (knownChat) {
            setActiveChats(prev => [...prev, knownChat]);
        } else {
            const newChat: Conversation = {
                id: `c-new-${Date.now()}-${user.id}`,
                participant: user,
                lastMessage: { id: 'm-placeholder', senderId: '', timestamp: new Date().toISOString(), isRead: true, type: 'text', text: 'Start a new conversation' },
                unreadCount: 0,
                chatTheme: 'default-blue',
            };
            setAllKnownConversations(prev => [...prev, newChat]);
            setActiveChats(prev => [...prev, newChat]);
            if (!allMessages[newChat.id]) {
                setAllMessages(prev => ({ ...prev, [newChat.id]: [] }));
            }
        }
    }, [activeChats, allKnownConversations, allMessages, currentUser.id]);

    const handleAiChatAction = async (action: 'suggest-reply' | 'summarize', context: Message[], conversationId: string) => {
        const aiUser = allUsers.find(u => u.id === 'ai-assistant');
        if (!aiUser) return;

        const conversationHistory = context
            .filter(m => m.type === 'text' && m.text)
            .map(m => `${m.senderId === currentUser.id ? 'Me' : 'Them'}: ${m.text}`)
            .join('\n');
        
        let prompt = '';
        if (action === 'suggest-reply') {
            prompt = `Given the following conversation history, suggest a short, casual reply for "Me". Only provide the reply text, nothing else.\n\n---\n${conversationHistory}\n---`;
        } else if (action === 'summarize') {
            prompt = `Summarize the following conversation concisely.\n\n---\n${conversationHistory}\n---`;
        }

        if (!prompt) return;

        showToast("Thinking...", 2);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const resultText = response.text.trim();

            if (action === 'suggest-reply') {
                setAiSuggestedReply({ convoId: conversationId, text: resultText });
            } else if (action === 'summarize') {
                const aiMessage: Message = {
                    id: `msg-ai-${Date.now()}`,
                    senderId: 'ai-assistant',
                    timestamp: new Date().toISOString(),
                    isRead: true,
                    type: 'text',
                    text: `**Summary:**\n${resultText}`,
                };
                 setAllMessages(prev => ({...prev, [conversationId]: [...(prev[conversationId] || []), aiMessage]}));
            }
        } catch (error) {
            console.error("AI Action failed:", error);
            showToast("AI action failed.");
        }
    };
    
    const onSimulateIncomingCall = (user: User) => {
        setIncomingCall({ user, type: 'video', status: 'incoming' });
    };

    const mainContent = () => {
        const commonTweetCardProps = {
            currentUser: currentUser,
            onImageClick: (images: string[], startIndex: number) => setLightboxState({ images, startIndex }),
            onViewProfile: (user: User) => setCurrentPage(Page.Profile),
            onReply: setReplyingToTweet,
            onToggleBookmark: handleToggleBookmark,
            onVote: handleVote,
            onQuote: setQuotingTweet,
            onEdit: setEditingTweet,
            onDeleteTweet: handleDeleteTweet,
            onPinTweet: handlePinTweet,
            onFeatureTweet: handleFeatureTweet,
            onGrok: setGrokTweet,
            onTranslateTweet: handleTranslateTweet,
            onOpenChat: handleOpenChat,
            onLikeTweet: handleLikeTweet,
            onRetweet: handleRetweet,
            liveReactions: liveReactions,
            appSettings: appSettings,
        };
        

        switch (currentPage) {
            case Page.Home:
                return <HomePage 
                    tweets={filteredTweetsForYou}
                    moments={moments}
                    otherUsers={otherUsers}
                    userStories={userStories}
                    onStoryClick={(index) => setStoryViewerState({ stories: userStories, initialUserIndex: index })}
                    onOpenCreator={(mode) => {setIsCreatorOpen(true); setCreatorMode(mode)}}
                    onJoinSpace={setActiveSpace}
                    onPostTweet={handlePostTweet}
                    onFollowToggle={handleFollowToggle}
                    {...commonTweetCardProps}
                />;
            case Page.Explore:
                return <ExplorePage 
                    onImageClick={(url) => {
                        const tweet = tweets.find(t => t.mediaUrls?.includes(url));
                        if (tweet?.mediaUrls) {
                            setLightboxState({ images: tweet.mediaUrls, startIndex: tweet.mediaUrls.indexOf(url) });
                        } else {
                            setLightboxState({ images: [url], startIndex: 0 });
                        }
                    }} 
                    onViewProfile={(user) => setCurrentPage(Page.Profile)}
                    onGrok={setGrokTweet}
                    tweets={tweets} 
                    currentUser={currentUser} 
                />;
            case Page.Notifications:
                return <NotificationsPage />;
            case Page.Messages:
                return <MessagesPage conversations={allKnownConversations} openChat={handleOpenChat} />;
            case Page.Bookmarks:
                return <BookmarksPage tweets={tweets.filter(t => t.isBookmarked)} reels={reels.filter(r => r.isBookmarked)} {...commonTweetCardProps} />;
            case Page.Profile:
                return <ProfilePage 
                    user={currentUser} 
                    allUsers={allUsers}
                    allTweets={tweets}
                    tweets={tweets.filter(t => t.user.id === currentUser.id)} 
                    highlights={highlights}
                    onViewUserList={(user, type) => setUserListModal({user, initialTab: type})}
                    onEditProfile={() => setIsEditProfileOpen(true)}
                    onOpenCreateHighlight={() => setIsCreateHighlightModalOpen(true)}
                    onHighlightClick={setViewingHighlight}
                    onOpenAiSummary={(user, tweets) => setIsAiSummaryOpen({ user, tweets })}
                    onSimulateCall={onSimulateIncomingCall}
                    {...commonTweetCardProps}
                />;
            case Page.Communities:
                return <CommunitiesPage />;
            case Page.Reels:
                return <ReelsPage 
                    reels={reels} 
                    onPostComment={handlePostReelComment}
                    onLikeComment={handleLikeReelComment}
                    onShareReel={handleShareReel}
                    conversations={allKnownConversations}
                    onLikeReel={handleLikeReel}
                    onDislikeReel={handleDislikeReel}
                    onToggleBookmark={handleToggleReelBookmark}
                />;
            case Page.CreatorStudio:
                return <CreatorStudioPage />;
            case Page.Settings:
                return <SettingsPage settings={appSettings} onUpdateSettings={setAppSettings} openDisplayModal={() => setIsDisplayModalOpen(true)} onUpdateProfileDetails={handleUpdateProfileDetails} />;
            case Page.HelpCenter:
                return <HelpCenterPage />;
            case Page.Lists:
                return <ListsPage />;
            default:
                return <HomePage 
                    tweets={filteredTweetsForYou}
                    moments={moments}
                    otherUsers={otherUsers}
                    userStories={userStories}
                    onStoryClick={(index) => setStoryViewerState({ stories: userStories, initialUserIndex: index })}
                    onOpenCreator={(mode) => {setIsCreatorOpen(true); setCreatorMode(mode)}}
                    onJoinSpace={setActiveSpace}
                    onPostTweet={handlePostTweet}
                    onFollowToggle={handleFollowToggle}
                    {...commonTweetCardProps}
                />;
        }
    }
    
    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className={`min-h-screen bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg text-light-text dark:text-white dim:text-dim-text transition-colors duration-300`}>
             <div className="fixed inset-0 -z-10 bg-aurora from-blue-300 via-purple-300 to-pink-300 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 bg-[size:400%_400%] animate-aurora" />
             <Header 
                currentUser={currentUser}
                currentPage={currentPage}
                setCurrentPage={(page) => { setUserListModal(null); setCurrentPage(page); }}
                notificationCount={mockNotifications.length}
                onOpenCreator={(mode) => { setIsCreatorOpen(true); setCreatorMode(mode); }}
                openSearchModal={() => setIsSearchModalOpen(true)}
                onLogout={handleLogout}
                openDisplayModal={() => setIsDisplayModalOpen(true)}
                onOpenDrawer={() => setIsMobileDrawerOpen(true)}
            />
            <div className="container mx-auto flex justify-center max-w-[1300px]">
                <Sidebar 
                    currentPage={currentPage}
                    setCurrentPage={(page) => { setUserListModal(null); setCurrentPage(page); }}
                    activeChatCount={allKnownConversations.reduce((sum, chat) => sum + chat.unreadCount, 0)}
                    onOpenCreator={(mode) => { setIsCreatorOpen(true); setCreatorMode(mode); }}
                />
                <main className="flex-1 min-w-0 w-full max-w-[600px] border-x border-light-border/50 dark:border-twitter-border/50 dim:border-dim-border/50 pb-16 sm:pb-0">
                   <AnimatePresence mode="wait">
                        {mainContent()}
                    </AnimatePresence>
                </main>
                <RightSidebar 
                    onViewProfile={(user) => setCurrentPage(Page.Profile)}
                    onFollowToggle={handleFollowToggle}
                    currentUser={currentUser}
                    otherUsers={otherUsers}
                    openAiAssistant={() => setIsAiAssistantOpen(true)}
                />

                <BottomNav 
                    currentPage={currentPage}
                    setCurrentPage={(page) => { 
                        if (page === Page.Explore) {
                            setIsMobileExploreOpen(true);
                        } else {
                            setUserListModal(null); 
                            setCurrentPage(page); 
                        }
                    }}
                    currentUser={currentUser}
                    activeChatCount={allKnownConversations.reduce((sum, chat) => sum + chat.unreadCount, 0)}
                    notificationCount={mockNotifications.length}
                    onOpenCreator={(mode) => { setIsCreatorOpen(true); setCreatorMode(mode); }}
                />
            </div>
            
            <AnimatePresence>
                {isDisplayModalOpen && <DisplayModal onClose={() => setIsDisplayModalOpen(false)} currentTheme={theme} setTheme={setTheme} />}
                {isSearchModalOpen && <SearchModal onClose={() => setIsSearchModalOpen(false)} onImageClick={(images, startIndex) => {setIsSearchModalOpen(false); setLightboxState({images, startIndex})}} onViewProfile={(user) => {setIsSearchModalOpen(false); setCurrentPage(Page.Profile)}} onGrok={(tweet) => {setIsSearchModalOpen(false); setGrokTweet(tweet)}} onTranslateTweet={handleTranslateTweet} onPinTweet={handlePinTweet} onFeatureTweet={handleFeatureTweet} onOpenChat={handleOpenChat} onLikeTweet={handleLikeTweet} onRetweet={handleRetweet} onDeleteTweet={handleDeleteTweet} liveReactions={liveReactions} appSettings={appSettings} currentUser={currentUser} />}
                {lightboxState && <Lightbox images={lightboxState.images} startIndex={lightboxState.startIndex} onClose={() => setLightboxState(null)} />}
                {replyingToTweet && <ReplyModal tweet={replyingToTweet} currentUser={currentUser} onClose={() => setReplyingToTweet(null)} onPostReply={(reply) => {handlePostTweet({ content: reply, isBookmarked: false }); setReplyingToTweet(null); }} />}
                {quotingTweet && <QuoteTweetModal tweet={quotingTweet} currentUser={currentUser} onClose={() => setQuotingTweet(null)} onPostTweet={(tweet) => {handlePostTweet(tweet); setQuotingTweet(null);}} />}
                {editingTweet && <EditTweetModal tweet={editingTweet} onClose={() => setEditingTweet(null)} onSave={(id, content) => {setTweets(prev => prev.map(t => t.id === id ? {...t, content, isEdited: true} : t)); setEditingTweet(null); showToast('Your Post has been updated.'); }} />}
                {storyViewerState && <StoryViewer {...storyViewerState} allUsers={allUsers} onClose={() => setStoryViewerState(null)} showToast={showToast} />}
                {viewingHighlight && <HighlightViewerModal highlight={viewingHighlight} onClose={() => setViewingHighlight(null)} />}
                {userListModal && <UserListModal {...userListModal} allUsers={allUsers} currentUser={currentUser} onClose={() => setUserListModal(null)} onFollowToggle={handleFollowToggle} onViewProfile={(user) => {setUserListModal(null); setCurrentPage(Page.Profile)}} onRemoveFollower={handleRemoveFollower} />}
                {isCreatorOpen && <CreatorFlowModal initialMode={creatorMode} allUsers={allUsers} onClose={() => setIsCreatorOpen(false)} onPostTweet={handlePostTweet} onPostStory={handlePostStory} onPostReel={handlePostReel} onPostMoment={handlePostMoment} />}
                {grokTweet && <GrokAnalysisModal tweet={grokTweet} onClose={() => setGrokTweet(null)} onTranslateTweet={handleTranslateTweet} onPinTweet={handlePinTweet} onOpenChat={handleOpenChat} onLikeTweet={handleLikeTweet} onRetweet={handleRetweet} onDeleteTweet={handleDeleteTweet} liveReactions={liveReactions} onFeatureTweet={handleFeatureTweet} appSettings={appSettings} />}
                {isCreateHighlightModalOpen && <CreateHighlightModal onClose={() => setIsCreateHighlightModalOpen(false)} onCreate={handleCreateHighlight} userStories={userStories.find(us => us.user.id === currentUser.id)?.stories || []} />}
                {isAiAssistantOpen && <AiAssistantModal onClose={() => setIsAiAssistantOpen(false)} />}
                {isAiSummaryOpen && <AiSummaryModal user={isAiSummaryOpen.user} tweets={isAiSummaryOpen.tweets} onClose={() => setIsAiSummaryOpen(null)} />}
                {isEditProfileOpen && <EditProfileModal user={currentUser} onClose={() => setIsEditProfileOpen(false)} onSave={(updatedUser) => { setCurrentUser(updatedUser); setIsEditProfileOpen(false); showToast('Profile updated!'); }} />}
                {isMobileDrawerOpen && <MobileDrawer user={currentUser} onClose={() => setIsMobileDrawerOpen(false)} onNavigate={(page) => {setCurrentPage(page); setUserListModal(null);}} notificationCount={mockNotifications.length} />}
                {isMobileExploreOpen && <MobileExploreDrawer onClose={() => setIsMobileExploreOpen(false)} />}
                {toast && <Toast key={toast.id} {...toast} onClose={() => setToast(null)} />}
                {activeSpace && <SpacesPlayer space={activeSpace} onClose={() => setActiveSpace(null)} onListenAlong={setListenAlongSpace} />}
                {listenAlongSpace && <ListenAlongModal space={listenAlongSpace} onClose={() => setListenAlongSpace(null)} />}
                {incomingCall && <IncomingCallModal call={incomingCall} onAccept={() => { setActiveCall({...incomingCall, status: 'active'}); setIncomingCall(null); }} onDecline={() => setIncomingCall(null)} onReplyWithMessage={() => { setIncomingCall(null); showToast("Replied via message."); }} />}
                {activeCall && activeCall.status !== 'minimized' && <CallView call={activeCall} onEndCall={() => setActiveCall(null)} onMinimize={() => setActiveCall(c => c ? {...c, status: 'minimized'} : null)} onToggleMic={() => setActiveCall(c => c ? {...c, isMicMuted: !c.isMicMuted} : null)} onToggleCamera={() => setActiveCall(c => c ? {...c, isCameraOff: !c.isCameraOff} : null)} onSendReaction={(emoji) => setCallReactions(prev => [...prev, {id: Date.now(), emoji}])} reactions={callReactions} setReactions={setCallReactions} />}
                {activeCall && activeCall.status === 'minimized' && <ActiveCallBubble call={activeCall} onMaximize={() => setActiveCall(c => c ? {...c, status: 'active'} : null)} onEndCall={() => setActiveCall(null)} />}
            </AnimatePresence>

             <FloatingChatManager 
                chats={activeChats}
                allMessages={allMessages}
                reels={reels}
                onCloseChat={(id) => setActiveChats(prev => prev.filter(c => c.id !== id))}
                onFocusChat={(user) => {
                    const chat = activeChats.find(c => c.participant.id === user.id);
                    if (chat) setActiveChats(prev => [...prev.filter(c => c.id !== chat.id), chat]);
                }}
                onNavigateToMessages={() => setCurrentPage(Page.Messages)}
                onSendMessage={(convoId, content) => {
                    const newMessage: Message = {
                        id: `msg-${Date.now()}`,
                        senderId: currentUser.id,
                        timestamp: new Date().toISOString(),
                        isRead: true, 
                        ...content
                    } as Message;
                    setAllMessages(prev => ({...prev, [convoId]: [...(prev[convoId] || []), newMessage]}));
                    
                    const updateLastMessage = (c: Conversation) => c.id === convoId ? { ...c, lastMessage: newMessage } : c;
                    setAllKnownConversations(prev => prev.map(updateLastMessage));
                    setActiveChats(prev => prev.map(updateLastMessage));
                }}
                onEditMessage={(convoId, msgId, newText) => {
                    setAllMessages(prev => ({ ...prev, [convoId]: prev[convoId].map(m => m.id === msgId && m.type === 'text' ? {...m, text: newText, isEdited: true} : m) }));
                    showToast('Message edited');
                }}
                onDeleteMessage={(convoId, msgId) => {
                    setAllMessages(prev => ({ ...prev, [convoId]: prev[convoId].filter(m => m.id !== msgId) }));
                    showToast('Message deleted');
                }}
                onAddReaction={(convoId, msgId, emoji) => showToast('Reaction added')}
                onPinMessage={(convoId, msgId) => {
                    setAllMessages(prev => {
                        const newMessages = prev[convoId].map(m => {
                            if (m.id === msgId) return { ...m, isPinned: !m.isPinned };
                            if (m.isPinned) return { ...m, isPinned: false };
                            return m;
                        });
                        return { ...prev, [convoId]: newMessages };
                    });
                    showToast('Message pin updated');
                }}
                onStartVideoCall={(user) => setActiveCall({ user, type: 'video', status: 'outgoing' })}
                onStartAudioCall={(user) => setActiveCall({ user, type: 'audio', status: 'outgoing' })}
                handleUpdateChatTheme={(convoId, theme) => {
                    const updateTheme = (c: Conversation) => c.id === convoId ? {...c, chatTheme: theme} : c;
                    setActiveChats(prev => prev.map(updateTheme));
                    setAllKnownConversations(prev => prev.map(updateTheme));
                    showToast(`Theme changed!`);
                }}
                onAiAction={handleAiChatAction}
                aiSuggestedReply={aiSuggestedReply}
                onSuggestionUsed={() => setAiSuggestedReply(null)}
            />
        </div>
    );
};

export default App;