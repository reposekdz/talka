
import { User, Tweet, Notification, Conversation, Message, Community, Story, UserStory, Reel, Space, Highlight } from '../types';

export const mockUser: User = {
  id: 'u1',
  username: 'reactdev',
  displayName: 'React Dev',
  avatarUrl: 'https://picsum.photos/seed/u1/200/200',
  bannerUrl: 'https://picsum.photos/seed/b1/1500/500',
  bio: 'Building things for the web with React & TypeScript. This is a frontend prototype. 🚀',
  location: 'The Web',
  website: 'github.com',
  followingCount: 5,
  followerCount: 5,
  verified: true,
  followingIds: ['u2', 'u4', 'u5', 'u6', 'u7'],
  followerIds: ['u2', 'u3', 'u5', 'u8', 'u6'],
  isOnline: true,
};

export const otherUsers: User[] = [
  { id: 'u2', username: 'tailwindcss', displayName: 'Tailwind CSS', avatarUrl: 'https://picsum.photos/seed/u2/200/200', followingCount: 1, followerCount: 1, verified: true, bio: 'A utility-first CSS framework for rapid UI development.', followingIds: ['u1'], followerIds: ['u1'], isOnline: true },
  { id: 'u3', username: 'vercel', displayName: 'Vercel', avatarUrl: 'https://picsum.photos/seed/u3/200/200', followingCount: 1, followerCount: 0, verified: true, bio: 'Develop. Preview. Ship.', followingIds: ['u1'], followerIds: [], isOnline: false },
  { id: 'u4', username: 'elonmusk', displayName: 'Elon Musk', avatarUrl: 'https://picsum.photos/seed/u4/200/200', followingCount: 0, followerCount: 1, verified: true, bio: 'Mars & Cars', followingIds: [], followerIds: ['u1'], isOnline: true },
  { id: 'u5', username: 'nasa', displayName: 'NASA', avatarUrl: 'https://picsum.photos/seed/u5/200/200', followingCount: 1, followerCount: 1, verified: true, bio: 'Exploring the universe and our home planet.', followingIds: ['u1'], followerIds: ['u1'], isOnline: true },
  { id: 'u6', username: 'natgeo', displayName: 'National Geographic', avatarUrl: 'https://picsum.photos/seed/u6/200/200', followingCount: 1, followerCount: 1, verified: true, bio: 'Experience the world through the eyes of our photographers, explorers, and filmmakers.', followingIds: ['u1'], followerIds: ['u1'], isOnline: false },
  { id: 'u7', username: 'figma', displayName: 'Figma', avatarUrl: 'https://picsum.photos/seed/u7/200/200', followingCount: 1, followerCount: 0, verified: true, bio: 'The collaborative interface design tool.', followingIds: ['u1'], followerIds: [], isOnline: true },
  { id: 'u8', username: 'codepen', displayName: 'CodePen', avatarUrl: 'https://picsum.photos/seed/u8/200/200', followingCount: 0, followerCount: 1, verified: true, bio: 'The best place to build, test, and discover front-end code.', followingIds: [], followerIds: ['u1'], isOnline: true },
];

