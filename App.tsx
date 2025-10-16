import React, { useState, useEffect } from 'react';
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
import CreatorStudioPage from './pages/CreatorStudioPage';
import SettingsPage from './pages/SettingsPage';
import DisplayModal from './components/DisplayModal';
import { Page, Theme } from './types';
import { mockUser } from './data/mockData';
import Lightbox from './components/Lightbox';
import SearchModal from './components/SearchModal';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  const openLightbox = (url: string) => setLightboxImageUrl(url);
  const closeLightbox = () => setLightboxImageUrl(null);
  
  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage onImageClick={openLightbox} />;
      case Page.Explore:
        return <ExplorePage openSearchModal={openSearchModal} />;
      case Page.Notifications:
        return <NotificationsPage />;
      case Page.Messages:
        return <MessagesPage />;
      case Page.Bookmarks:
        return <BookmarksPage onImageClick={openLightbox} />;
      case Page.Profile:
        return <ProfilePage user={mockUser} onImageClick={openLightbox} />;
      case Page.Communities:
        return <CommunitiesPage />;
      case Page.CreatorStudio:
        return <CreatorStudioPage />;
      case Page.Settings:
        return <SettingsPage />;
      default:
        return <HomePage onImageClick={openLightbox} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="bg-light-bg text-light-text dark:bg-twitter-dark dark:text-white dim:bg-dim-bg dim:text-dim-text min-h-screen">
      <div className="container mx-auto flex justify-center">
        <Sidebar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
          openDisplayModal={() => setIsDisplayModalOpen(true)}
        />
        <main className="w-full max-w-[600px] border-x border-light-border dark:border-twitter-border dim:border-dim-border min-h-screen">
          {renderPage()}
        </main>
        <RightSidebar openSearchModal={openSearchModal} />
      </div>
      <AnimatePresence>
        {isDisplayModalOpen && <DisplayModal onClose={() => setIsDisplayModalOpen(false)} currentTheme={theme} setTheme={setTheme} />}
        {lightboxImageUrl && <Lightbox imageUrl={lightboxImageUrl} onClose={closeLightbox} />}
        {isSearchModalOpen && <SearchModal onClose={closeSearchModal} onImageClick={openLightbox} />}
      </AnimatePresence>
    </div>
  );
};

export default App;