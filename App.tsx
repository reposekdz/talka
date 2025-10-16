
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
import HelpCenterPage from './pages/HelpCenterPage';
import ReelsPage from './pages/ReelsPage';
import DisplayModal from './components/DisplayModal';
import { Page, Theme, User, Message, Conversation } from './types';
import { mockUser, mockConversations, mockMessages } from './data/mockData';
import Lightbox from './components/Lightbox';
import SearchModal from './components/SearchModal';
import Toast from './components/Toast';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  
  // State for messaging, to be updated by story replies
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);

  const openLightbox = (url: string) => setLightboxImageUrl(url);
  const closeLightbox = () => setLightboxImageUrl(null);
  
  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSendStoryReply = (recipient: User, messageText: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: mockUser.id,
      text: messageText,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false,
    };

    let conversation = conversations.find(c => c.participant.id === recipient.id);
    let conversationId: string;

    if (conversation) {
      conversationId = conversation.id;
    } else {
      // Create a new conversation if one doesn't exist
      conversationId = `c-${Date.now()}`;
      const newConversation: Conversation = {
        id: conversationId,
        participant: recipient,
        lastMessage: newMessage,
        unreadCount: 0,
      };
      setConversations(prev => [newConversation, ...prev]);
      setMessages(prev => ({ ...prev, [conversationId]: [] }));
    }
    
    // Update messages for the conversation
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }));

    // Update the last message in the conversation list
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, lastMessage: newMessage } : c
    ));

    showToast("Message sent");
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage onImageClick={openLightbox} onSendStoryReply={handleSendStoryReply} />;
      case Page.Explore:
        return <ExplorePage openSearchModal={openSearchModal} onImageClick={openLightbox} />;
      case Page.Notifications:
        return <NotificationsPage />;
      case Page.Messages:
        return <MessagesPage />;
      case Page.Bookmarks:
        return <BookmarksPage onImageClick={openLightbox} />;
      case Page.Reels:
        return <ReelsPage />;
      case Page.Profile:
        return <ProfilePage user={mockUser} onImageClick={openLightbox} />;
      case Page.Communities:
        return <CommunitiesPage />;
      case Page.CreatorStudio:
        return <CreatorStudioPage />;
      case Page.Settings:
        return <SettingsPage />;
      case Page.HelpCenter:
        return <HelpCenterPage />;
      default:
        return <HomePage onImageClick={openLightbox} onSendStoryReply={handleSendStoryReply} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isReelsPage = currentPage === Page.Reels;

  return (
    <div className="bg-light-bg text-light-text dark:bg-twitter-dark dark:text-white dim:bg-dim-bg dim:text-dim-text min-h-screen">
      <div className="container mx-auto flex justify-center">
        <Sidebar 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
          openDisplayModal={() => setIsDisplayModalOpen(true)}
        />
        <main className={`w-full min-h-screen ${isReelsPage ? 'max-w-full' : 'max-w-[600px] border-x border-light-border dark:border-twitter-border dim:border-dim-border'}`}>
          {renderPage()}
        </main>
        {!isReelsPage && <RightSidebar openSearchModal={openSearchModal} />}
      </div>
      <AnimatePresence>
        {isDisplayModalOpen && <DisplayModal onClose={() => setIsDisplayModalOpen(false)} currentTheme={theme} setTheme={setTheme} />}
        {lightboxImageUrl && <Lightbox imageUrl={lightboxImageUrl} onClose={closeLightbox} />}
        {isSearchModalOpen && <SearchModal onClose={closeSearchModal} onImageClick={openLightbox} />}
      </AnimatePresence>
      <Toast message={toastMessage} isVisible={!!toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default App;