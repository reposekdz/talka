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
  followerIds: string[];
  followingIds: string[];
}

export interface Poll {
    id: string;
    options: { id: string; text: string; votes: number }[];
    endsAt: string; // ISO string
    totalVotes: number;
}

export interface Tweet {
  id: string;
  user: User;
  content: string;
  timestamp: string; // ISO string
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  viewCount: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
  isBookmarked?: boolean;
  mediaUrls?: string[];
  poll?: Poll;
  pinned?: boolean;
  isVoiceTweet?: boolean;
  audioUrl?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'retweet' | 'follow' | 'mention';
  user: User;
  tweet?: Tweet;
  timestamp: string;
}

export interface Message {
    id: string;
    senderId: string;
    text?: string;
    type: 'text' | 'voice' | 'gif';
    timestamp: string;
    isRead: boolean;
    replyTo?: Message;
    reactions?: { emoji: string; users: string[] }[];
    audioUrl?: string;
    duration?: number;
    gifUrl?: string;
}

export interface Conversation {
    id: string;
    participant: User;
    lastMessage: Message;
    unreadCount: number;
    isTyping?: boolean;
}

export interface Community {
    id: string;
    name: string;
    description: string;
    avatarUrl: string;
    bannerUrl: string;
    memberCount: number;
}

export interface Story {
    id: string;
    mediaUrl: string;
    duration: number; // in seconds
    timestamp: string;
}

export interface UserStory {
    user: User;
    stories: Story[];
    hasUnseen: boolean;
}

export interface ReelComment {
  id:string;
  user: User;
  text: string;
  timestamp: string;
  likeCount: number;
  isLiked: boolean;
  replies?: ReelComment[];
}

export interface Reel {
    id: string;
    user: User;
    videoUrl: string;
    caption: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isLiked: boolean;
    comments: ReelComment[];
}

export enum Page {
    Home = 'Home',
    Explore = 'Explore',
    Notifications = 'Notifications',
    Messages = 'Messages',
    Reels = 'Reels',
    Bookmarks = 'Bookmarks',
    Communities = 'Communities',
    Profile = 'Profile',
    CreatorStudio = 'CreatorStudio',
    Settings = 'Settings',
    HelpCenter = 'HelpCenter',
    UserList = 'UserList',
}

export type Theme = 'light' | 'dim' | 'dark';

// Advanced App Settings
export interface AppSettings {
  privacyAndSafety: {
    protectPosts: boolean;
    photoTagging: 'everyone' | 'following' | 'off';
    dmRequests: 'everyone' | 'following';
  };
  notifications: {
    mutedWords: string[];
  };
  accessibilityDisplayAndLanguages: {
    reduceMotion: boolean;
    videoAutoplay: 'on-cellular-wifi' | 'on-wifi-only' | 'never';
  };
}
