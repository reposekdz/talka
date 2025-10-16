import React from 'react';
import { motion } from 'framer-motion';

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-light-hover dark:bg-white/5 dim:bg-dim-hover p-4 rounded-lg w-full">
      <h3 className="font-bold mb-4">{title}</h3>
      <div className="flex justify-around items-end h-40 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 h-full">
            <motion.div
              className="w-full bg-twitter-blue rounded-t-md"
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
            <span className="text-xs mt-2 text-light-secondary-text dark:text-twitter-gray">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
