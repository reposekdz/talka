import { User, Tweet, TrendingTopic, Notification, Conversation, Message, Community, UserStory } from '../types';

// Mock Users
export const mockUser: User = {
  id: 'u1',
  username: 'reactdev',
  displayName: 'React Dev',
  avatarUrl: 'https://picsum.photos/seed/u1/200/200',
  verified: true,
  bio: 'Building UIs with React. This is a frontend prototype of a Twitter-like app. All data is mocked.',
  location: 'The Component Tree',
  website: 'react.dev',
  joinDate: '2022-01-01T00:00:00.000Z',
  followers: 12345,
  following: 123,
};

export const otherUsers: User[] = [
  {
    id: 'u2',
    username: 'tailwindcss',
    displayName: 'Tailwind CSS',
    avatarUrl: 'https://picsum.photos/seed/u2/200/200',
    verified: true,
    bio: 'A utility-first CSS framework for rapid UI development.',
    joinDate: '2017-11-01T00:00:00.000Z',
    followers: 750000,
    following: 1,
  },
  {
    id: 'u3',
    username: 'typescript',
    displayName: 'TypeScript',
    avatarUrl: 'https://picsum.photos/seed/u3/200/200',
    verified: true,
    bio: 'JavaScript that scales.',
    joinDate: '2012-10-01T00:00:00.000Z',
    followers: 1200000,
    following: 1,
  },
  {
    id: 'u4',
    username: 'gemini_ai',
    displayName: 'Gemini AI',
    avatarUrl: 'https://picsum.photos/seed/u4/200/200',
    verified: true,
    bio: 'A family of multimodal AI models from Google.',
    joinDate: '2023-12-06T00:00:00.000Z',
    followers: 500000,
    following: 10,
  },
];

// Base Tweets (can be used for profiles, bookmarks, etc.)
export const baseTweets: Tweet[] = [
  {
    id: 't1',
    user: mockUser,
    content: 'Just deployed the new prototype for my Twitter clone project! Built with React, TypeScript, and Tailwind CSS. It\'s amazing how productive this stack is. 🚀',
    timestamp: '2024-07-22T10:00:00.000Z',
    replyCount: 12,
    retweetCount: 45,
    likeCount: 256,
    isLiked: true,
    isRetweeted: false,
    isBookmarked: true,
    isPinned: true,
  },
  {
    id: 't2',
    user: otherUsers[0],
    content: 'Did you know you can use `@apply` to extract component classes in Tailwind? It\'s a powerful feature for keeping your markup clean.',
    timestamp: '2024-07-22T09:30:00.000Z',
    replyCount: 8,
    retweetCount: 102,
    likeCount: 512,
    isLiked: false,
    isRetweeted: true,
    isBookmarked: false,
  },
  {
    id: 't5',
    user: mockUser,
    content: 'Which state management library do you prefer for large-scale React applications?',
    timestamp: '2024-07-20T18:00:00.000Z',
    replyCount: 155,
    retweetCount: 203,
    likeCount: 1800,
    isLiked: false,
    isRetweeted: false,
    isBookmarked: false,
    poll: {
        options: [
            { id: 'p1', text: 'Redux Toolkit', votes: 850 },
            { id: 'p2', text: 'Zustand', votes: 620 },
            { id: 'p3', text: 'Jotai / Valtio', votes: 210 },
            { id: 'p4', text: 'Context API', votes: 120 },
        ],
        totalVotes: 1800,
        endsAt: '2024-07-23T18:00:00.000Z',
    }
  },
  {
    id: 't3',
    user: otherUsers[1],
    content: 'TypeScript 5.5 is out! So many great new features, especially the inferred type predicates. What\'s your favorite new feature?',
    timestamp: '2024-07-21T15:00:00.000Z',
    replyCount: 50,
    retweetCount: 300,
    likeCount: 1200,
    isLiked: true,
    isRetweeted: false,
    isBookmarked: true,
    mediaUrls: ['https://picsum.photos/seed/t3/600/400'],
  },
  {
    id: 't4',
    user: otherUsers[2],
    content: 'Excited to see what developers build with the new Gemini API. The possibilities with multimodality are endless!',
    timestamp: '2024-07-21T12:00:00.000Z',
    replyCount: 25,
    retweetCount: 150,
    likeCount: 800,
    isLiked: false,
    isRetweeted: false,
    isBookmarked: false,
    mediaUrls: ['https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'],
  },
];

export const mockTweets: Tweet[] = [...baseTweets].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


export const mockTrendingTopics: TrendingTopic[] = [
    { category: 'Technology', topic: '#React19', tweets: '15.2K Tweets', imageUrl: 'https://picsum.photos/seed/trend1/200/200' },
    { category: 'Web Development', topic: 'Tailwind CSS', tweets: '12.1K Tweets', imageUrl: 'https://picsum.photos/seed/trend2/200/200' },
    { category: 'AI', topic: '#GeminiAPI', tweets: '10.5K Tweets', imageUrl: 'https://picsum.photos/seed/trend3/200/200' },
    { category: 'Programming', topic: 'TypeScript 5.5', tweets: '8.7K Tweets', imageUrl: 'https://picsum.photos/seed/trend4/200/200' },
];

