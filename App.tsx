import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';
import BookmarksPage from './pages/BookmarksPage';
import CommunitiesPage from './pages/CommunitiesPage';
import ProfilePage from './pages/ProfilePage';
import ReelsPage from './pages/ReelsPage';
import CreatorStudioPage from './pages/CreatorStudioPage';
import SettingsPage from './pages/SettingsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import LoginPage from './pages/LoginPage';
import DisplayModal from './components/DisplayModal';
import SearchModal from './components/SearchModal';
import Lightbox from './components/Lightbox';
import StoryViewer from './components/StoryViewer';
import UserListPage from './pages/UserListPage';
import ReelCommentsPanel from './components/ReelCommentsPanel';
import { userStories, mockUser as initialUser, otherUsers as initialOtherUsers, mockTweets as initialTweets } from './data/mockData';
import MobileHeader from './components/MobileHeader';
import BottomNav from './components/BottomNav';
import MobileMenu from './components/MobileMenu';
import { Page, Theme, User, Tweet, Reel, AppSettings } from './types';
import { AnimatePresence, motion } from 'framer-motion';

const initialSettings: AppSettings = {
  privacyAndSafety: {
    protectPosts: false,
    photoTagging: 'everyone',
    dmRequests: 'everyone',
  },
  notifications: {
    mutedWords: ['politics', 'crypto'],
  },
  accessibilityDisplayAndLanguages: {
    reduceMotion: false,
    videoAutoplay: 'on-cellular-wifi',
  }
};


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pageHistory, setPageHistory] = useState<Page[]>([Page.Home]);
  const currentPage = pageHistory[pageHistory.length - 1];

  const [theme, setTheme] = useState<Theme>('dark');
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [otherUsers, setOtherUsers] = useState<User[]>(initialOtherUsers);
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialSettings);
  
  const [viewingProfileFor, setViewingProfileFor] = useState<User | null>(null);
  const [userListInfo, setUserListInfo] = useState<{ user: User; type: 'followers' | 'following' } | null>(null);

  const allUsers = [currentUser, ...otherUsers];

  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);
  
  const [isReelsCommentOpen, setIsReelsCommentOpen] = useState(false);
  const [activeReelForComments, setActiveReelForComments] = useState<Reel | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'dim');
    root.classList.add(theme);
  }, [theme]);

  const navigateTo = (page: Page) => {
    setPageHistory(prev => [...prev, page]);
    setIsMobileMenuOpen(false);
  };
  
  const handleSetCurrentPage = (page: Page) => {
    setViewingProfileFor(null);
    setUserListInfo(null);
    setPageHistory([page]);
    setIsMobileMenuOpen(false);
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
        if (currentPage === Page.Profile && viewingProfileFor) setViewingProfileFor(null);
        if (currentPage === Page.UserList && userListInfo) setUserListInfo(null);
        setPageHistory(prev => prev.slice(0, -1));
    }
  };

  const handleLogout = () => setIsLoggedIn(false);

  const handleViewProfile = (user: User) => {
    setViewingProfileFor(user);
    navigateTo(Page.Profile);
  };
  
  const handleViewUserList = (user: User, type: 'followers' | 'following') => {
    setUserListInfo({ user, type });
    navigateTo(Page.UserList);
  };

  const handleFollowToggle = (userIdToToggle: string) => {
    const isFollowing = currentUser.followingIds.includes(userIdToToggle);
    
    // Update current user's state
    setCurrentUser(prevUser => ({
      ...prevUser,
      followingIds: isFollowing
        ? prevUser.followingIds.filter(id => id !== userIdToToggle)
        : [...prevUser.followingIds, userIdToToggle],
      followingCount: isFollowing ? prevUser.followingCount - 1 : prevUser.followingCount + 1,
    }));

    // Update the other user's state (either in otherUsers or viewingProfileFor)
    const updateUser = (user: User) => {
        if (user.id === userIdToToggle) {
            return {
                ...user,
                followerIds: isFollowing
                    ? user.followerIds.filter(id => id !== currentUser.id)
                    : [...user.followerIds, currentUser.id],
                followerCount: isFollowing ? user.followerCount - 1 : user.followerCount + 1,
            };
        }
        return user;
    };

    setOtherUsers(prevUsers => prevUsers.map(updateUser));
    if (viewingProfileFor) setViewingProfileFor(prev => prev ? updateUser(prev) : null);
    if (userListInfo) setUserListInfo(prev => prev ? { ...prev, user: updateUser(prev.user) } : null);
  };
  
  const handlePostTweet = (newTweetContent: Partial<Tweet>) => {
    const newTweet: Tweet = {
      id: `t-${Date.now()}`,
      user: currentUser,
      timestamp: new Date().toISOString(),
      replyCount: 0,
      retweetCount: 0,
      likeCount: 0,
      viewCount: 0,
      content: '',
      ...newTweetContent,
    };
    setTweets(prev => [newTweet, ...prev]);
  };

  const handleOpenReelsComments = (reel: Reel) => {
    setActiveReelForComments(reel);
    setIsReelsCommentOpen(true);
  };

  const handleCloseReelsComments = () => {
    setIsReelsCommentOpen(false);
    setActiveReelForComments(null);
  };
  
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
  };

  const filteredTweets = useMemo(() => {
    const mutedWords = appSettings.notifications.mutedWords;
    if (mutedWords.length === 0) return tweets;

    return tweets.filter(tweet => 
        !mutedWords.some(mutedWord => tweet.content.toLowerCase().includes(mutedWord.toLowerCase()))
    );
  }, [tweets, appSettings.notifications.mutedWords]);


  const renderPage = () => {
    const pageProps = {
      currentUser,
      onViewProfile: handleViewProfile,
      onFollowToggle: handleFollowToggle,
      onImageClick: setLightboxImageUrl,
      onPostTweet: handlePostTweet,
    };
    
    switch (currentPage) {
      case Page.Home:
        return <HomePage {...pageProps} tweets={filteredTweets} onStoryClick={setStoryViewerIndex} />;
      case Page.Explore:
        return <ExplorePage {...pageProps} openSearchModal={() => setIsSearchModalOpen(true)} />;
      case Page.Notifications:
        return <NotificationsPage {...pageProps} />;
      case Page.Messages:
        return <MessagesPage {...pageProps} />;
      case Page.Bookmarks:
        return <BookmarksPage {...pageProps} />;
      case Page.Communities:
        return <CommunitiesPage />;
      case Page.Profile:
        return <ProfilePage {...pageProps} user={viewingProfileFor || currentUser} onBack={handleBack} onViewUserList={handleViewUserList} />;
       case Page.UserList:
        return userListInfo ? <UserListPage {...pageProps} allUsers={allUsers} user={userListInfo.user} listType={userListInfo.type} onBack={handleBack} /> : <HomePage {...pageProps} tweets={filteredTweets} onStoryClick={setStoryViewerIndex} />;
      case Page.Reels:
        return <ReelsPage onOpenComments={handleOpenReelsComments} settings={appSettings} />;
      case Page.CreatorStudio:
        return <CreatorStudioPage />;
      case Page.Settings:
        return <SettingsPage settings={appSettings} onUpdateSettings={setAppSettings} />;
      case Page.HelpCenter:
        return <HelpCenterPage />;
      default:
        return <HomePage {...pageProps} tweets={filteredTweets} onStoryClick={setStoryViewerIndex} />;
    }
  };
  
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="bg-light-bg text-light-text dark:bg-twitter-dark dark:text-white dim:bg-dim-bg dim:text-dim-text h-screen">
      <div className="container mx-auto flex justify-center h-full">
        
        <MobileHeader 
          user={currentUser}
          setCurrentPage={handleSetCurrentPage}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <Sidebar 
          currentPage={currentPage}
          setCurrentPage={handleSetCurrentPage}
          onLogout={handleLogout}
          openDisplayModal={() => setIsDisplayModalOpen(true)}
        />
        
        <main className="w-full max-w-[600px] border-x border-light-border dark:border-twitter-border dim:border-dim-border h-full overflow-y-auto">
          <div className="pt-14 pb-16 sm:pt-0 sm:pb-0 min-h-full">
            {renderPage()}
          </div>
        </main>
        
        <div className="w-0 lg:w-[350px] flex-shrink-0 relative">
          <AnimatePresence>
            {isReelsCommentOpen && activeReelForComments ? (
              <motion.div
                key="comments"
                className="absolute inset-0"
                initial={{ x: '100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              >
                <ReelCommentsPanel reel={activeReelForComments} onClose={handleCloseReelsComments} />
              </motion.div>
            ) : (
              <motion.div 
                key="sidebar"
                className="absolute inset-0"
                initial={false}
                animate={{ x: '0%' }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              >
                <RightSidebar 
                  {...{currentUser, onFollowToggle: handleFollowToggle, onViewProfile: handleViewProfile}}
                  openSearchModal={() => setIsSearchModalOpen(true)} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <BottomNav currentPage={currentPage} setCurrentPage={handleSetCurrentPage} />
      </div>

      {isDisplayModalOpen && <DisplayModal onClose={() => setIsDisplayModalOpen(false)} currentTheme={theme} setTheme={setTheme} />}
      {isSearchModalOpen && <SearchModal onClose={() => setIsSearchModalOpen(false)} onImageClick={setLightboxImageUrl} onViewProfile={handleViewProfile} />}
      {lightboxImageUrl && <Lightbox imageUrl={lightboxImageUrl} onClose={() => setLightboxImageUrl(null)} />}
      {storyViewerIndex !== null && <StoryViewer stories={userStories} initialUserIndex={storyViewerIndex} onClose={() => setStoryViewerIndex(null)} />}
      {isMobileMenuOpen && (
        <MobileMenu 
          onClose={() => setIsMobileMenuOpen(false)}
          setCurrentPage={handleSetCurrentPage}
          onLogout={handleLogout}
          openDisplayModal={() => setIsDisplayModalOpen(true)}
        />
      )}
    </div>
  );
}

export default App;
