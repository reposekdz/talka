
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
import UserListPage from './pages/UserListPage';
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
// FIX: Removed unused VideoCallView and AudioCallView imports. CallView will handle dispatching.
import IncomingCallModal from './components/IncomingCallModal';
import ActiveCallBubble from './components/ActiveCallBubble';
import SpacesPlayer from './components/SpacesPlayer';
import Toast from './components/Toast';
import CreatorFlowModal from './components/CreatorFlowModal';
import GrokAnalysisModal from './components/GrokAnalysisModal';
import EditProfileModal from './components/EditProfileModal';
import AiAssistantModal from './components/AiAssistantModal';
import MobileHeader from './components/MobileHeader';
import BottomNav from './components/BottomNav';
import MobileDrawer from './components/MobileDrawer';
import MobileExploreDrawer from './components/MobileExploreDrawer';
// FIX: Import CallView to resolve 'Cannot find name' error.
import CallView from './components/CallView';

import { Page, Theme, Tweet, User, AppSettings, UserStory, Highlight, Conversation, Message, ChatTheme, Reel, Story, Call, Space, ReelComment } from './types';
import { mockUser as initialMockUser, otherUsers as initialOtherUsers, mockTweets as initialMockTweets, mockNotifications, mockConversations, mockMessages as initialMockMessages, initialUserStories, mockHighlights, mockReels as initialMockReels } from './data/mockData';
import { AnimatePresence } from 'framer-motion';

type MessageContent = | { type: 'text'; text: string } | { type: 'voice'; audioUrl: string; duration: number } | { type: 'gif'; gifUrl: string } | { type: 'wave' } | { type: 'image', imageUrl: string, text?: string } | { type: 'reel-share', reelId: string };


