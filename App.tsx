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
import { Page, Theme, Tweet, User, AppSettings, Conversation, Reel } from './types';
import { mockUser, otherUsers as initialOtherUsers, mockTweets, userStories, mockConversations } from './data/mockData';

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
  const [storyViewerState, setStoryViewerState] = useState<{ stories: typeof userStories, index: number } | null>(null);
  const [viewingReelComments, setViewingReelComments] = useState<Reel | null>(null);

  // Profile/User List states
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userListState, setUserListState] = useState<{ user: User, type: 'followers' | 'following' } | null>(null);

  // Floating chats
  const [openChats, setOpenChats] = useState<Conversation[]>([]);
  
  // Toast
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });

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
    };
    setTweets(prev => [newTweet, ...prev]);
  }, [currentUser]);
  
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
      // Bring to front
       setOpenChats(prev => [...prev.filter(c => c.participant.id !== user.id), existingChat]);
    } else {
      const newChat = mockConversations.find(c => c.participant.id === user.id) || {
          id: `c-${user.id}`,
          participant: user,
          lastMessage: { id: 'm-new', senderId: '', type: 'text', text: 'Start a conversation', timestamp: new Date().toISOString(), isRead: true },
          unreadCount: 0
      };
      setOpenChats(prev => [...prev, newChat]);
    }
  };

  const handleCloseChat = (conversationId: string) => {
    setOpenChats(prev => prev.filter(c => c.id !== conversationId));
  };
  
  const handleFocusChat = (user: User) => {
    handleOpenChat(user); // brings to front
  };
  
  const handleNavigateToMessages = () => {
      setCurrentPage(Page.Messages);
      setOpenChats([]);
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
      />;
    }

    switch(currentPage) {
      case Page.Home: return <HomePage 
        tweets={tweets} 
        onPostTweet={handlePostTweet}
        onImageClick={setLightboxImageUrl}
        onViewProfile={handleViewProfile}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onStoryClick={(index) => setStoryViewerState({ stories: userStories, index })}
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
       />;
      default: return <HomePage 
        tweets={tweets} 
        onPostTweet={handlePostTweet}
        onImageClick={setLightboxImageUrl}
        onViewProfile={handleViewProfile}
        onReply={setReplyingToTweet}
        onToggleBookmark={handleToggleBookmark}
        onVote={handleVote}
        onStoryClick={(index) => setStoryViewerState({ stories: userStories, index })}
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
            {storyViewerState && <StoryViewer stories={storyViewerState.stories} initialUserIndex={storyViewerState.index} onClose={() => setStoryViewerState(null)} />}

            {/* Floating UI */}
            <FloatingChatManager 
                chats={openChats}
                onCloseChat={handleCloseChat}
                onFocusChat={handleFocusChat}
                onNavigateToMessages={handleNavigateToMessages}
            />
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