export const baseTweets: Tweet[] = [
  {
    id: 't1',
    user: mockUser,
    content: 'Just launched a new version of Proto-Twitter! It includes a dark mode, dim mode, and a bunch of new features. Check it out and let me know what you think! #React #WebDev',
    timestamp: '2024-07-22T10:00:00Z',
    replyCount: 12,
    retweetCount: 45,
    likeCount: 250,
    shareCount: 18,
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
    shareCount: 550,
    viewCount: 250000,
    mediaUrls: ['https://picsum.photos/seed/m1/600/400'],
  },
    {
    id: 't-new-video',
    user: otherUsers[6],
    content: 'Mind-blowing CSS animation techniques you can use today. This Pen shows how to create a liquid loader. #CSS #CodePen',
    timestamp: '2024-07-24T18:00:00Z',
    replyCount: 33,
    retweetCount: 410,
    likeCount: 2100,
    shareCount: 150,
    viewCount: 95000,
    mediaUrls: ['http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4']
  },
  {
    id: 't-nasa-1',
    user: otherUsers[3],
    content: 'The James Webb Space Telescope has captured another stunning image of a distant galaxy. Look at the incredible detail! ✨ #JWST #Space',
    timestamp: '2024-07-23T14:00:00Z',
    replyCount: 500,
    retweetCount: 8000,
    likeCount: 45000,
    shareCount: 2000,
    viewCount: 1200000,
    mediaUrls: ['https://picsum.photos/seed/nasa1/800/600', 'https://picsum.photos/seed/nasa2/800/600'],
  },
  {
    id: 't3',
    user: otherUsers[1],
    content: "We're excited to announce support for the new React Compiler in Vercel. Your Next.js apps are about to get even faster, automatically.",
    timestamp: '2024-07-21T18:45:00Z',
    replyCount: 88,
    retweetCount: 950,
    likeCount: 5500,
    shareCount: 300,
    viewCount: 180000,
  },
  {
    id: 't-quote-1',
    user: mockUser,
    content: 'This is huge news for the React ecosystem!',
    timestamp: '2024-07-21T19:00:00Z',
    replyCount: 5,
    retweetCount: 10,
    likeCount: 80,
    shareCount: 3,
    viewCount: 2000,
    quotedTweet: {
        id: 't3',
        user: otherUsers[1],
        content: "We're excited to announce support for the new React Compiler in Vercel. Your Next.js apps are about to get even faster, automatically.",
        timestamp: '2024-07-21T18:45:00Z',
        replyCount: 88,
        retweetCount: 950,
        likeCount: 5500,
        shareCount: 300,
        viewCount: 180000,
    }
  },
  {
    id: 't-new-4grid',
    user: otherUsers[4],
    content: 'A few highlights from our recent expedition to the Amazon rainforest. The biodiversity is simply astounding. #NatGeo #Wildlife',
    timestamp: '2024-07-24T16:00:00Z',
    replyCount: 210,
    retweetCount: 4500,
    likeCount: 22000,
    shareCount: 1800,
    viewCount: 950000,
    mediaUrls: [
        'https://picsum.photos/seed/ng1/400/300',
        'https://picsum.photos/seed/ng2/400/300',
        'https://picsum.photos/seed/ng3/400/300',
        'https://picsum.photos/seed/ng4/400/300',
    ],
  },
  {
    id: 't4',
    user: mockUser,
    content: 'Which color scheme do you prefer for coding?',
    timestamp: '2024-07-20T12:00:00Z',
    replyCount: 300,
    retweetCount: 50,
    likeCount: 600,
    shareCount: 25,
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
    shareCount: 12000,
    viewCount: 5000000,
    mediaUrls: ['https://picsum.photos/seed/m2/600/800', 'https://picsum.photos/seed/m3/600/800'],
  },
  { 
    id: 't6', 
    user: otherUsers[0], 
    content: 'Check out this awesome video on how utility classes can speed up your workflow.', 
    timestamp: '2024-07-22T11:30:00Z', 
    replyCount: 15, 
    retweetCount: 200, 
    likeCount: 950, 
    shareCount: 80,
    viewCount: 35000, 
    mediaUrls: ['http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'] 
  },
    {
    id: 't-new-voice',
    user: mockUser,
    content: 'Just sharing some quick thoughts on the new browser APIs coming in 2025. Very exciting stuff!',
    timestamp: '2024-07-24T14:30:00Z',
    replyCount: 8,
    retweetCount: 15,
    likeCount: 95,
    shareCount: 5,
    viewCount: 4500,
    isVoiceTweet: true,
    audioUrl: '/mock-audio.mp3'
  },
  {
    id: 't-natgeo-1',
    user: otherUsers[4],
    content: 'A lioness stalks her prey in the Serengeti. The patience and power of these animals is breathtaking. #wildlife #photography',
    timestamp: '2024-07-23T08:00:00Z',
    replyCount: 150,
    retweetCount: 3000,
    likeCount: 18000,
    shareCount: 1500,
    viewCount: 800000,
    mediaUrls: ['https://picsum.photos/seed/natgeo1/800/500'],
  },
  {
    id: 't-figma-1',
    user: otherUsers[5],
    content: 'Collaboration just got easier. Introducing live comments directly in your prototypes. Give feedback in context, instantly. @reactdev what do you think?',
    timestamp: '2024-07-23T10:00:00Z',
    replyCount: 200,
    retweetCount: 1500,
    likeCount: 9000,
    shareCount: 700,
    viewCount: 400000,
  },
  {
    id: 't-new-lifestyle',
    user: otherUsers[1],
    content: 'Weekend vibes. Time to disconnect and recharge. ☀️',
    timestamp: '2024-07-24T12:00:00Z',
    replyCount: 10,
    retweetCount: 5,
    likeCount: 150,
    shareCount: 3,
    viewCount: 8000,
    mediaUrls: ['https://picsum.photos/seed/lv1/500/500'],
  },
  {
    id: 't-codepen-1',
    user: otherUsers[6],
    content: 'We love seeing what you build! Check out this week\'s featured pen - a pure CSS recreation of the solar system. #CSSArt #CodePen',
    timestamp: '2024-07-23T12:00:00Z',
    replyCount: 80,
    retweetCount: 800,
    likeCount: 4000,
    shareCount: 450,
    viewCount: 250000,
  },
];

