import { User, Tweet, Notification, Conversation, Message, Community, Story, UserStory, Reel } from '../types';

export const mockUser: User = {
  id: 'u1',
  username: 'reactdev',
  displayName: 'React Dev',
  avatarUrl: 'https://picsum.photos/seed/u1/200/200',
  bannerUrl: 'https://picsum.photos/seed/b1/1500/500',
  bio: 'Building things for the web with React & TypeScript. This is a frontend prototype. 🚀',
  location: 'The Web',
  website: 'github.com',
  followingCount: 2,
  followerCount: 1,
  verified: true,
  followingIds: ['u2', 'u4'],
  followerIds: ['u3'],
};

export const otherUsers: User[] = [
  { id: 'u2', username: 'tailwindcss', displayName: 'Tailwind CSS', avatarUrl: 'https://picsum.photos/seed/u2/200/200', followingCount: 1, followerCount: 1, verified: true, bio: 'A utility-first CSS framework for rapid UI development.', followingIds: ['u1'], followerIds: [] },
  { id: 'u3', username: 'vercel', displayName: 'Vercel', avatarUrl: 'https://picsum.photos/seed/u3/200/200', followingCount: 1, followerCount: 0, verified: true, bio: 'Develop. Preview. Ship.', followingIds: ['u1'], followerIds: [] },
  { id: 'u4', username: 'elonmusk', displayName: 'Elon Musk', avatarUrl: 'https://picsum.photos/seed/u4/200/200', followingCount: 0, followerCount: 1, verified: true, bio: 'Mars & Cars', followingIds: [], followerIds: ['u1'] },
];

export const baseTweets: Tweet[] = [
  {
    id: 't1',
    user: mockUser,
    content: 'Just launched a new version of Proto-Twitter! It includes a dark mode, dim mode, and a bunch of new features. Check it out and let me know what you think!',
    timestamp: '2024-07-22T10:00:00Z',
    replyCount: 12,
    retweetCount: 45,
    likeCount: 250,
    viewCount: 15000,
    isBookmarked: true,
    pinned: true,
  },
  {
    id: 't2',
    user: otherUsers[0],
    content: 'Tailwind CSS v4.0 is coming soon! Get ready for a whole new level of performance and developer experience. #tailwindcss',
    timestamp: '2024-07-22T09:30:00Z',
    replyCount: 50,
    retweetCount: 1200,
    likeCount: 8000,
    viewCount: 250000,
    mediaUrls: ['https://picsum.photos/seed/m1/600/400'],
  },
  {
    id: 't3',
    user: otherUsers[1],
    content: "We're excited to announce support for the new React Compiler in Vercel. Your Next.js apps are about to get even faster, automatically.",
    timestamp: '2024-07-21T18:45:00Z',
    replyCount: 88,
    retweetCount: 950,
    likeCount: 5500,
    viewCount: 180000,
  },
  {
    id: 't4',
    user: mockUser,
    content: 'Which color scheme do you prefer for coding?',
    timestamp: '2024-07-20T12:00:00Z',
    replyCount: 300,
    retweetCount: 50,
    likeCount: 600,
    viewCount: 22000,
    isBookmarked: true,
    poll: {
      id: 'p1',
      options: [
        { id: 'po1', text: 'Light Mode', votes: 1200 },
        { id: 'po2', text: 'Dark Mode', votes: 8500 },
        { id: 'po3', text: 'Something else', votes: 300 },
      ],
      endsAt: '2024-07-27T12:00:00Z',
      totalVotes: 10000
    }
  },
  {
    id: 't5',
    user: otherUsers[2],
    content: 'Starship is ready for its next flight.',
    timestamp: '2024-07-22T11:00:00Z',
    replyCount: 10000,
    retweetCount: 25000,
    likeCount: 200000,
    viewCount: 5000000,
    mediaUrls: ['https://picsum.photos/seed/m2/600/800', 'https://picsum.photos/seed/m3/600/800'],
  },
  { id: 't6', user: otherUsers[0], content: 'Video test!', timestamp: '2024-07-22T11:30:00Z', replyCount: 1, retweetCount: 2, likeCount: 3, viewCount: 100, mediaUrls: ['http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'] },
];

export const mockTweets = [...baseTweets, ...Array.from({ length: 10 }, (_, i) => ({ ...baseTweets[i % baseTweets.length], id: `t-more-${i}`}))];


export const mockTrendingTopics = [
    { category: 'Technology', topic: 'React 19', tweets: '15.2K', imageUrl: 'https://picsum.photos/seed/tr1/200/200' },
    { category: 'Web Development', topic: '#JavaScript', tweets: '125K', imageUrl: 'https://picsum.photos/seed/tr2/200/200' },
    { category: 'Business', topic: 'AI Revolution', tweets: '50K', imageUrl: 'https://picsum.photos/seed/tr3/200/200' },
    { category: 'Gaming', topic: 'New Console Release', tweets: '80K', imageUrl: 'https://picsum.photos/seed/tr4/200/200' },
];

