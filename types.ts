
export enum Page {
    Home = 'Home',
    Explore = 'Explore',
    Notifications = 'Notifications',
    Messages = 'Messages',
    Bookmarks = 'Bookmarks',
    Profile = 'Profile',
    LoginPage = 'LoginPage',
    Communities = 'Communities',
    Reels = 'Reels',
    CreatorStudio = 'CreatorStudio',
    Settings = 'Settings',
    HelpCenter = 'HelpCenter',
    UserList = 'UserList',
    Lists = 'Lists',
}

export type Theme = 'light' | 'dim' | 'dark';

export type ChatTheme = 'default-blue' | 'sunset-orange' | 'ocean-green' | 'minty-fresh';

export interface AppSettings {
  privacyAndSafety: {
    protectPosts: boolean;
    photoTagging: 'everyone' | 'following' | 'off';
    dmRequests: 'everyone' | 'following';
  };
  security: {
      twoFactorEnabled: boolean;
  };
  notifications: {
    mutedWords: string[];
    likes: boolean;
    retweets: boolean;
    dms: boolean;
  };
  accessibilityDisplayAndLanguages: {
    reduceMotion: boolean;
    videoAutoplay: 'on-cellular-wifi' | 'on-wifi-only' | 'never';
    language: 'English' | 'Spanish' | 'Japanese' | 'French';
  }
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  followingCount: number;
  followerCount: number;
  verified?: boolean;
  followingIds: string[];
  followerIds: string[];
  isOnline: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  options: PollOption[];
  endsAt: string;
  totalVotes: number;
}

export interface Tweet {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  shareCount: number;
  viewCount: number;
  isBookmarked?: boolean;
  isLiked?: boolean;
  isRetweeted?: boolean;
  pinned?: boolean;
  isFeatured?: boolean;
  mediaUrls?: string[];
  quotedTweet?: Tweet;
  poll?: Poll;
  votedOnPollId?: string | null;
  isVoiceTweet?: boolean;
  audioUrl?: string;
  isEdited?: boolean;
  originalContent?: string;
  translation?: {
    text: string;
    sourceLang: string;
    targetLang: string;
  };
}

export interface ReelComment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likeCount: number;
  isLiked: boolean;
  replyToUsername?: string;
}

export interface TextOverlay {
    text: string;
    color: string;
    style: 'classic' | 'neon';
    position: { x: number; y: number };
}

export interface StoryPoll {
    question: string;
    options: [{ text: string; votes: number }, { text: string; votes: number }];
    position: { x: number; y: number };
    scale: number;
    rotation: number;
}

export interface StoryMention {
    user: User;
    position: { x: number; y: number };
    scale: number;
    rotation: number;
}

export interface StoryLocation {
    name: string;
    position: { x: number; y: number };
    scale: number;
    rotation: number;
}


export interface Story {
    id: string;
    mediaUrl: string;
    type: 'image' | 'video';
    duration: number;
    timestamp: string;
    likeCount: number;
    isLiked: boolean;
    comments: ReelComment[];
    textOverlays?: TextOverlay[];
    music?: { artist: string; title: string; };
    stickers?: { url: string; x: number; y: number; scale: number; rotation: number; }[];
    drawingOverlayUrl?: string;
    poll?: StoryPoll;
    mentions?: StoryMention[];
    location?: StoryLocation;
}

export interface Notification {
  id: string;
  type: 'like' | 'retweet' | 'follow' | 'mention' | 'story_like' | 'story_comment';
  user: User;
  tweet?: Tweet;
  story?: Story;
  commentText?: string;
  timestamp: string;
}

export interface MessageReaction {
    emoji: string;
    users: string[];
}

export interface Message {
  id: string;
  senderId: string;
  timestamp: string;
  isRead: boolean;
  replyTo?: Message;
  reactions?: MessageReaction[];
  isPinned?: boolean;
  isEdited?: boolean;
  type: 'text' | 'voice' | 'gif' | 'wave' | 'image' | 'reel-share';
  text?: string;
  audioUrl?: string;
  duration?: number;
  gifUrl?: string;
  imageUrl?: string;
  reelId?: string;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
  isTyping?: boolean;
  chatTheme: ChatTheme;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  memberCount: number;
  memberIds: string[];
  tags: string[];
}

export interface UserStory {
    user: User;
    hasUnseen: boolean;
    stories: Story[];
}

export interface Reel {
    id: string;
    user: User;
    videoUrl: string;
    caption: string;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    shareCount: number;
    isLiked: boolean;
    isDisliked: boolean;
    isBookmarked: boolean;
    comments: ReelComment[];
}

export interface Space {
    id: string;
    title: string;
    host: User;
    speakers: User[];
    listenerCount: number;
    color: string;
}

export interface Highlight {
    id: string;
    title: string;
    coverUrl: string;
    stories: Story[];
}

export interface Call {
  user: User;
  type: 'video' | 'audio';
  status: 'incoming' | 'outgoing' | 'active' | 'minimized';
  isMicMuted?: boolean;
  isCameraOff?: boolean;
}