export const mockTweets = [...baseTweets, ...Array.from({ length: 100 }, (_, i) => ({ ...baseTweets[i % baseTweets.length], id: `t-more-${i}`}))];


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
    { id: 'c1', participant: otherUsers[0], lastMessage: mockMessages.c1[mockMessages.c1.length - 1], unreadCount: 2, isTyping: true, chatTheme: 'default-blue' },
    { id: 'c2', participant: otherUsers[1], lastMessage: mockMessages.c2[0], unreadCount: 0, chatTheme: 'sunset-orange' },
    { id: 'c3', participant: otherUsers[2], lastMessage: mockMessages.c3[0], unreadCount: 0, chatTheme: 'ocean-green' },
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
    {
        user: otherUsers[0], hasUnseen: true, stories: [
            { id: 's-u2-1', mediaUrl: `https://picsum.photos/seed/s-u2-1/400/700`, duration: 7, timestamp: '2024-07-24T12:00:00Z' },
            { id: 's-u2-2', mediaUrl: `https://picsum.photos/seed/s-u2-2/400/700`, duration: 5, timestamp: '2024-07-24T13:00:00Z' }
        ]
    },
     {
        user: otherUsers[1], hasUnseen: false, stories: [ // Seen story
            { id: 's-u3-1', mediaUrl: `https://picsum.photos/seed/s-u3-1/400/700`, duration: 6, timestamp: '2024-07-23T09:00:00Z' }
        ]
    },
    {
        user: otherUsers[2], hasUnseen: true, stories: [
            { id: 's-u4-1', mediaUrl: `https://picsum.photos/seed/s-u4-1/400/700`, duration: 5, timestamp: '2024-07-24T15:00:00Z' }
        ]
    },
    {
        user: otherUsers[3], hasUnseen: true, stories: [
            { id: 's-u5-1', mediaUrl: `https://picsum.photos/seed/s-u5-1/400/700`, duration: 8, timestamp: '2024-07-24T11:00:00Z' },
            { id: 's-u5-2', mediaUrl: `https://picsum.photos/seed/s-u5-2/400/700`, duration: 4, timestamp: '2024-07-24T11:30:00Z' },
            { id: 's-u5-3', mediaUrl: `https://picsum.photos/seed/s-u5-3/400/700`, duration: 6, timestamp: '2024-07-24T12:30:00Z' }
        ]
    },
    ...otherUsers.slice(4).map((user, i) => ({ // Remaining users
        user, hasUnseen: true, stories: [
            { id: `s${i+6}`, mediaUrl: `https://picsum.photos/seed/s${i+6}/400/700`, duration: 5, timestamp: '2024-07-22T12:00:00Z' }
        ]
    }))
];

