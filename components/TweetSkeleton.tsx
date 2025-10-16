import React from 'react';

const TweetSkeleton: React.FC = () => {
  return (
    <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-light-border dark:bg-twitter-light-dark animate-pulse"></div>
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1/4 bg-light-border dark:bg-twitter-light-dark rounded animate-pulse"></div>
          <div className="h-4 w-1/3 bg-light-border dark:bg-twitter-light-dark rounded animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-light-border dark:bg-twitter-light-dark rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-light-border dark:bg-twitter-light-dark rounded animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center mt-3">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="h-6 w-10 bg-light-border dark:bg-twitter-light-dark rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TweetSkeleton;
