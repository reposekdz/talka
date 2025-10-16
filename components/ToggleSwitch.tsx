import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  labelId: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle, labelId }) => {
  return (
    <button
      aria-labelledby={labelId}
      aria-pressed={isOn}
      onClick={handleToggle}
      className={`relative inline-flex flex-shrink-0 items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-twitter-blue dark:focus:ring-offset-twitter-dark ${isOn ? 'bg-twitter-blue' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
};

export default ToggleSwitch;