export const mockHighlights: Highlight[] = [
  {
    id: 'h1',
    title: 'Projects',
    coverUrl: 'https://picsum.photos/seed/h1/200/200',
    stories: [
      { id: 's-h1-1', mediaUrl: 'https://picsum.photos/seed/s-h1-1/400/700', duration: 5, timestamp: '' },
      { id: 's-h1-2', mediaUrl: 'https://picsum.photos/seed/s-h1-2/400/700', duration: 5, timestamp: '' },
    ]
  },
  {
    id: 'h2',
    title: 'Travel',
    coverUrl: 'https://picsum.photos/seed/h2/200/200',
    stories: [
       { id: 's-h2-1', mediaUrl: 'https://picsum.photos/seed/s-h2-1/400/700', duration: 5, timestamp: '' },
    ]
  },
];

export const mockReels: Reel[] = [
    { 
        id: 'r1', 
        user: otherUsers[0], 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
        caption: 'Having fun with CSS animations! #css #webdev', 
        likeCount: 1200, 
        dislikeCount: 15,
        commentCount: 45, 
        shareCount: 120, 
        isLiked: false,
        isDisliked: false,
        isBookmarked: false,
        comments: [
            { id: 'rc1-1', user: otherUsers[1], text: "So cool!", timestamp: "2h", likeCount: 15, isLiked: false },
            { id: 'rc1-2', user: mockUser, text: "Love the colors!", timestamp: "1h", likeCount: 8, isLiked: true },
        ]
    },
    { 
        id: 'r2', 
        user: mockUser, 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', 
        caption: 'My new setup is finally complete! What do you think? #desksetup #coding', 
        likeCount: 5000, 
        dislikeCount: 120,
        commentCount: 250, 
        shareCount: 300, 
        isLiked: true,
        isDisliked: false,
        isBookmarked: true,
        comments: [
            { id: 'rc2-1', user: otherUsers[2], text: "Clean setup! 🚀", timestamp: "3h", likeCount: 50, isLiked: false },
        ]
    },
    { 
        id: 'r3', 
        user: otherUsers[1], 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', 
        caption: 'Shipping a new feature on Vercel!', 
        likeCount: 8000, 
        dislikeCount: 50,
        commentCount: 400, 
        shareCount: 600, 
        isLiked: false,
        isDisliked: false,
        isBookmarked: false,
        comments: [
            { id: 'rc3-1', user: mockUser, text: "Can't wait to try this out!", timestamp: "1d", likeCount: 150, isLiked: true },
            { id: 'rc3-2', user: otherUsers[0], text: "Game changer!", timestamp: "1d", likeCount: 120, isLiked: false },
        ] 
    },
    { 
        id: 'r4', 
        user: otherUsers[4], 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 
        caption: 'A breathtaking view of the Grand Canyon. #nature #travel', 
        likeCount: 12000, 
        dislikeCount: 80,
        commentCount: 800, 
        shareCount: 1500, 
        isLiked: false,
        isDisliked: false,
        isBookmarked: false,
        comments: [] 
    },
    { 
        id: 'r5', 
        user: otherUsers[3], 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
        caption: 'Exploring the cosmos, one star at a time. #space #nasa', 
        likeCount: 25000, 
        dislikeCount: 100,
        commentCount: 1200, 
        shareCount: 3000, 
        isLiked: false,
        isDisliked: false,
        isBookmarked: true,
        comments: [] 
    },
    { 
        id: 'r6', 
        user: otherUsers[5], 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
        caption: 'The art of design is the art of communication. #design #figma', 
        likeCount: 9500, 
        dislikeCount: 40,
        commentCount: 600, 
        shareCount: 800, 
        isLiked: true,
        isDisliked: false,
        isBookmarked: false,
        comments: [] 
    },
    {
      id: 'r7',
      user: otherUsers[6],
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      caption: 'Code is poetry. #coding #developer',
      likeCount: 7800,
      dislikeCount: 30,
      commentCount: 550,
      shareCount: 700,
      isLiked: false,
      isDisliked: false,
      isBookmarked: false,
      comments: [],
    },
    {
      id: 'r8',
      user: otherUsers[7],
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      caption: 'A day in the life of a frontend developer. #codepen',
      likeCount: 6200,
      dislikeCount: 25,
      commentCount: 450,
      shareCount: 500,
      isLiked: false,
      isDisliked: false,
      isBookmarked: false,
      comments: [],
    },
    {
      id: 'r9',
      user: mockUser,
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      caption: 'Working on some new animations for Proto-Twitter! #react #framer-motion',
      likeCount: 11000,
      dislikeCount: 90,
      commentCount: 900,
      shareCount: 1200,
      isLiked: true,
      isDisliked: false,
      isBookmarked: true,
      comments: [],
    },
    {
      id: 'r10',
      user: otherUsers[0],
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      caption: 'Just look at how easy it is to create this layout with Tailwind. #tailwindcss',
      likeCount: 15000,
      dislikeCount: 60,
      commentCount: 1100,
      shareCount: 1800,
      isLiked: false,
      isDisliked: false,
      isBookmarked: false,
      comments: [],
    },
    { 
        id: 'r11', 
        user: otherUsers[2], 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', 
        caption: 'Behind the scenes at our latest launch event. The energy was incredible!', 
        likeCount: 4200, 
        dislikeCount: 20,
        commentCount: 180, 
        shareCount: 250, 
        isLiked: false,
        isDisliked: false,
        isBookmarked: false,
        comments: []
    },
    { 
        id: 'r12', 
        user: otherUsers[5], 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', 
        caption: 'Quick tip for Figma users: use components to save yourself a ton of time. #designtips', 
        likeCount: 18000, 
        dislikeCount: 90,
        commentCount: 850, 
        shareCount: 1100, 
        isLiked: true,
        isDisliked: false,
        isBookmarked: true,
        comments: []
    },
     {
      id: 'r13',
      user: otherUsers[4],
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      caption: 'The beautiful landscapes of Iceland. #travel #iceland',
      likeCount: 22000,
      dislikeCount: 110,
      commentCount: 1300,
      shareCount: 2200,
      isLiked: false,
      isDisliked: false,
      isBookmarked: false,
      comments: [],
    },
    {
      id: 'r14',
      user: mockUser,
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      caption: 'Another quick coding challenge complete! #100DaysOfCode',
      likeCount: 980,
      dislikeCount: 10,
      commentCount: 55,
      shareCount: 80,
      isLiked: true,
      isDisliked: false,
      isBookmarked: false,
      comments: [],
    },
    {
      id: 'r15',
      user: otherUsers[3],
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      caption: 'Hubble vs. Webb. The difference is astounding.',
      likeCount: 55000,
      dislikeCount: 200,
      commentCount: 2400,
      shareCount: 4500,
      isLiked: false,
      isDisliked: false,
      isBookmarked: true,
      comments: [],
    },
    {
      id: 'r16',
      user: otherUsers[6],
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      caption: 'Trying out a new CSS feature: container queries!',
      likeCount: 3200,
      dislikeCount: 15,
      commentCount: 210,
      shareCount: 300,
      isLiked: false,
      isDisliked: false,
      isBookmarked: false,
      comments: [
          { id: 'rc16-1', user: mockUser, text: "Looks powerful!", timestamp: "1d", likeCount: 20, isLiked: true }
      ],
    },
    { 
        id: 'r17', 
        user: otherUsers[1], 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 
        caption: 'Warp speed deployments with Vercel. #frontend #devops', 
        likeCount: 11500, 
        dislikeCount: 80,
        commentCount: 600, 
        shareCount: 950, 
        isLiked: false,
        isDisliked: false,
        isBookmarked: false,
        comments: []
    },
    { 
        id: 'r18', 
        user: otherUsers[7], 
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
        caption: 'The perfect recipe for a weekend brunch. #food #recipe', 
        likeCount: 8800, 
        dislikeCount: 250,
        commentCount: 720, 
        shareCount: 1200, 
        isLiked: true,
        isDisliked: false,
        isBookmarked: false,
        comments: []
    },
];

export const mockSpaces: Space[] = [
    {
        id: 'sp1',
        title: 'Frontend Friday: React 19 and the Compiler',
        host: otherUsers[1],
        speakers: [otherUsers[1], mockUser, otherUsers[0]],
        listenerCount: 1250,
        color: 'bg-blue-500'
    },
    {
        id: 'sp2',
        title: 'Tech Talk: The Future of AI',
        host: otherUsers[2],
        speakers: [otherUsers[2], otherUsers[3]],
        listenerCount: 890,
        color: 'bg-green-500'
    }
];
