export enum Page {
  Home = 'Home',
  Explore = 'Explore',
  Notifications = 'Notifications',
  Messages = 'Messages',
  Bookmarks = 'Bookmarks',
  Communities = 'Communities',
  Profile = 'Profile',
  UserList = 'UserList',
  Reels = 'Reels',
  CreatorStudio = 'CreatorStudio',
  Settings = 'Settings',
  HelpCenter = 'HelpCenter',
}

export type Theme = 'light' | 'dark' | 'dim';

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
  }
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio: string;
  location?: string;
  website?: string;
  followingCount: number;
  followerCount: number;
  verified: boolean;
  followingIds: string[];
  followerIds: string[];
  isOnline?: boolean;
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
  viewCount: number;
  isBookmarked?: boolean;
  pinned?: boolean;
  mediaUrls?: string[];
  poll?: Poll;
  votedOnPollId?: string | null;
  isVoiceTweet?: boolean;
  audioUrl?: string;
  isEdited?: boolean;
  quotedTweet?: Tweet;
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
  type: 'text' | 'voice' | 'gif' | 'wave';
  text?: string;
  audioUrl?: string;
  duration?: number;
  gifUrl?: string;
  timestamp: string;
  isRead: boolean;
  replyTo?: Message;
  reactions?: { emoji: string; users: string[] }[];
  isPinned?: boolean;
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
  duration: number;
  timestamp: string;
}

export interface UserStory {
  user: User;
  hasUnseen: boolean;
  stories: Story[];
}

export interface ReelComment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likeCount: number;
  isLiked: boolean;
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
  comments: ReelComment[];
}