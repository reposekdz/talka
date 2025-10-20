import React from 'react';
import { motion } from 'framer-motion';

interface SearchFiltersProps {
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
}

const filters = ["From people you follow", "Near you", "Media"];

const SearchFilters: React.FC<SearchFiltersProps> = ({ activeFilters, onToggleFilter }) => {
  return (
    <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-light-border dark:border-twitter-border dim:border-dim-border">
      {filters.map(filter => {
        const isActive = activeFilters.includes(filter);
        return (
          <motion.button
            key={filter}
            onClick={() => onToggleFilter(filter)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border ${
              isActive
                ? 'bg-twitter-blue border-twitter-blue text-white'
                : 'bg-transparent border-light-border dark:border-twitter-border hover:bg-light-hover dark:hover:bg-white/10'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {filter}
          </motion.button>
        );
      })}
    </div>
  );
};

export default SearchFilters;