const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
    const [currentUser, setCurrentUser] = useState<User>(initialMockUser);
    const [otherUsers, setOtherUsers] = useState<User[]>(initialOtherUsers);
    const [tweets, setTweets] = useState<Tweet[]>(initialMockTweets);
    const [userStories, setUserStories] = useState<UserStory[]>(initialUserStories);
    const [highlights] = useState<Highlight[]>(mockHighlights);
    const [reels, setReels] = useState<Reel[]>(initialMockReels);
    
    // Modals and overlays state
    const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
    const [replyingToTweet, setReplyingToTweet] = useState<Tweet | null>(null);
    const [quotingTweet, setQuotingTweet] = useState<Tweet | null>(null);
    const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
    const [storyViewerState, setStoryViewerState] = useState<{ stories: UserStory[] | Highlight[], index: number, isHighlight?: boolean } | null>(null);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [creatorMode, setCreatorMode] = useState<'select' | 'story' | 'reel' | 'post' | undefined>(undefined);
    const [grokTweet, setGrokTweet] = useState<Tweet | null>(null);
    const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    // Chat state
    const [activeChats, setActiveChats] = useState<Conversation[]>([]);
    const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(initialMockMessages);
    const [inAppNotification, setInAppNotification] = useState<{ conversation: Conversation; message: Message; } | null>(null);
    
    // Call state
    const [activeCall, setActiveCall] = useState<Call | null>(null);
    const [incomingCall, setIncomingCall] = useState<Call | null>(null);
    const [callReactions, setCallReactions] = useState<{ id: number; emoji: string }[]>([]);

    // Spaces state
    const [activeSpace, setActiveSpace] = useState<Space | null>(null);
    
    // User list state
    const [userList, setUserList] = useState<{user: User, type: 'followers' | 'following'} | null>(null);

    // Mobile specific state
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ message: string, id: number, duration?: number, actionText?: string, onAction?: () => void } | null>(null);

    const showToast = (message: string, duration: number = 3, actionText?: string, onAction?: () => void) => {
        setToast({ message, id: Date.now(), duration, actionText, onAction });
    };

    const [appSettings, setAppSettings] = useState<AppSettings>({
        privacyAndSafety: { protectPosts: false, photoTagging: 'everyone', dmRequests: 'everyone' },
        notifications: { mutedWords: [] },
        accessibilityDisplayAndLanguages: { reduceMotion: false, videoAutoplay: 'on-cellular-wifi' },
    });
    
    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);
    
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
    
    const mainContent = () => {
        if (userList) {
            return <UserListPage 
                user={userList.user} 
                listType={userList.type}
                allUsers={allUsers}
                currentUser={currentUser}
                onBack={() => setUserList(null)}
                onFollowToggle={handleFollowToggle}
                onViewProfile={(user) => { setUserList(null); setCurrentPage(Page.Profile); }}
            />
        }

        switch (currentPage) {
            case Page.Home:
                return <HomePage 
                    tweets={tweets}
                    currentUser={currentUser}
                    onPostTweet={handlePostTweet}
                    onImageClick={setLightboxImageUrl}
                    onViewProfile={(user) => setCurrentPage(Page.Profile)}
                    onReply={setReplyingToTweet}
                    onToggleBookmark={(id) => showToast(`Toggled bookmark for ${id}`)}
                    onVote={() => showToast('Voted!')}
                    onQuote={setQuotingTweet}
                    onEdit={setEditingTweet}
                    userStories={userStories}
                    onStoryClick={(index) => setStoryViewerState({ stories: userStories, index })}
                    onOpenCreator={() => {setIsCreatorOpen(true); setCreatorMode('story')}}
                    onJoinSpace={setActiveSpace}
                    onGrok={setGrokTweet}
                />;
            case Page.Explore:
                return <ExplorePage 
                    onImageClick={setLightboxImageUrl} 
                    onViewProfile={(user) => setCurrentPage(Page.Profile)}
                    onGrok={setGrokTweet}
                    tweets={tweets} 
                    currentUser={currentUser} 
                />;
            case Page.Notifications:
                return <NotificationsPage />;
            case Page.Messages:
                return <MessagesPage openChat={(user) => {
                    const existingChat = activeChats.find(c => c.participant.id === user.id);
                    if (existingChat) {
                        setActiveChats(prev => [...prev.filter(c => c.id !== existingChat.id), existingChat]);
                    } else {
                        const newChat = mockConversations.find(c => c.participant.id === user.id) || {
                            id: `c-new-${user.id}`,
                            participant: user,
                            lastMessage: { id: 'm-placeholder', senderId: '', timestamp: new Date().toISOString(), isRead: true, type: 'text', text: 'Start a new conversation' },
                            unreadCount: 0,
                            chatTheme: 'default-blue',
                        };
                        setActiveChats(prev => [...prev, newChat]);
                    }
                }} />;
            case Page.Bookmarks:
                return <BookmarksPage tweets={tweets.filter(t => t.isBookmarked)} currentUser={currentUser} onViewProfile={(user) => setCurrentPage(Page.Profile)} onImageClick={setLightboxImageUrl} onGrok={setGrokTweet} />;
            case Page.Profile:
                return <ProfilePage 
                    user={currentUser} 
                    tweets={tweets.filter(t => t.user.id === currentUser.id)} 
                    highlights={highlights}
                    onImageClick={setLightboxImageUrl} 
                    onViewProfile={(user) => setCurrentPage(Page.Profile)} 
                    onViewUserList={(user, type) => setUserList({user, type})}
                    onEditProfile={() => setIsEditProfileOpen(true)}
                    onHighlightClick={(index) => setStoryViewerState({stories: highlights, index, isHighlight: true})}
                />;
            case Page.Communities:
                return <CommunitiesPage />;
            case Page.Reels:
                return <ReelsPage 
                    reels={reels} 
                    onPostComment={(reelId: string, text: string, replyTo?: ReelComment) => showToast('Comment posted!')}
                    onLikeComment={(reelId: string, commentId: string) => showToast('Comment liked!')}
                    onShareReel={(reelId, convos) => showToast(`Shared to ${convos.length} chats.`)}
                    conversations={mockConversations}
                />;
            case Page.CreatorStudio:
                return <CreatorStudioPage />;
            case Page.Settings:
                return <SettingsPage settings={appSettings} onUpdateSettings={setAppSettings} openDisplayModal={() => setIsDisplayModalOpen(true)} />;
            case Page.HelpCenter:
                return <HelpCenterPage />;
            case Page.Lists:
                return <ListsPage />;
            default:
                return <HomePage 
                    tweets={tweets}
                    currentUser={currentUser}
                    onPostTweet={handlePostTweet}
                    onImageClick={setLightboxImageUrl}
                    onViewProfile={(user) => setCurrentPage(Page.Profile)}
                    onReply={setReplyingToTweet}
                    onToggleBookmark={(id) => showToast(`Toggled bookmark for ${id}`)}
                    onVote={() => showToast('Voted!')}
                    onQuote={setQuotingTweet}
                    onEdit={setEditingTweet}
                    userStories={userStories}
                    onStoryClick={(index) => setStoryViewerState({ stories: userStories, index })}
                    onOpenCreator={() => {setIsCreatorOpen(true); setCreatorMode('story')}}
                    onJoinSpace={setActiveSpace}
                    onGrok={setGrokTweet}
                />;
        }
    }
    
    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className={`min-h-screen bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg text-light-text dark:text-white dim:text-dim-text transition-colors duration-300`}>
            <div className="container mx-auto flex justify-center max-w-[1300px]">
                <Sidebar 
                    currentPage={currentPage}
                    setCurrentPage={(page) => { setUserList(null); setCurrentPage(page); }}
                    onLogout={handleLogout}
                    openDisplayModal={() => setIsDisplayModalOpen(true)}
                    activeChatCount={activeChats.reduce((sum, chat) => sum + chat.unreadCount, 0)}
                    onOpenCreator={(mode) => { setIsCreatorOpen(true); setCreatorMode(mode); }}
                />
                <main className="flex-1 min-w-0 max-w-[600px] border-x border-light-border dark:border-twitter-border dim:border-dim-border relative">
                     <MobileHeader 
                        user={currentUser} 
                        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
                        onLogoClick={() => setCurrentPage(Page.Home)}
                    />
                    {mainContent()}
                </main>
                <RightSidebar 
                    openSearchModal={() => setIsSearchModalOpen(true)}
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
                            setUserList(null); 
                            setCurrentPage(page); 
                        }
                    }}
                    currentUser={currentUser}
                    activeChatCount={activeChats.reduce((sum, chat) => sum + chat.unreadCount, 0)}
                    notificationCount={mockNotifications.length}
                    onOpenCreator={(mode) => { setIsCreatorOpen(true); setCreatorMode(mode); }}
                />
            </div>
            
            <AnimatePresence>
                {isDisplayModalOpen && <DisplayModal onClose={() => setIsDisplayModalOpen(false)} currentTheme={theme} setTheme={setTheme} />}
                {isSearchModalOpen && <SearchModal onClose={() => setIsSearchModalOpen(false)} onImageClick={setLightboxImageUrl} onViewProfile={(user) => {setIsSearchModalOpen(false); setCurrentPage(Page.Profile)}} onGrok={(tweet) => {setIsSearchModalOpen(false); setGrokTweet(tweet)}} />}
                {lightboxImageUrl && <Lightbox imageUrl={lightboxImageUrl} onClose={() => setLightboxImageUrl(null)} />}
                {replyingToTweet && <ReplyModal tweet={replyingToTweet} currentUser={currentUser} onClose={() => setReplyingToTweet(null)} onPostReply={(reply) => {handlePostTweet({ content: reply, isBookmarked: false }); setReplyingToTweet(null); }} />}
                {quotingTweet && <QuoteTweetModal tweet={quotingTweet} currentUser={currentUser} onClose={() => setQuotingTweet(null)} onPostTweet={(tweet) => {handlePostTweet(tweet); setQuotingTweet(null);}} />}
                {editingTweet && <EditTweetModal tweet={editingTweet} onClose={() => setEditingTweet(null)} onSave={(id, content) => {setTweets(prev => prev.map(t => t.id === id ? {...t, content, isEdited: true} : t)); setEditingTweet(null); showToast('Your Post has been updated.'); }} />}
                {storyViewerState && <StoryViewer {...storyViewerState} onClose={() => setStoryViewerState(null)} showToast={showToast} />}
                {isCreatorOpen && <CreatorFlowModal initialMode={creatorMode} onClose={() => setIsCreatorOpen(false)} onPostTweet={handlePostTweet} onPostStory={() => showToast('Story posted!')} onPostReel={() => showToast('Reel shared!')} />}
                {grokTweet && <GrokAnalysisModal tweet={grokTweet} onClose={() => setGrokTweet(null)} />}
                {isAiAssistantOpen && <AiAssistantModal onClose={() => setIsAiAssistantOpen(false)} />}
                {isEditProfileOpen && <EditProfileModal user={currentUser} onClose={() => setIsEditProfileOpen(false)} onSave={(updatedUser) => { setCurrentUser(updatedUser); setIsEditProfileOpen(false); showToast('Profile updated!'); }} />}
                {isMobileDrawerOpen && <MobileDrawer user={currentUser} onClose={() => setIsMobileDrawerOpen(false)} onNavigate={(page) => {setCurrentPage(page); setUserList(null);}} />}
                {isMobileExploreOpen && <MobileExploreDrawer onClose={() => setIsMobileExploreOpen(false)} />}
                {toast && <Toast key={toast.id} {...toast} onClose={() => setToast(null)} />}
                {activeSpace && <SpacesPlayer space={activeSpace} onClose={() => setActiveSpace(null)} />}
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
                        isRead: true, // For self-sent messages
                        ...content
                    } as Message;
                    setAllMessages(prev => ({...prev, [convoId]: [...(prev[convoId] || []), newMessage]}));
                }}
                onEditMessage={(convoId, msgId, newText) => {
                    setAllMessages(prev => ({ ...prev, [convoId]: prev[convoId].map(m => m.id === msgId ? {...m, text: newText, isEdited: true} : m) }));
                    showToast('Message edited');
                }}
                onDeleteMessage={(convoId, msgId) => {
                    setAllMessages(prev => ({ ...prev, [convoId]: prev[convoId].filter(m => m.id !== msgId) }));
                    showToast('Message deleted');
                }}
                onAddReaction={(convoId, msgId, emoji) => showToast('Reaction added')}
                onPinMessage={(convoId, msgId) => showToast('Message pinned')}
                onStartVideoCall={(user) => setActiveCall({ user, type: 'video', status: 'outgoing' })}
                onStartAudioCall={(user) => setActiveCall({ user, type: 'audio', status: 'outgoing' })}
                handleUpdateChatTheme={(convoId, theme) => showToast(`Theme changed to ${theme}`)}
            />
        </div>
    );
};

export default App;
