
import React, { useState, useEffect, useCallback } from 'react';
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
import UserListPage from './pages/UserListPage';
import DisplayModal from './components/DisplayModal';
import Lightbox from './components/Lightbox';
import SearchModal from './components/SearchModal';
import ReplyModal from './components/ReplyModal';
import FloatingChatManager from './components/FloatingChatManager';
import Toast from './components/Toast';
import StoryViewer from './components/StoryViewer';
import BottomNav from './components/BottomNav';
import ReelCommentsPanel from './components/ReelCommentsPanel';
import VideoCallView from './components/VideoCallView';
import InAppNotification from './components/InAppNotification';
import EditTweetModal from './components/EditTweetModal';
import QuoteTweetModal from './components/QuoteTweetModal';
import SpacesPlayer from './components/SpacesPlayer';
import IncomingCallModal from './components/IncomingCallModal';
import AudioCallView from './components/AudioCallView';
import ShareReelModal from './components/ShareReelModal';
import AiAssistantModal from './components/AiAssistantModal';
import CreatorFlowModal from './components/CreatorFlowModal';
import MobileDrawer from './components/MobileDrawer';
import ReelOptionsModal from './components/ReelOptionsModal';
import TopRightMenu from './components/TopRightMenu';
import GrokAnalysisModal from './components/GrokAnalysisModal';
import { Page, Theme, Tweet, User, AppSettings, Conversation, Reel, Message, Space, ChatTheme, Highlight, UserStory, Call, Story, ReelComment } from './types';
import { mockUser, otherUsers as initialOtherUsers, mockTweets, initialUserStories, mockConversations, mockMessages, baseTweets, mockHighlights, mockNotifications, mockReels } from './data/mockData';
import { AnimatePresence, motion } from 'framer-motion';

// FIX: Added optional text property to image and reel-share message content types.
type MessageContent = | { type: 'text'; text: string } | { type: 'voice'; audioUrl: string; duration: number } | { type: 'gif'; gifUrl: string } | { type: 'wave' } | { type: 'image', imageUrl: string, text?: string } | { type: 'reel-share', reelId: string, text?: string };

