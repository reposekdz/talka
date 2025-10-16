import React from 'react';
import { Poll } from '../types';
import { motion } from 'framer-motion';
import { CheckmarkCircleIcon } from './Icon';

interface PollDisplayProps {
  poll: Poll;
  votedOptionId: string | null | undefined;
  onVote: (optionId: string) => void;
}

const PollDisplay: React.FC<PollDisplayProps> = ({ poll, votedOptionId, onVote }) => {

  const timeRemaining = React.useMemo(() => {
      const endDate = new Date(poll.endsAt);
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) return "Poll ended";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days > 0) return `${days}d left`;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours > 0) return `${hours}h left`;
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m left`;
  }, [poll.endsAt]);

  return (
    <div className="mt-3 border border-light-border dark:border-twitter-border dim:border-dim-border rounded-2xl p-4 space-y-2">
      {poll.options.map(option => {
        const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
        const isVotedByUser = votedOptionId === option.id;

        return (
          <div key={option.id} onClick={() => !votedOptionId && onVote(option.id)} className={`relative ${!votedOptionId ? 'cursor-pointer' : ''}`}>
            <div className="relative z-10 flex justify-between items-center w-full border border-light-border dark:border-twitter-border dim:border-dim-border rounded-full px-4 py-2 text-left font-bold transition-colors hover:bg-light-hover dark:hover:bg-white/10 dim:hover:bg-dim-hover">
                <div className="flex items-center gap-2">
                    <span>{option.text}</span>
                    {isVotedByUser && <span className="text-twitter-blue"><CheckmarkCircleIcon/></span>}
                </div>
              {votedOptionId && <span>{percentage.toFixed(0)}%</span>}
            </div>
            {votedOptionId && (
              <motion.div
                className={`absolute top-0 left-0 h-full ${isVotedByUser ? 'bg-twitter-blue/30' : 'bg-twitter-blue/10'} rounded-full z-0`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            )}
          </div>
        );
      })}
      <div className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text pt-2">
        <span>{poll.totalVotes.toLocaleString()} votes</span> · <span>{timeRemaining}</span>
      </div>
    </div>
  );
};

export default PollDisplay;