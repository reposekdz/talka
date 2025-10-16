import { User, Tweet, TrendingTopic, Notification, Conversation, Message, Community, UserStory, Comment } from '../types';

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
   {
    id: 'u5',
    username: 'JaneDoe',
    displayName: 'Jane Doe',
    avatarUrl: 'https://picsum.photos/seed/u5/200/200',
    verified: false,
    bio: 'Just another user.',
    joinDate: '2023-01-15T00:00:00.000Z',
    followers: 150,
    following: 300,
  },
];

const mockReelComments: Comment[] = [
    { id: 'c1-1', user: otherUsers[4], text: 'This is amazing!', timestamp: '2024-07-22T12:01:00.000Z' },
    { id: 'c1-2', user: otherUsers[1], text: 'Great work on the animation.', timestamp: '2024-07-22T12:02:00.000Z' },
    { id: 'c1-3', user: mockUser, text: 'Thanks everyone!', timestamp: '2024-07-22T12:03:00.000Z' },
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
    comments: mockReelComments,
  },
  {
    id: 't6',
    user: otherUsers[0],
    content: 'Exploring the coast today! 🌊',
    timestamp: '2024-07-22T14:00:00.000Z',
    mediaUrls: ['https://picsum.photos/seed/t6/600/800'],
    replyCount: 18,
    retweetCount: 55,
    likeCount: 432,
    isLiked: false,
    isRetweeted: false,
    isBookmarked: false,
  },
  {
    id: 't7',
    user: otherUsers[1],
    content: 'A quiet moment in the city that never sleeps.',
    timestamp: '2024-07-22T13:00:00.000Z',
    mediaUrls: ['https://picsum.photos/seed/t7/600/750'],
    replyCount: 22,
    retweetCount: 89,
    likeCount: 980,
    isLiked: true,
    isRetweeted: false,
    isBookmarked: false,
  },
  {
    id: 't8',
    user: otherUsers[2],
    content: 'The future is bright!',
    timestamp: '2024-07-22T12:00:00.000Z',
    mediaUrls: ['https://picsum.photos/seed/t8/800/600'],
    replyCount: 30,
    retweetCount: 210,
    likeCount: 1500,
    isLiked: false,
    isRetweeted: true,
    isBookmarked: false,
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

const initialMessages: Message[] = [
    { id: 'm1-1', senderId: otherUsers[0].id, type: 'text', text: 'Hey! Saw your prototype. Looks awesome!', timestamp: '2024-07-22T10:59:00.000Z', isRead: true },
    { id: 'm1-2', senderId: mockUser.id, type: 'text', text: 'Thanks so much!', timestamp: '2024-07-22T10:59:30.000Z', isRead: true, reactions: [{ emoji: '❤️', users: [otherUsers[0]] }] },
    { id: 'm1-3', senderId: otherUsers[0].id, type: 'text', text: 'Of course! That video player is slick.', timestamp: '2024-07-22T11:00:00.000Z', isRead: true },
    { id: 'm1-4', senderId: mockUser.id, type: 'voice', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 7, timestamp: '2024-07-22T11:01:00.000Z', isRead: true },
    { id: 'm1-5', senderId: otherUsers[0].id, type: 'text', text: 'Whoa, voice notes work too? Impressive.', timestamp: '2024-07-22T11:01:30.000Z', isRead: true, replyTo: { id: 'm1-4', senderId: mockUser.id, type: 'voice', duration: 7, timestamp: '2024-07-22T11:01:00.000Z', isRead: true }},
    { id: 'm1-6', senderId: mockUser.id, type: 'text', text: 'Yep! Just added them. Along with replies and reactions.', timestamp: '2024-07-22T11:02:00.000Z', isRead: false },
    { id: 'm1-7', senderId: mockUser.id, type: 'text', text: 'Let me know what you think!', timestamp: '2024-07-22T11:02:05.000Z', isRead: false },
];

export const mockMessages: Record<string, Message[]> = {
    'c1': initialMessages,
    'c2': [
        { id: 'm2-1', senderId: otherUsers[1].id, type: 'text', text: 'Did you see the latest TS update?', timestamp: '2024-07-21T17:59:00.000Z', isRead: true },
        { id: 'm2-2', senderId: mockUser.id, type: 'text', text: 'Yes, it\'s packed with features!', timestamp: '2024-07-21T17:59:30.000Z', isRead: true },
        { id: 'm2-3', senderId: otherUsers[1].id, type: 'text', text: 'I\'ll check out the new docs.', timestamp: '2024-07-21T18:00:00.000Z', isRead: true },
    ],
    'c3': [
        { id: 'm3-1', senderId: mockUser.id, type: 'text', text: 'The Gemini API seems promising.', timestamp: '2024-07-21T13:59:30.000Z', isRead: true },
        { id: 'm3-2', senderId: otherUsers[2].id, type: 'text', text: 'The API looks very powerful.', timestamp: '2024-07-21T14:00:00.000Z', isRead: true },
    ],
};

export const mockConversations: Conversation[] = [
    { id: 'c1', participant: otherUsers[0], lastMessage: initialMessages[initialMessages.length - 1], unreadCount: 2, isTyping: true },
    { id: 'c2', participant: otherUsers[1], lastMessage: mockMessages['c2'][mockMessages['c2'].length - 1], unreadCount: 0 },
    { id: 'c3', participant: otherUsers[2], lastMessage: mockMessages['c3'][mockMessages['c3'].length - 1], unreadCount: 0 },
];


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