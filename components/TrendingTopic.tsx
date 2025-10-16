import React from 'react';
import { MoreIcon } from './Icon';

interface TrendingTopicProps {
  category: string;
  topic: string;
  tweets: string;
  imageUrl?: string;
}

const TrendingTopic: React.FC<TrendingTopicProps> = ({ category, topic, tweets, imageUrl }) => {
  if (imageUrl) {
    return (
        <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group">
            <img src={imageUrl} alt={topic} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:bg-black/50 transition-colors"></div>
            <div className="absolute bottom-2 left-2 right-2 text-white drop-shadow-lg">
                <p className="text-xs">{category} · Trending</p>
                <p className="font-bold text-sm">{topic}</p>
                <p className="text-xs">{tweets}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200">
      <div className="flex justify-between items-center">
        <p className="text-sm text-twitter-gray">{category} · Trending</p>
        <MoreIcon />
      </div>
      <p className="font-bold text-lg">{topic}</p>
      <p className="text-sm text-twitter-gray">{tweets}</p>
    </div>
  );
};

export default TrendingTopic;