export const mockNotifications: Notification[] = [
    { id: 'n1', type: 'like', user: otherUsers[0], tweet: baseTweets[0], timestamp: '2024-07-22T10:05:00.000Z'},
    { id: 'n2', type: 'retweet', user: otherUsers[1], tweet: baseTweets[0], timestamp: '2024-07-22T10:15:00.000Z'},
    { id: 'n3', type: 'follow', user: otherUsers[2], timestamp: '2024-07-22T09:00:00.000Z'},
    { id: 'n4', type: 'mention', user: mockUser, tweet: { ...baseTweets[1], content: `Hey @reactdev, what do you think of this? ${baseTweets[1].content}` }, timestamp: '2024-07-22T09:35:00.000Z'},
];

export const mockConversations: Conversation[] = [
    { id: 'c1', participant: otherUsers[0], lastMessage: { text: 'Sounds good, thanks!', timestamp: '2024-07-22T11:00:00.000Z'}, unreadCount: 2 },
    { id: 'c2', participant: otherUsers[1], lastMessage: { text: 'I\'ll check out the new docs.', timestamp: '2024-07-21T18:00:00.000Z'}, unreadCount: 0 },
    { id: 'c3', participant: otherUsers[2], lastMessage: { text: 'The API looks very powerful.', timestamp: '2024-07-21T14:00:00.000Z'}, unreadCount: 0 },
];

export const mockMessages: Record<string, Message[]> = {
    'c1': [
        { id: 'm1-1', senderId: otherUsers[0].id, text: 'Hey! Saw your prototype. Looks awesome!', timestamp: '2024-07-22T10:59:00.000Z' },
        { id: 'm1-2', senderId: mockUser.id, text: 'Thanks so much!', timestamp: '2024-07-22T10:59:30.000Z' },
        { id: 'm1-3', senderId: otherUsers[0].id, text: 'Sounds good, thanks!', timestamp: '2024-07-22T11:00:00.000Z' },
    ],
    'c2': [
        { id: 'm2-1', senderId: otherUsers[1].id, text: 'Did you see the latest TS update?', timestamp: '2024-07-21T17:59:00.000Z' },
        { id: 'm2-2', senderId: mockUser.id, text: 'Yes, it\'s packed with features!', timestamp: '2024-07-21T17:59:30.000Z' },
        { id: 'm2-3', senderId: otherUsers[1].id, text: 'I\'ll check out the new docs.', timestamp: '2024-07-21T18:00:00.000Z' },
    ],
    'c3': [
        { id: 'm3-1', senderId: mockUser.id, text: 'The Gemini API seems promising.', timestamp: '2024-07-21T13:59:30.000Z' },
        { id: 'm3-2', senderId: otherUsers[2].id, text: 'The API looks very powerful.', timestamp: '2024-07-21T14:00:00.000Z' },
    ],
};

export const mockCommunities: Community[] = [
    { id: 'comm1', name: 'React Developers', description: 'A community for all things React, from hooks to suspense.', avatarUrl: 'https://picsum.photos/seed/comm1/200/200', bannerUrl: 'https://picsum.photos/seed/comm-banner1/600/200', memberCount: 150000 },
    { id: 'comm2', name: 'UI/UX Designers', description: 'Share your work, get feedback, and discuss design trends.', avatarUrl: 'https://picsum.photos/seed/comm2/200/200', bannerUrl: 'https://picsum.photos/seed/comm-banner2/600/200', memberCount: 89000 },
];

export const mockUserStories: UserStory[] = [
    {
        user: otherUsers[0],
        hasUnseen: true,
        stories: [
            { id: 's1-1', type: 'image', mediaUrl: 'https://picsum.photos/seed/s1-1/360/640', duration: 5000 },
            { id: 's1-2', type: 'image', mediaUrl: 'https://picsum.photos/seed/s1-2/360/640', duration: 5000 },
        ]
    },
    {
        user: otherUsers[1],
        hasUnseen: true,
        stories: [
            { id: 's2-1', type: 'image', mediaUrl: 'https://picsum.photos/seed/s2-1/360/640', duration: 5000 },
        ]
    },
    {
        user: otherUsers[2],
        hasUnseen: false,
        stories: [
            { id: 's3-1', type: 'image', mediaUrl: 'https://picsum.photos/seed/s3-1/360/640', duration: 5000 },
            { id: 's3-2', type: 'video', mediaUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', duration: 10000 },
        ]
    },
    {
        user: mockUser,
        hasUnseen: false,
        stories: [
            { id: 's4-1', type: 'image', mediaUrl: 'https://picsum.photos/seed/s4-1/360/640', duration: 7000 },
        ]
    }
];