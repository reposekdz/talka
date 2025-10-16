import React from 'react';
import { Theme } from '../types';
import { CheckmarkCircleIcon } from './Icon';

interface DisplayModalProps {
  onClose: () => void;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const DisplayModal: React.FC<DisplayModalProps> = ({ onClose, currentTheme, setTheme }) => {
  const themes: { name: Theme; label: string; bgClass: string; textClass: string;}[] = [
    { name: 'light', label: 'Default', bgClass: 'bg-light-bg', textClass: 'text-light-text' },
    { name: 'dim', label: 'Dim', bgClass: 'bg-dim-bg', textClass: 'text-dim-text' },
    { name: 'dark', label: 'Lights out', bgClass: 'bg-twitter-dark', textClass: 'text-white' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-2xl w-[600px] max-w-[90vw] p-8 shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center mb-2">Customize your view</h2>
        <p className="text-center text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mb-6">
          These settings affect all the Proto-Twitter accounts on this browser.
        </p>

        <div className="bg-light-border/50 dark:bg-twitter-light-dark/50 dim:bg-dim-border/50 p-4 rounded-2xl">
            <h3 className="font-bold mb-4 text-center">Background</h3>
            <div className="flex justify-around gap-4">
                {themes.map(theme => (
                    <div 
                        key={theme.name}
                        onClick={() => setTheme(theme.name)}
                        className={`flex-1 p-4 rounded-lg cursor-pointer border-2 ${currentTheme === theme.name ? 'border-twitter-blue' : 'border-transparent'} ${theme.bgClass}`}
                    >
                       <div className="flex items-center justify-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${currentTheme === theme.name ? 'bg-twitter-blue border-twitter-blue' : 'border-gray-500'}`}>
                                {currentTheme === theme.name && <CheckmarkCircleIcon/>}
                            </div>
                            <span className={`font-bold ${theme.textClass}`}>{theme.label}</span>
                       </div>
                    </div>
                ))}
            </div>
        </div>

        <button 
            onClick={onClose}
            className="w-full mt-8 bg-twitter-blue text-white font-bold py-3 rounded-full hover:bg-opacity-90"
        >
            Done
        </button>
      </div>
    </div>
  );
};

export default DisplayModal;
