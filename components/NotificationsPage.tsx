

import React from 'react';
import { mockNotifications } from '../data/mockData';
import { Notification } from '../types';
import { HeartFillIcon, RetweetFillIcon, ProfileIcon, MessagesIcon } from '../components/Icon';
import Avatar from './Avatar';
import { motion } from 'framer-motion';

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'like':
                return <HeartFillIcon className="text-red-500" />;
            case 'story_like':
                 return <HeartFillIcon className="text-red-500" />;
            case 'retweet':
                return <RetweetFillIcon className="text-green-500" />;
            case 'follow':
                return <ProfileIcon className="text-twitter-blue" />;
            case 'story_comment':
                return <MessagesIcon className="text-twitter-blue" />;
            default:
                return <MessagesIcon className="text-twitter-blue" />;
        }
    };

    const getText = () => {
        switch (notification.type) {
            case 'like':
                return <>liked your tweet</>;
            case 'retweet':
                return <>retweeted your tweet</>;
            case 'follow':
                return <>followed you</>;
            case 'mention':
                 return <>mentioned you in a tweet</>;
            case 'story_like':
                return <>liked your story</>;
            case 'story_comment':
                return <>commented on your story: <span className="text-light-secondary-text dark:text-twitter-gray italic">"{notification.commentText}"</span></>;
            default:
                return '';
        }
    }

    const contextContent = () => {
        if (notification.tweet) {
            return <p className="text-light-secondary-text dark:text-twitter-gray mt-1">{notification.tweet.content}</p>
        }
        if (notification.story) {
            return (
                <div className="mt-2 w-24 h-36 rounded-lg overflow-hidden">
                     <img src={notification.story.mediaUrl} alt="story media" className="w-full h-full object-cover" />
                </div>
            )
        }
        return null;
    }

    return (
        <motion.div variants={itemVariants} className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex gap-4 hover:bg-white/5 transition-colors duration-200 cursor-pointer">
            <div className="w-8 text-center flex-shrink-0">
                {getIcon()}
            </div>
            <div className="flex-1">
                <Avatar src={notification.user.avatarUrl} alt={notification.user.displayName} size="small" />
                <p className="mt-2">
                    <span className="font-bold">{notification.user.displayName}</span> {getText()}
                </p>
                {contextContent()}
                {(notification.tweet || notification.story) && (
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-2 text-sm text-twitter-blue font-semibold px-3 py-1 rounded-full border border-twitter-blue hover:bg-twitter-blue/10"
                    >
                        View
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

const NotificationsPage: React.FC = () => {
  return (
    <div>
        <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
            <h1 className="text-xl font-bold p-4">Notifications</h1>
        </div>
        <motion.div variants={listVariants} initial="hidden" animate="visible">
            {mockNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </motion.div>
    </div>
  );
};

export default NotificationsPage;