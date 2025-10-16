import React, { useState } from 'react';
import { Theme } from '../types';
import { CheckmarkCircleIcon } from './Icon';

interface DisplayModalProps {
  onClose: () => void;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const DisplayModal: React.FC<DisplayModalProps> = ({ onClose, currentTheme, setTheme }) => {
  const [accentColor, setAccentColor] = useState('blue');
  const [fontSize, setFontSize] = useState(2); // 0-4 scale

  const themes: { name: Theme; label: string; bgClass: string; textClass: string;}[] = [
    { name: 'light', label: 'Default', bgClass: 'bg-light-bg', textClass: 'text-light-text' },
    { name: 'dim', label: 'Dim', bgClass: 'bg-dim-bg', textClass: 'text-dim-text' },
    { name: 'dark', label: 'Lights out', bgClass: 'bg-twitter-dark', textClass: 'text-white' },
  ];

  const colors = [
    { name: 'blue', class: 'bg-twitter-blue' },
    { name: 'yellow', class: 'bg-yellow-400' },
    { name: 'pink', class: 'bg-pink-500' },
    { name: 'purple', class: 'bg-purple-500' },
    { name: 'orange', class: 'bg-orange-500' },
    { name: 'green', class: 'bg-green-500' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg rounded-2xl w-[600px] max-w-[90vw] p-8 shadow-lg overflow-y-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center mb-2">Customize your view</h2>
        <p className="text-center text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mb-6">
          These settings affect all the Talka accounts on this browser.
        </p>

        <div className="bg-light-border/50 dark:bg-twitter-light-dark/50 dim:bg-dim-border/50 p-4 rounded-2xl mb-4">
          <h3 className="font-bold text-center mb-1">Font size</h3>
          <div className="flex items-center justify-between bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg p-4 rounded-lg">
            <span className="text-sm">Aa</span>
            <div className="w-full mx-4 flex items-center">
              <input 
                type="range" 
                min="0" 
                max="4" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#1DA1F2' }}
              />
            </div>
            <span className="text-2xl">Aa</span>
          </div>
        </div>

        <div className="bg-light-border/50 dark:bg-twitter-light-dark/50 dim:bg-dim-border/50 p-4 rounded-2xl mb-4">
            <h3 className="font-bold text-center mb-4">Color</h3>
            <div className="flex justify-around items-center bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg p-4 rounded-lg">
                {colors.map(color => (
                     <button
                        key={color.name}
                        onClick={() => setAccentColor(color.name)}
                        className={`w-10 h-10 rounded-full ${color.class} flex items-center justify-center`}
                    >
                        {accentColor === color.name && <CheckmarkCircleIcon />}
                    </button>
                ))}
            </div>
        </div>

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