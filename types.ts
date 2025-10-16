
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  verified: boolean;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  followers: number;
  following: number;
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Poll {
    options: PollOption[];
    totalVotes: number;
    endsAt: string;
}

export interface Tweet {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  mediaUrls?: string[];
  poll?: Poll;
  replyCount: number;
  retweetCount: number;
  likeCount: number;
  isLiked: boolean;
  isRetweeted: boolean;
  isBookmarked: boolean;
  isPinned?: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'retweet' | 'follow' | 'mention';
  user: User;
  tweet?: Tweet;
  timestamp: string;
}

export interface TrendingTopic {
  category: string;
  topic: string;
  tweets: string;
  imageUrl?: string;
}

export interface Reaction {
    emoji: string;
    users: { id: string, displayName: string }[];
}

export interface Message {
    id: string;
    senderId: string;
    text?: string;
    timestamp: string;
    type: 'text' | 'voice';
    replyTo?: Message;
    reactions?: Reaction[];
    audioUrl?: string;
    duration?: number; // in seconds
    isRead: boolean;
}

export interface Conversation {
    id: string;
    participant: User;
    lastMessage: Message;
    unreadCount: number;
    isTyping?: boolean;
}

export interface Community {
    id:string;
    name: string;
    description: string;
    avatarUrl: string;
    bannerUrl: string;
    memberCount: number;
}

export enum Page {
    Home = 'Home',
    Explore = 'Explore',
    Notifications = 'Notifications',
    Messages = 'Messages',
    Bookmarks = 'Bookmarks',
    Communities = 'Communities',
    Profile = 'Profile',
    CreatorStudio = 'CreatorStudio',
    Settings = 'Settings',
}

export type Theme = 'light' | 'dim' | 'dark';

export interface Story {
    id: string;
    type: 'image' | 'video';
    mediaUrl: string;
    duration: number; // in ms
}

export interface UserStory {
    user: User;
    stories: Story[];
    hasUnseen: boolean;
}