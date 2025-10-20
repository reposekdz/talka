import React from 'react';

interface TrendingTopicProps {
  category: string;
  topic: string;
  tweets: string;
  imageUrl?: string;
}

const TrendingTopic: React.FC<TrendingTopicProps> = ({ category, topic, tweets, imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group">
        <img src={imageUrl} alt={topic} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:bg-black/50 transition-colors"></div>
        <div className="absolute bottom-2 left-2 right-2 text-white drop-shadow-lg">
            <p className="text-xs">{category} · Trending</p>
            <p className="font-bold text-sm truncate">{topic}</p>
        </div>
    </div>
  );
};

export default TrendingTopic;