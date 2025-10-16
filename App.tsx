import React, { useState, useEffect } from 'react';
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
import { userStories, mockUser } from './data/mockData';
import MobileHeader from './components/MobileHeader';
import BottomNav from './components/BottomNav';
import MobileMenu from './components/MobileMenu';

import { Page, Theme } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [theme, setTheme] = useState<Theme>('dark');
  
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'dim');
    root.classList.add(theme);
  }, [theme]);

  const handleSetCurrentPage = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close menu on navigation
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage onImageClick={setLightboxImageUrl} onStoryClick={setStoryViewerIndex} />;
      case Page.Explore:
        return <ExplorePage openSearchModal={() => setIsSearchModalOpen(true)} onImageClick={setLightboxImageUrl} />;
      case Page.Notifications:
        return <NotificationsPage />;
      case Page.Messages:
        return <MessagesPage />;
      case Page.Bookmarks:
        return <BookmarksPage onImageClick={setLightboxImageUrl} />;
      case Page.Communities:
        return <CommunitiesPage />;
      case Page.Profile:
        return <ProfilePage onImageClick={setLightboxImageUrl} />;
      case Page.Reels:
        return <ReelsPage />;
      case Page.CreatorStudio:
        return <CreatorStudioPage />;
      case Page.Settings:
        return <SettingsPage />;
      case Page.HelpCenter:
        return <HelpCenterPage />;
      default:
        return <HomePage onImageClick={setLightboxImageUrl} onStoryClick={setStoryViewerIndex} />;
    }
  };
  
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="bg-light-bg text-light-text dark:bg-twitter-dark dark:text-white dim:bg-dim-bg dim:text-dim-text min-h-screen">
      <div className="container mx-auto flex justify-center">
        
        <MobileHeader 
          user={mockUser}
          setCurrentPage={handleSetCurrentPage}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <Sidebar 
          currentPage={currentPage}
          setCurrentPage={handleSetCurrentPage}
          onLogout={handleLogout}
          openDisplayModal={() => setIsDisplayModalOpen(true)}
        />
        
        <main className="w-full max-w-[600px] border-x border-light-border dark:border-twitter-border dim:border-dim-border min-h-screen pt-14 pb-16 sm:pt-0 sm:pb-0">
          {renderPage()}
        </main>
        
        <RightSidebar openSearchModal={() => setIsSearchModalOpen(true)} />

        <BottomNav currentPage={currentPage} setCurrentPage={handleSetCurrentPage} />
      </div>

      {isDisplayModalOpen && <DisplayModal onClose={() => setIsDisplayModalOpen(false)} currentTheme={theme} setTheme={setTheme} />}
      {isSearchModalOpen && <SearchModal onClose={() => setIsSearchModalOpen(false)} onImageClick={setLightboxImageUrl} />}
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