export const mockNotifications: Notification[] = [
    { id: 'n1', type: 'like', user: otherUsers[0], tweet: baseTweets[0], timestamp: '2024-07-22T10:05:00Z' },
    { id: 'n2', type: 'retweet', user: otherUsers[1], tweet: baseTweets[0], timestamp: '2024-07-22T10:02:00Z' },
    { id: 'n3', type: 'follow', user: otherUsers[2], timestamp: '2024-07-22T09:50:00Z' },
    { id: 'n4', type: 'mention', user: otherUsers[0], tweet: { ...baseTweets[1], content: `Hey @${mockUser.username}, what do you think of this?`}, timestamp: '2024-07-21T20:00:00Z' },
];

const message1: Message = { id: 'msg1', senderId: 'u2', type: 'text', text: 'Hey, saw your new project. Looks great!', timestamp: '2024-07-22T11:00:00Z', isRead: false };
export const mockMessages: Record<string, Message[]> = {
    'c1': [
        message1,
        { id: 'msg2', senderId: 'u1', type: 'text', text: 'Thanks! Appreciate it.', timestamp: '2024-07-22T11:01:00Z', isRead: true, replyTo: message1 },
        { id: 'msg3', senderId: 'u2', type: 'voice', audioUrl: '/mock-audio.mp3', duration: 15, timestamp: '2024-07-22T11:02:00Z', isRead: false },
        { id: 'msg4', senderId: 'u1', type: 'gif', gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3dmaXRsdm9rZ2Z2d2FqMHk0am54ZWNpOHdza211MmV4bDl2d213bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VbnUQpnihPSIgIXuZv/giphy.gif', timestamp: '2024-07-22T11:03:00Z', isRead: true },
    ],
    'c2': [
        { id: 'msg5', senderId: 'u3', type: 'text', text: 'Quick question about the deployment.', timestamp: '2024-07-22T08:30:00Z', isRead: true },
    ],
    'c3': [
        { id: 'msg6', senderId: 'u4', type: 'text', text: '🚀', timestamp: '2024-07-21T15:00:00Z', isRead: true },
    ]
};

export const mockConversations: Conversation[] = [
    { id: 'c1', participant: otherUsers[0], lastMessage: mockMessages.c1[mockMessages.c1.length - 1], unreadCount: 2, isTyping: true },
    { id: 'c2', participant: otherUsers[1], lastMessage: mockMessages.c2[0], unreadCount: 0 },
    { id: 'c3', participant: otherUsers[2], lastMessage: mockMessages.c3[0], unreadCount: 0 },
];

export const mockCommunities: Community[] = [
    { id: 'com1', name: 'React Developers', description: 'A community for all things React. Ask questions, share projects, and connect with other developers.', avatarUrl: 'https://picsum.photos/seed/c1/200/200', bannerUrl: 'https://picsum.photos/seed/cb1/600/200', memberCount: 15000 },
    { id: 'com2', name: 'Design & Code', description: 'Where design meets development. For frontend developers and UI/UX designers.', avatarUrl: 'https://picsum.photos/seed/c2/200/200', bannerUrl: 'https://picsum.photos/seed/cb2/600/200', memberCount: 8000 },
];

export const userStories: UserStory[] = [
    {
        user: mockUser, hasUnseen: true, stories: [
            { id: 's1', mediaUrl: 'https://picsum.photos/seed/s1/400/700', duration: 5, timestamp: '2024-07-22T10:00:00Z' },
            { id: 's2', mediaUrl: 'https://picsum.photos/seed/s2/400/700', duration: 5, timestamp: '2024-07-22T11:00:00Z' }
        ]
    },
    ...otherUsers.map((user, i) => ({
        user, hasUnseen: true, stories: [
            { id: `s${i+3}`, mediaUrl: `https://picsum.photos/seed/s${i+3}/400/700`, duration: 5, timestamp: '2024-07-22T12:00:00Z' }
        ]
    }))
];

export const mockReels: Reel[] = [
    { id: 'r1', user: otherUsers[0], videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', caption: 'Having fun with CSS animations!', likeCount: 1200, commentCount: 45, shareCount: 120, isLiked: false },
    { id: 'r2', user: mockUser, videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', caption: 'My new setup is finally complete! What do you think? #desksetup #coding', likeCount: 5000, commentCount: 250, shareCount: 300, isLiked: true },
    { id: 'r3', user: otherUsers[1], videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', caption: 'Shipping a new feature on Vercel!', likeCount: 8000, commentCount: 400, shareCount: 600, isLiked: false },
];