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
import MobileHeader from './components/MobileHeader';
import BottomNav from './components/BottomNav';
import ReelCommentsPanel from './components/ReelCommentsPanel';
import VideoCallView from './components/VideoCallView';
import InAppNotification from './components/InAppNotification';
import EditTweetModal from './components/EditTweetModal';
import QuoteTweetModal from './components/QuoteTweetModal';
import { Page, Theme, Tweet, User, AppSettings, Conversation, Reel, Message } from './types';
import { mockUser, otherUsers as initialOtherUsers, mockTweets, userStories, mockConversations, mockMessages } from './data/mockData';
import { AnimatePresence } from 'framer-motion';

type MessageContent = | { type: 'text'; text: string } | { type: 'voice'; audioUrl: string; duration: number } | { type: 'gif'; gifUrl: string } | { type: 'wave' };

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
  const [currentUser, setCurrentUser] = useState<User>(mockUser);
  const [otherUsers, setOtherUsers] = useState<User[]>(initialOtherUsers);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  
  // Modal states
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [replyingToTweet, setReplyingToTweet] = useState<Tweet | null>(null);
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
  const [quotingTweet, setQuotingTweet] = useState<Tweet | null>(null);
  const [storyViewerState, setStoryViewerState] = useState<{ stories: typeof userStories, index: number } | null>(null);
  const [viewingReelComments, setViewingReelComments] = useState<Reel | null>(null);
  const [videoCallUser, setVideoCallUser] = useState<User | null>(null);

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


  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  
  const showToast = (message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast({ message: '', isVisible: false }), 3000);
  };

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const handlePostTweet = useCallback((tweetContent: Partial<Tweet>) => {
    const newTweet: Tweet = {
      id: `t-${Date.now()}`,
      user: currentUser,
      content: tweetContent.content || '',
      timestamp: new Date().toISOString(),
      replyCount: 0,
      retweetCount: 0,
      likeCount: 0,
      viewCount: 0,
      isVoiceTweet: tweetContent.isVoiceTweet,
      audioUrl: tweetContent.audioUrl,
      quotedTweet: tweetContent.quotedTweet,
    };
    setTweets(prev => [newTweet, ...prev]);
    setQuotingTweet(null);
  }, [currentUser]);

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
      viewCount: 0,
    };
    setTweets(prev => [newTweet, ...prev]);
    setReplyingToTweet(null);
    showToast('Your reply was sent.');
  }, [currentUser]);

  const handleToggleBookmark = useCallback((tweetId: string) => {
    setTweets(prev => prev.map(t => t.id === tweetId ? { ...t, isBookmarked: !t.isBookmarked } : t));
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
  }, [currentUser]);

  const handleViewProfile = (user: User) => {
    setProfileUser(user);
    setCurrentPage(Page.Profile);
  };
  
  const handleViewUserList = (user: User, type: 'followers' | 'following') => {
    setUserListState({ user, type });
    setCurrentPage(Page.UserList);
  };

  const handleOpenChat = (user: User) => {
    const existingChat = openChats.find(c => c.participant.id === user.id);
    if (existingChat) {
       setOpenChats(prev => [...prev.filter(c => c.participant.id !== user.id), existingChat]);
       setFocusedChatId(existingChat.id);
    } else {
      const chatData = mockConversations.find(c => c.participant.id === user.id);
      if (!chatData) return;

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

  const renderPage = () => {
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
      />;
    }

    switch(currentPage) {
      case Page.Home: return <HomePage 
        tweets={tweets} 
        currentUser={currentUser}
        onPostTweet={handlePostTweet}
        onImageClick={setLightboxImageUrl}
        onViewProfile={handleViewProfile}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onStoryClick={(index) => setStoryViewerState({ stories: userStories, index })}
        onQuote={setQuotingTweet}
        onEdit={setEditingTweet}
      />;
      case Page.Explore: return <ExplorePage openSearchModal={() => setIsSearchModalOpen(true)} onImageClick={setLightboxImageUrl} />;
      case Page.Notifications: return <NotificationsPage />;
      case Page.Messages: return <MessagesPage openChat={handleOpenChat} />;
      case Page.Bookmarks: return <BookmarksPage 
        tweets={tweets}
        onImageClick={setLightboxImageUrl}
        onViewProfile={handleViewProfile}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onQuote={setQuotingTweet}
        onEdit={setEditingTweet}
      />;
      case Page.Communities: return <CommunitiesPage />;
      case Page.Reels: return <ReelsPage onOpenComments={setViewingReelComments} settings={settings} />;
      case Page.CreatorStudio: return <CreatorStudioPage />;
      case Page.Settings: return <SettingsPage settings={settings} onUpdateSettings={(newSettings) => setSettings(prev => ({...prev, ...newSettings}))} openDisplayModal={() => setIsDisplayModalOpen(true)} />;
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
       />;
      default: return <HomePage 
        tweets={tweets} 
        currentUser={currentUser}
        onPostTweet={handlePostTweet}
        onImageClick={setLightboxImageUrl}
        onViewProfile={handleViewProfile}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onStoryClick={(index) => setStoryViewerState({ stories: userStories, index })}
        onQuote={setQuotingTweet}
        onEdit={setEditingTweet}
      />;
    }
  };
  
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  const mainContent = renderPage();
  const unreadMessages = mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className={theme}>
        <div className="bg-light-bg text-light-text dark:bg-twitter-dark dark:text-white dim:bg-dim-bg dim:text-dim-text min-h-screen">
            <div className="container mx-auto flex justify-center max-w-[1280px]">
                <Sidebar 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                    onLogout={handleLogout} 
                    openDisplayModal={() => setIsDisplayModalOpen(true)}
                    activeChatCount={unreadMessages}
                />
                <main className="flex-1 min-w-0 border-x border-light-border dark:border-twitter-border dim:border-dim-border relative">
                     <MobileHeader 
                        currentPage={currentPage}
                        currentUser={currentUser}
                        onProfileClick={() => handleViewProfile(currentUser)}
                    />
                    <div className="sm:hidden h-14"></div> {/* Spacer for MobileHeader */}
                    {mainContent}
                    <div className="sm:hidden h-16"></div> {/* Spacer for BottomNav */}
                </main>
                <RightSidebar 
                    openSearchModal={() => setIsSearchModalOpen(true)} 
                    onViewProfile={handleViewProfile}
                    onFollowToggle={handleFollowToggle}
                    currentUser={currentUser}
                    otherUsers={otherUsers}
                />

                {viewingReelComments && (
                    <ReelCommentsPanel reel={viewingReelComments} onClose={() => setViewingReelComments(null)} />
                )}
            </div>

            {/* Modals and Overlays */}
            {isDisplayModalOpen && <DisplayModal onClose={() => setIsDisplayModalOpen(false)} currentTheme={theme} setTheme={setTheme} />}
            {lightboxImageUrl && <Lightbox imageUrl={lightboxImageUrl} onClose={() => setLightboxImageUrl(null)} />}
            {isSearchModalOpen && <SearchModal onClose={() => setIsSearchModalOpen(false)} onImageClick={setLightboxImageUrl} onViewProfile={handleViewProfile} />}
            {replyingToTweet && <ReplyModal tweet={replyingToTweet} currentUser={currentUser} onClose={() => setReplyingToTweet(null)} onPostReply={handlePostReply} />}
            {editingTweet && <EditTweetModal tweet={editingTweet} onClose={() => setEditingTweet(null)} onSave={handleEditTweet} />}
            {quotingTweet && <QuoteTweetModal tweet={quotingTweet} currentUser={currentUser} onClose={() => setQuotingTweet(null)} onPostTweet={handlePostTweet} />}
            {storyViewerState && <StoryViewer stories={storyViewerState.stories} initialUserIndex={storyViewerState.index} onClose={() => setStoryViewerState(null)} />}
            {videoCallUser && <VideoCallView user={videoCallUser} onEndCall={() => setVideoCallUser(null)} />}


            {/* Floating UI */}
            <FloatingChatManager 
                chats={openChats}
                allMessages={allMessages}
                onCloseChat={handleCloseChat}
                onFocusChat={handleFocusChat}
                onNavigateToMessages={handleNavigateToMessages}
                onSendMessage={handleSendMessage}
                onAddReaction={handleAddReaction}
                onPinMessage={handlePinMessage}
                onStartVideoCall={setVideoCallUser}
            />

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
                setCurrentPage={setCurrentPage}
                currentUser={currentUser}
                activeChatCount={unreadMessages}
            />
        </div>
    </div>
  );
}

export default App;