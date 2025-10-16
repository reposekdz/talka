
import React from 'react';
import { mockNotifications } from '../data/mockData';
import { Notification } from '../types';
import { HeartFillIcon, RetweetFillIcon, ProfileIcon } from '../components/Icon';
import Avatar from '../components/Avatar';

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'like':
                return <HeartFillIcon />;
            case 'retweet':
                return <RetweetFillIcon />;
            case 'follow':
                return <ProfileIcon />;
            default:
                return null;
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
            default:
                return '';
        }
    }

    return (
        <div className="p-4 border-b border-twitter-border flex gap-4 hover:bg-white/5 transition-colors duration-200">
            <div className="w-8 text-center">
                {getIcon()}
            </div>
            <div className="flex-1">
                <Avatar src={notification.user.avatarUrl} alt={notification.user.displayName} size="small" />
                <p className="mt-2">
                    <span className="font-bold">{notification.user.displayName}</span> {getText()}
                </p>
                {notification.tweet && (
                    <p className="text-twitter-gray mt-1">{notification.tweet.content}</p>
                )}
            </div>
        </div>
    );
}

const NotificationsPage: React.FC = () => {
  return (
    <div>
        <div className="sticky top-0 bg-twitter-dark/80 backdrop-blur-md z-10">
            <h1 className="text-xl font-bold p-4">Notifications</h1>
        </div>
        <div>
            {mockNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </div>
    </div>
  );
};

export default NotificationsPage;