const initialSettings: AppSettings = {
  privacyAndSafety: {
    protectPosts: false,
    photoTagging: 'everyone',
    dmRequests: 'everyone',
  },
  notifications: {
    mutedWords: [],
  },
  accessibilityDisplayAndLanguages: {
    reduceMotion: false,
    videoAutoplay: 'on-cellular-wifi',
  }
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [theme, setTheme] = useState<Theme>('dark');
  const [tweets, setTweets] = useState<Tweet[]>(mockTweets);
  const [reels, setReels] = useState<Reel[]>(mockReels);
  const [currentUser, setCurrentUser] = useState<User>(mockUser);
  const [otherUsers, setOtherUsers] = useState<User[]>(initialOtherUsers);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [userStories, setUserStories] = useState<UserStory[]>(initialUserStories);
  
  // Modal states
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [replyingToTweet, setReplyingToTweet] = useState<Tweet | null>(null);
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
  const [quotingTweet, setQuotingTweet] = useState<Tweet | null>(null);
  const [storyViewerState, setStoryViewerState] = useState<{ stories: UserStory[] | Highlight[], initialIndex: number, isHighlight?: boolean } | null>(null);
  const [viewingReelComments, setViewingReelComments] = useState<Reel | null>(null);
  const [sharingReel, setSharingReel] = useState<Reel | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isCreatorFlowOpen, setIsCreatorFlowOpen] = useState(false);
  const [creatorInitialMode, setCreatorInitialMode] = useState<'select' | 'story' | 'reel' | 'post'>('select');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [reelOptions, setReelOptions] = useState<Reel | null>(null);
  const [isTopRightMenuOpen, setIsTopRightMenuOpen] = useState(false);
  const [grokkingTweet, setGrokkingTweet] = useState<Tweet | null>(null);

  // Profile/User List states
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userListState, setUserListState] = useState<{ user: User, type: 'followers' | 'following' } | null>(null);

  // Floating chats
  const [openChats, setOpenChats] = useState<Conversation[]>([]);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [focusedChatId, setFocusedChatId] = useState<string | null>(null);
  
  // Toast & Notifications
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });
  const [inAppNotification, setInAppNotification] = useState<{ conversation: Conversation, message: Message } | null>(null);

  // Live updates
  const [newTweetsBuffer, setNewTweetsBuffer] = useState<Tweet[]>([]);
  const [newTweetsCount, setNewTweetsCount] = useState(0);
  const [liveReactions, setLiveReactions] = useState<{ tweetId: string, type: 'like' | 'retweet', id: number }[]>([]);

  // Advanced Features
  const [activeSpace, setActiveSpace] = useState<Space | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);


  useEffect(() => {
    document.documentElement.className = theme;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
        if (theme === 'light') themeColorMeta.setAttribute('content', '#FFFFFF');
        if (theme === 'dim') themeColorMeta.setAttribute('content', '#15202B');
        if (theme === 'dark') themeColorMeta.setAttribute('content', '#15202B');
    }
  }, [theme]);
  
  // Simulate receiving new tweets, live reactions & incoming calls
  useEffect(() => {
    const tweetInterval = setInterval(() => {
        const randomTweet = { ...baseTweets[Math.floor(Math.random() * baseTweets.length)] };
        const newTweet: Tweet = {
            ...randomTweet,
            id: `t-live-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: otherUsers[Math.floor(Math.random() * otherUsers.length)]
        };
        setNewTweetsBuffer(prev => [newTweet, ...prev]);
        setNewTweetsCount(prev => prev + 1);
    }, 15000); // New tweet every 15 seconds
    
    const reactionInterval = setInterval(() => {
        if (tweets.length === 0) return;
        const randomTweetId = tweets[Math.floor(Math.random() * tweets.length)].id;
        const reactionType = Math.random() > 0.5 ? 'like' : 'retweet';
        
        if (!settings.accessibilityDisplayAndLanguages.reduceMotion) {
            setLiveReactions(prev => [...prev, { tweetId: randomTweetId, type: reactionType, id: Date.now() }]);
            // Clean up old reactions
            setTimeout(() => setLiveReactions(prev => prev.slice(1)), 2000);
        }
    }, 3000);

    const callTimeout = setTimeout(() => {
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        setActiveCall({ user: randomUser, type: 'video', status: 'incoming' });
    }, 25000); // Incoming call after 25 seconds

    return () => {
      clearInterval(tweetInterval);
      clearInterval(reactionInterval);
      clearTimeout(callTimeout);
    }
  }, [tweets, settings.accessibilityDisplayAndLanguages.reduceMotion]);

  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast({ message: '', isVisible: false }), 3000);
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const handleOpenCreator = (mode: 'select' | 'story' | 'reel' | 'post' = 'select') => {
    setCreatorInitialMode(mode);
    setIsCreatorFlowOpen(true);
  };

  const handlePostTweet = useCallback((tweetContent: Partial<Tweet>) => {
    const newTweet: Tweet = {
      id: `t-${Date.now()}`,
      user: currentUser,
      content: tweetContent.content || '',
      timestamp: new Date().toISOString(),
      replyCount: 0,
      retweetCount: 0,
      likeCount: 0,
      shareCount: 0,
      viewCount: 0,
      mediaUrls: tweetContent.mediaUrls,
      isVoiceTweet: tweetContent.isVoiceTweet,
      audioUrl: tweetContent.audioUrl,
      quotedTweet: tweetContent.quotedTweet,
    };
    setTweets(prev => [newTweet, ...prev]);
    setQuotingTweet(null);
    setIsCreatorFlowOpen(false);
  }, [currentUser]);

  const handlePostStory = (newStory: Omit<Story, 'id' | 'timestamp'>) => {
    setUserStories(prev => {
        const myStoriesIndex = prev.findIndex(us => us.user.id === mockUser.id);
        const storyToAdd: Story = {
            ...newStory,
            id: `s-new-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };

        let updatedStories = [...prev];

        if (myStoriesIndex > -1) {
            // Add to existing story array
            const userStory = updatedStories[myStoriesIndex];
            userStory.stories.push(storyToAdd);
            userStory.hasUnseen = true; 
            // Move user's stories to the front
            updatedStories.splice(myStoriesIndex, 1);
            updatedStories.unshift(userStory);
        } else {
            // If user has no stories yet, create a new entry
            const newUserStory: UserStory = {
                user: mockUser,
                hasUnseen: true,
                stories: [storyToAdd],
            };
            updatedStories.unshift(newUserStory);
        }
        return updatedStories;
    });
    setIsCreatorFlowOpen(false);
    showToast('Story posted!');
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
      setIsCreatorFlowOpen(false);
      showToast('Reel posted!');
  };


  const handleShowNewTweets = () => {
    setTweets(prev => [...newTweetsBuffer, ...prev]);
    setNewTweetsBuffer([]);
    setNewTweetsCount(0);
  };

  const handleEditTweet = useCallback((tweetId: string, newContent: string) => {
    setTweets(prev => prev.map(t => 
      t.id === tweetId 
        ? { ...t, content: newContent, isEdited: true } 
        : t
    ));
    setEditingTweet(null);
    showToast('Your Post was updated.');
  }, []);
  
  const handlePostReply = useCallback((replyContent: string, originalTweet: Tweet) => {
    // This just creates a new tweet for simplicity
    const newTweet: Tweet = {
      id: `t-reply-${Date.now()}`,
      user: currentUser,
      content: replyContent,
      timestamp: new Date().toISOString(),
      replyCount: 0,
      retweetCount: 0,
      likeCount: 0,
      shareCount: 0,
      viewCount: 0,
    };
    setTweets(prev => [newTweet, ...prev]);
    setReplyingToTweet(null);
    showToast('Your reply was sent.');
  }, [currentUser]);

  const handleToggleBookmark = useCallback((tweetId: string) => {
    let bookmarked = false;
    setTweets(prev => prev.map(t => {
        if (t.id === tweetId) {
            bookmarked = !t.isBookmarked;
            return { ...t, isBookmarked: bookmarked };
        }
        return t;
    }));
    showToast(bookmarked ? 'Added to your Bookmarks' : 'Removed from your Bookmarks');
  }, []);

  const handleVote = useCallback((tweetId: string, optionId: string) => {
    setTweets(prev => prev.map(t => {
      if (t.id === tweetId && t.poll && !t.votedOnPollId) {
        return {
          ...t,
          votedOnPollId: optionId,
          poll: {
            ...t.poll,
            totalVotes: t.poll.totalVotes + 1,
            options: t.poll.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
          }
        };
      }
      return t;
    }));
  }, []);
  
  const handleFollowToggle = useCallback((userId: string) => {
    const isFollowing = currentUser.followingIds.includes(userId);
    
    // Show toast before state update for immediate feedback
    if (isFollowing) {
        showToast(`Unfollowed @${otherUsers.find(u => u.id === userId)?.username || 'user'}`);
    } else {
        showToast(`Followed @${otherUsers.find(u => u.id === userId)?.username || 'user'}`);
    }

    setCurrentUser(prev => ({
      ...prev,
      followingIds: isFollowing ? prev.followingIds.filter(id => id !== userId) : [...prev.followingIds, userId],
      followingCount: isFollowing ? prev.followingCount - 1 : prev.followingCount + 1,
    }));

    setOtherUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          followerCount: isFollowing ? u.followerCount - 1 : u.followerCount + 1
        }
      }
      return u;
    }))
  }, [currentUser, otherUsers]);

  const handleViewProfile = (user: User) => {
    setProfileUser(user);
    setCurrentPage(Page.Profile);
  };
  
  const handleViewUserList = (user: User, type: 'followers' | 'following') => {
    setUserListState({ user, type });
    setCurrentPage(Page.UserList);
  };

  const handleOpenChat = (user: User) => {
    const existingChatIndex = openChats.findIndex(c => c.participant.id === user.id);
  
    if (existingChatIndex > -1) {
      // If chat exists, move it to the end (top of the stack)
      const existingChat = openChats[existingChatIndex];
      const newChats = [...openChats];
      newChats.splice(existingChatIndex, 1);
      newChats.push(existingChat);
      setOpenChats(newChats);
      setFocusedChatId(existingChat.id);
    } else {
      // If new chat, find its data and add it
      const chatData = mockConversations.find(c => c.participant.id === user.id) || 
        // Create a new conversation if it doesn't exist in mock data
        { 
          id: `c-new-${user.id}`, 
          participant: user, 
          lastMessage: { id: 'm-start', senderId: '', type: 'text', text: 'Start of your conversation', timestamp: new Date().toISOString(), isRead: true}, 
          unreadCount: 0,
          chatTheme: 'default-blue'
        };
      
      const newChat: Conversation = { ...chatData };
      setOpenChats(prev => [...prev, newChat]);
      setFocusedChatId(newChat.id);
    }
  };

  const handleCloseChat = (conversationId: string) => {
    setOpenChats(prev => prev.filter(c => c.id !== conversationId));
  };
  
  const handleFocusChat = (user: User) => {
    const chat = openChats.find(c => c.participant.id === user.id);
    if (chat) {
        setFocusedChatId(chat.id);
        handleOpenChat(user); // brings to front
    }
  };
  
  const handleNavigateToMessages = () => {
      setCurrentPage(Page.Messages);
      setOpenChats([]);
  };

  const handleSendMessage = (conversationId: string, content: MessageContent, replyTo?: Message) => {
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: mockUser.id,
      timestamp: new Date().toISOString(),
      isRead: true,
      replyTo,
      ...content,
    };
    
    setAllMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Simulate a reply to trigger notification
    setTimeout(() => {
        const conversation = openChats.find(c => c.id === conversationId) || mockConversations.find(c => c.id === conversationId);
        if (!conversation) return;
        
        if (settings.privacyAndSafety.dmRequests === 'following' && !currentUser.followingIds.includes(conversation.participant.id)) {
            // DM requests are off for non-followers
            return;
        }

        const replyMessage: Message = {
            id: `m-reply-${Date.now()}`,
            senderId: conversation.participant.id,
            type: 'text',
            text: 'This is a simulated reply!',
            timestamp: new Date().toISOString(),
            isRead: false,
        };
        
        setAllMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), replyMessage],
        }));

        if (conversationId !== focusedChatId) {
            setInAppNotification({ conversation, message: replyMessage });
            setTimeout(() => setInAppNotification(null), 5000);
        }

    }, 2000);
  };

  const handleEditMessage = (conversationId: string, messageId: string, newText: string) => {
      setAllMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).map(msg => 
              msg.id === messageId 
                ? { ...msg, text: newText, isEdited: true, type: 'text' } // Ensure type is text
                : msg
          ),
      }));
  };

  const handleDeleteMessage = (conversationId: string, messageId: string) => {
      setAllMessages(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || []).filter(msg => msg.id !== messageId),
      }));
  };

  const handleAddReaction = (conversationId: string, messageId: string, emoji: string) => {
    setAllMessages(prevAllMessages => {
        const messages = prevAllMessages[conversationId] || [];
        const newMessages = messages.map(msg => {
            if (msg.id === messageId) {
                const newReactions = msg.reactions ? JSON.parse(JSON.stringify(msg.reactions)) : [];
                const reactionIndex = newReactions.findIndex((r: any) => r.emoji === emoji);
                if (reactionIndex > -1) {
                    const userReacted = newReactions[reactionIndex].users.includes(mockUser.id);
                    if (userReacted) {
                        newReactions[reactionIndex].users = newReactions[reactionIndex].users.filter((id: string) => id !== mockUser.id);
                    } else {
                        newReactions[reactionIndex].users.push(mockUser.id);
                    }
                } else {
                    newReactions.push({ emoji, users: [mockUser.id] });
                }
                return { ...msg, reactions: newReactions.filter((r: any) => r.users.length > 0) };
            }
            return msg;
        });
        return { ...prevAllMessages, [conversationId]: newMessages };
    });
  };

  const handlePinMessage = (conversationId: string, messageId: string) => {
      setAllMessages(prev => {
          const newMessages = (prev[conversationId] || []).map(msg => {
              // Unpin any previously pinned message
              if (msg.isPinned) msg.isPinned = false;
              // Pin the new one
              if (msg.id === messageId) msg.isPinned = !msg.isPinned; // toggle pin
              return msg;
          });
          return { ...prev, [conversationId]: newMessages };
      });
  };

  const handleUpdateChatTheme = (conversationId: string, theme: ChatTheme) => {
    setOpenChats(prev => prev.map(c => c.id === conversationId ? { ...c, chatTheme: theme } : c));
  };

  const handleJoinSpace = (space: Space) => setActiveSpace(space);
  const handleLeaveSpace = () => setActiveSpace(null);
  
  const handleStoryClick = (stories: UserStory[] | Highlight[], index: number, isHighlight: boolean = false) => {
      setStoryViewerState({ stories, initialIndex: index, isHighlight });
  };
  
  const handleStartVideoCall = (user: User) => setActiveCall({ user, type: 'video', status: 'outgoing' });
  const handleStartAudioCall = (user: User) => setActiveCall({ user, type: 'audio', status: 'outgoing' });
  const handleEndCall = () => setActiveCall(null);
  const handleAcceptCall = (call: Call) => setActiveCall({ ...call, status: 'active' });
  const handleDeclineCall = () => setActiveCall(null);
  const handleReplyWithMessage = (call: Call) => {
    setActiveCall(null);
    handleOpenChat(call.user);
    showToast(`Call declined. Opening message with ${call.user.displayName}.`);
  };

  // Reel Handlers
  const handleLikeReel = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const isLiked = !r.isLiked;
        return { 
          ...r, 
          isLiked, 
          likeCount: isLiked ? r.likeCount + 1 : r.likeCount - 1,
          isDisliked: isLiked ? false : r.isDisliked, // remove dislike if liking
        };
      }
      return r;
    }));
  };

  const handleDislikeReel = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const isDisliked = !r.isDisliked;
        // If it was liked, unlike it
        const wasLiked = r.isLiked;
        return { 
          ...r, 
          isDisliked, 
          isLiked: isDisliked ? false : r.isLiked,
          likeCount: wasLiked && isDisliked ? r.likeCount - 1 : r.likeCount
        };
      }
      return r;
    }));
  };

  const handleBookmarkReel = (reelId: string) => {
    setReels(prev => prev.map(r => r.id === reelId ? { ...r, isBookmarked: !r.isBookmarked } : r));
    showToast('Reel saved!');
  };

  const handlePostReelComment = (reelId: string, text: string, replyTo?: ReelComment) => {
    const newComment: ReelComment = {
      id: `rc-new-${Date.now()}`,
      user: currentUser,
      text,
      timestamp: 'Now',
      likeCount: 0,
      isLiked: false,
      replyToUsername: replyTo?.user.username,
    };
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const updatedReel = {
          ...r,
          comments: [newComment, ...r.comments],
          commentCount: r.commentCount + 1
        };
        // Also update the viewingReelComments state if it's open
        if (viewingReelComments?.id === reelId) {
          setViewingReelComments(updatedReel);
        }
        return updatedReel;
      }
      return r;
    }));
  };

  const handleShareReelAsMessage = (reelId: string, conversationIds: string[], message?: string) => {
    conversationIds.forEach(conversationId => {
        handleSendMessage(conversationId, { type: 'reel-share', reelId, text: message });
        const targetUser = mockConversations.find(c => c.id === conversationId)?.participant;
        if (targetUser) {
            handleOpenChat(targetUser);
        }
    });
    setSharingReel(null);
    showToast(`Reel sent to ${conversationIds.length} chat${conversationIds.length > 1 ? 's' : ''}!`);
  };
  
  const handleDrawerNavigate = (page: Page) => {
    if (page === Page.Profile) {
        setProfileUser(currentUser);
    }
    setCurrentPage(page);
    setIsMobileDrawerOpen(false);
  };
  
  const handleTopRightMenuNavigate = (page: Page) => {
    if (page === Page.Profile) {
        setProfileUser(currentUser);
    }
    setCurrentPage(page);
    setIsTopRightMenuOpen(false);
  };

  const handleGrok = (tweet: Tweet) => {
    setGrokkingTweet(tweet);
  };


  const renderPage = () => {
    const protectedTweets = settings.privacyAndSafety.protectPosts 
        ? tweets.filter(t => currentUser.followingIds.includes(t.user.id) || t.user.id === currentUser.id)
        : tweets;

    const filteredTweets = protectedTweets.filter(t => 
        !settings.notifications.mutedWords.some(word => t.content.toLowerCase().includes(word.toLowerCase()))
    );

    if (userListState && currentPage === Page.UserList) {
      return <UserListPage 
        user={userListState.user}
        listType={userListState.type}
        allUsers={[currentUser, ...otherUsers]}
        currentUser={currentUser}
        onBack={() => { setCurrentPage(Page.Profile); setUserListState(null); }}
        onFollowToggle={handleFollowToggle}
        onViewProfile={(user) => { setUserListState(null); handleViewProfile(user); }}
      />;
    }
    if (profileUser && currentPage === Page.Profile) {
      return <ProfilePage 
        user={profileUser}
        currentUser={currentUser}
        onImageClick={setLightboxImageUrl}
        onBack={() => { setCurrentPage(Page.Home); setProfileUser(null); }}
        onViewProfile={handleViewProfile}
        onFollowToggle={handleFollowToggle}
        onViewUserList={handleViewUserList}
        onOpenChat={handleOpenChat}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onQuote={setQuotingTweet}
        onEdit={setEditingTweet}
        onHighlightClick={(highlights, index) => handleStoryClick(highlights, index, true)}
        tweets={filteredTweets.filter(t => t.user.id === profileUser.id)}
        onGrok={handleGrok}
      />;
    }
    const unreadNotifications = mockNotifications.length;

    switch(currentPage) {
      case Page.Home: return <HomePage 
        tweets={filteredTweets} 
        currentUser={currentUser}
        userStories={userStories}
        onPostTweet={handlePostTweet}
        onImageClick={setLightboxImageUrl}
        onViewProfile={handleViewProfile}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onStoryClick={(index) => handleStoryClick(userStories, index)}
        onQuote={setQuotingTweet}
        onEdit={setEditingTweet}
        newTweetsCount={newTweetsCount}
        onShowNewTweets={handleShowNewTweets}
        onJoinSpace={handleJoinSpace}
        liveReactions={liveReactions}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        notificationCount={unreadNotifications}
        setCurrentPage={setCurrentPage}
        onOpenTopRightMenu={() => setIsTopRightMenuOpen(true)}
        onOpenCreator={handleOpenCreator}
        onGrok={handleGrok}
      />;
      case Page.Explore: return <ExplorePage openSearchModal={() => setIsSearchModalOpen(true)} onImageClick={setLightboxImageUrl} />;
      case Page.Notifications: return <NotificationsPage />;
      case Page.Messages: return <MessagesPage openChat={handleOpenChat} />;
      case Page.Bookmarks: return <BookmarksPage 
        tweets={filteredTweets}
        currentUser={currentUser}
        onImageClick={setLightboxImageUrl}
        onViewProfile={handleViewProfile}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onQuote={setQuotingTweet}
        onEdit={setEditingTweet}
        liveReactions={liveReactions}
        onGrok={handleGrok}
      />;
      case Page.Communities: return <CommunitiesPage />;
      case Page.Reels: return <ReelsPage 
        reels={reels}
        currentUser={currentUser}
        onOpenComments={setViewingReelComments} 
        settings={settings}
        onLikeReel={handleLikeReel}
        onDislikeReel={handleDislikeReel}
        onBookmarkReel={handleBookmarkReel}
        onShareReel={setSharingReel}
        onFollowToggle={handleFollowToggle}
        onOpenOptions={setReelOptions}
        />;
      case Page.CreatorStudio: return <CreatorStudioPage />;
      case Page.Settings: return <SettingsPage settings={settings} onUpdateSettings={setSettings} openDisplayModal={() => setIsDisplayModalOpen(true)} />;
      case Page.HelpCenter: return <HelpCenterPage />;
      case Page.Profile: return <ProfilePage 
        user={currentUser} 
        currentUser={currentUser}
        onImageClick={setLightboxImageUrl}
        onBack={() => setCurrentPage(Page.Home)}
        onViewProfile={handleViewProfile}
        onFollowToggle={handleFollowToggle}
        onViewUserList={handleViewUserList}
        onOpenChat={handleOpenChat}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onQuote={setQuotingTweet}
        onEdit={setEditingTweet}
        onHighlightClick={(highlights, index) => handleStoryClick(highlights, index, true)}
        tweets={filteredTweets.filter(t => t.user.id === currentUser.id)}
        onGrok={handleGrok}
       />;
      default: return <HomePage 
        tweets={filteredTweets} 
        currentUser={currentUser}
        userStories={userStories}
        onPostTweet={handlePostTweet}
        onImageClick={setLightboxImageUrl}
        onViewProfile={handleViewProfile}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onStoryClick={(index) => handleStoryClick(userStories, index)}
        onQuote={setQuotingTweet}
        onEdit={setEditingTweet}
        newTweetsCount={newTweetsCount}
        onShowNewTweets={handleShowNewTweets}
        onJoinSpace={handleJoinSpace}
        liveReactions={liveReactions}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        notificationCount={unreadNotifications}
        setCurrentPage={setCurrentPage}
        onOpenTopRightMenu={() => setIsTopRightMenuOpen(true)}
        onOpenCreator={handleOpenCreator}
        onGrok={handleGrok}
      />;
    }
  };
  
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  const mainContent = renderPage();
  const unreadMessages = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const unreadNotifications = mockNotifications.length;

  return (
    <div className={theme}>
        <div className="bg-light-bg text-light-text dark:bg-twitter-dark dark:text-white dim:bg-dim-bg h-screen w-screen overflow-hidden">
            <div className="container mx-auto flex justify-center max-w-[1280px] h-full">
                <Sidebar 
                    currentPage={currentPage} 
                    setCurrentPage={(p) => {
                        if (p === Page.Profile) setProfileUser(currentUser);
                        setCurrentPage(p);
                    }}
                    onLogout={handleLogout} 
                    openDisplayModal={() => setIsDisplayModalOpen(true)}
                    activeChatCount={unreadMessages}
                    onOpenCreator={handleOpenCreator}
                />
                <main className="flex-1 min-w-0 border-x border-light-border dark:border-twitter-border dim:border-dim-border relative h-full overflow-y-auto no-scrollbar">
                    {mainContent}
                </main>
                <RightSidebar 
                    openSearchModal={() => setIsSearchModalOpen(true)} 
                    onViewProfile={handleViewProfile}
                    onFollowToggle={handleFollowToggle}
                    currentUser={currentUser}
                    otherUsers={otherUsers}
                    openAiAssistant={() => setIsAiAssistantOpen(true)}
                />
            </div>

            {/* Modals and Overlays */}
            <AnimatePresence>
                {viewingReelComments && (
                    <motion.div
                        className="fixed inset-0 z-40 sm:absolute sm:top-0 sm:right-0 sm:h-full sm:w-[350px]"
                        initial={{ x: '100%' }}
                        animate={{ x: '0%' }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                    >
                        <ReelCommentsPanel 
                            reel={viewingReelComments} 
                            onClose={() => setViewingReelComments(null)}
                            onPostComment={handlePostReelComment}
                         />
                    </motion.div>
                )}
                {isMobileDrawerOpen && <MobileDrawer user={currentUser} onClose={() => setIsMobileDrawerOpen(false)} onNavigate={handleDrawerNavigate} />}
                {isTopRightMenuOpen && <TopRightMenu onDisplayClick={() => {setIsDisplayModalOpen(true); setIsTopRightMenuOpen(false);}} setCurrentPage={handleTopRightMenuNavigate} closeMenu={() => setIsTopRightMenuOpen(false)} />}
                {isCreatorFlowOpen && <CreatorFlowModal initialMode={creatorInitialMode} onClose={() => setIsCreatorFlowOpen(false)} onPostTweet={handlePostTweet} onPostStory={handlePostStory} onPostReel={handlePostReel} />}
                {isAiAssistantOpen && <AiAssistantModal onClose={() => setIsAiAssistantOpen(false)} />}
                {sharingReel && <ShareReelModal reel={sharingReel} conversations={mockConversations} onClose={() => setSharingReel(null)} onShare={handleShareReelAsMessage} />}
                {isDisplayModalOpen && <DisplayModal onClose={() => setIsDisplayModalOpen(false)} currentTheme={theme} setTheme={setTheme} />}
                {lightboxImageUrl && <Lightbox imageUrl={lightboxImageUrl} onClose={() => setLightboxImageUrl(null)} />}
                {isSearchModalOpen && <SearchModal onClose={() => setIsSearchModalOpen(false)} onImageClick={setLightboxImageUrl} onViewProfile={handleViewProfile} onGrok={handleGrok} />}
                {replyingToTweet && <ReplyModal tweet={replyingToTweet} currentUser={currentUser} onClose={() => setReplyingToTweet(null)} onPostReply={handlePostReply} />}
                {editingTweet && <EditTweetModal tweet={editingTweet} onClose={() => setEditingTweet(null)} onSave={handleEditTweet} />}
                {quotingTweet && <QuoteTweetModal tweet={quotingTweet} currentUser={currentUser} onClose={() => setQuotingTweet(null)} onPostTweet={handlePostTweet} />}
                {storyViewerState && <StoryViewer stories={storyViewerState.stories} initialUserIndex={storyViewerState.initialIndex} onClose={() => setStoryViewerState(null)} showToast={showToast} isHighlight={storyViewerState.isHighlight} />}
                {reelOptions && <ReelOptionsModal reel={reelOptions} onClose={() => setReelOptions(null)} showToast={showToast} />}
                {grokkingTweet && <GrokAnalysisModal tweet={grokkingTweet} onClose={() => setGrokkingTweet(null)} />}
                
                {/* Call System */}
                {activeCall?.status === 'incoming' && <IncomingCallModal call={activeCall} onAccept={() => handleAcceptCall(activeCall)} onDecline={handleDeclineCall} onReplyWithMessage={() => handleReplyWithMessage(activeCall)} />}
                {activeCall?.status === 'active' && activeCall.type === 'video' && <VideoCallView user={activeCall.user} status="active" onEndCall={handleEndCall} />}
                {activeCall?.status === 'outgoing' && activeCall.type === 'video' && <VideoCallView user={activeCall.user} status="outgoing" onEndCall={handleEndCall} />}
                {activeCall?.status === 'active' && activeCall.type === 'audio' && <AudioCallView user={activeCall.user} status="active" onEndCall={handleEndCall} />}
                {activeCall?.status === 'outgoing' && activeCall.type === 'audio' && <AudioCallView user={activeCall.user} status="outgoing" onEndCall={handleEndCall} />}
            </AnimatePresence>


            {/* Floating UI */}
            <FloatingChatManager 
                chats={openChats}
                allMessages={allMessages}
                reels={reels}
                onCloseChat={handleCloseChat}
                onFocusChat={handleFocusChat}
                onNavigateToMessages={handleNavigateToMessages}
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onAddReaction={handleAddReaction}
                onPinMessage={handlePinMessage}
                onStartVideoCall={handleStartVideoCall}
                onStartAudioCall={handleStartAudioCall}
                onUpdateChatTheme={handleUpdateChatTheme}
            />
            
            <AnimatePresence>
                {activeSpace && <SpacesPlayer space={activeSpace} onClose={handleLeaveSpace} />}
            </AnimatePresence>

            <AnimatePresence>
                {inAppNotification && (
                    <InAppNotification
                        notification={inAppNotification}
                        onClose={() => setInAppNotification(null)}
                        onClick={() => {
                            handleFocusChat(inAppNotification.conversation.participant);
                            setInAppNotification(null);
                        }}
                    />
                )}
            </AnimatePresence>
            <Toast message={toast.message} isVisible={toast.isVisible} onClose={() => setToast(prev => ({...prev, isVisible: false}))} />
            <BottomNav 
                currentPage={currentPage}
                setCurrentPage={(p) => {
                    if (p === Page.Profile) setProfileUser(currentUser);
                    setCurrentPage(p);
                }}
                currentUser={currentUser}
                activeChatCount={unreadMessages}
                notificationCount={unreadNotifications}
                onOpenCreator={handleOpenCreator}
            />
        </div>
    </div>
  );
}

export default App;
