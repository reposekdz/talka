
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon } from './Icon';
import { AppSettings } from '../types';
import ToggleSwitch from './ToggleSwitch';

interface SettingsDetailViewProps {
  title: string;
  onBack: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const SettingsSection: React.FC<{title: string; description: string; children: React.ReactNode}> = ({ title, description, children }) => (
    <div className="border-b border-light-border dark:border-twitter-border dim:border-dim-border p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-1 mb-4">{description}</p>
        <div className="space-y-4">{children}</div>
    </div>
);

const SettingsRow: React.FC<{title: string; description: string; control: React.ReactNode}> = ({ title, description, control }) => (
    <div className="flex justify-between items-center">
        <div>
            <h4 id={title.replace(/\s+/g, '-')} className="font-semibold">{title}</h4>
            <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">{description}</p>
        </div>
        {control}
    </div>
)


const SettingsDetailView: React.FC<SettingsDetailViewProps> = ({ title, onBack, settings, onUpdateSettings }) => {
    const [mutedWordInput, setMutedWordInput] = useState('');

    const handleUpdate = (key: keyof AppSettings, value: any) => {
        onUpdateSettings({
            ...settings,
            [key]: value,
        });
    };
    
    const addMutedWord = () => {
        if (mutedWordInput && !settings.notifications.mutedWords.includes(mutedWordInput.toLowerCase())) {
            handleUpdate('notifications', {
                ...settings.notifications,
                mutedWords: [...settings.notifications.mutedWords, mutedWordInput.toLowerCase()]
            });
            setMutedWordInput('');
        }
    };
    
    const removeMutedWord = (wordToRemove: string) => {
         handleUpdate('notifications', {
            ...settings.notifications,
            mutedWords: settings.notifications.mutedWords.filter(word => word !== wordToRemove)
        });
    };

  const renderContent = () => {
    switch(title) {
        case "Privacy and safety":
            return (
                 <div>
                    <SettingsSection title="Audience and tagging" description="Manage what information you allow other people on Proto-Twitter to see.">
                        <SettingsRow
                            title="Protect your Posts"
                            description="When selected, your Tweets and other account information are only visible to people who follow you."
                            control={<ToggleSwitch
                                labelId="Protect-your-Posts"
                                isOn={settings.privacyAndSafety.protectPosts}
                                handleToggle={() => handleUpdate('privacyAndSafety', {...settings.privacyAndSafety, protectPosts: !settings.privacyAndSafety.protectPosts})}
                            />}
                        />
                         <SettingsRow
                            title="Photo tagging"
                            description="Choose whether people can tag you in photos."
                            control={
                                <select 
                                    value={settings.privacyAndSafety.photoTagging}
                                    onChange={(e) => handleUpdate('privacyAndSafety', {...settings.privacyAndSafety, photoTagging: e.target.value as any})}
                                    className="bg-transparent border border-light-border dark:border-twitter-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                                >
                                    <option value="everyone">Anyone can tag you</option>
                                    <option value="following">Only people you follow</option>
                                    <option value="off">Off</option>
                                </select>
                            }
                        />
                    </SettingsSection>
                    <SettingsSection title="Direct Messages" description="Control who can message you directly.">
                        <SettingsRow
                            title="Allow message requests from"
                            description="Let people who you don’t follow send you message requests and add you to group conversations."
                            control={<select 
                                    value={settings.privacyAndSafety.dmRequests}
                                    onChange={(e) => handleUpdate('privacyAndSafety', {...settings.privacyAndSafety, dmRequests: e.target.value as any})}
                                    className="bg-transparent border border-light-border dark:border-twitter-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="following">People you follow</option>
                                </select>}
                        />
                    </SettingsSection>
                 </div>
            );
        case "Notifications":
             return (
                 <div>
                    <SettingsSection title="Muted words" description="Mute words, phrases, usernames, emojis, or hashtags from your Home timeline.">
                        <div className="flex gap-2">
                             <input
                                type="text"
                                placeholder="Add muted word..."
                                value={mutedWordInput}
                                onChange={e => setMutedWordInput(e.target.value)}
                                className="w-full bg-light-border dark:bg-twitter-light-dark rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                            />
                            <button onClick={addMutedWord} className="bg-twitter-blue text-white font-bold px-4 rounded-full hover:bg-opacity-90 disabled:opacity-50" disabled={!mutedWordInput}>Add</button>
                        </div>
                        <div className="mt-4 space-y-2">
                            {settings.notifications.mutedWords.map(word => (
                                <div key={word} className="flex justify-between items-center bg-light-hover dark:bg-white/5 p-2 rounded-lg">
                                    <span>{word}</span>
                                    <button onClick={() => removeMutedWord(word)} className="font-bold text-xl hover:text-red-500">&times;</button>
                                </div>
                            ))}
                        </div>
                    </SettingsSection>
                 </div>
            );
         case "Accessibility, display, and languages":
            return (
                 <div>
                    <SettingsSection title="Data usage" description="Control how Proto-Twitter uses your mobile data.">
                        <SettingsRow
                            title="Video autoplay"
                            description="Select whether videos should autoplay."
                            control={
                                <select
                                    value={settings.accessibilityDisplayAndLanguages.videoAutoplay}
                                    onChange={(e) => handleUpdate('accessibilityDisplayAndLanguages', {...settings.accessibilityDisplayAndLanguages, videoAutoplay: e.target.value as any})}
                                    className="bg-transparent border border-light-border dark:border-twitter-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                                >
                                    <option value="on-cellular-wifi">On cellular or Wi-Fi</option>
                                    <option value="on-wifi-only">On Wi-Fi only</option>
                                    <option value="never">Never</option>
                                </select>
                            }
                        />
                    </SettingsSection>
                     <SettingsSection title="Accessibility" description="Manage settings for users with disabilities.">
                        <SettingsRow
                            title="Reduce motion"
                            description="Limits the amount of in-app animations, including live-like counts."
                            control={<ToggleSwitch
                                labelId="Reduce-motion"
                                isOn={settings.accessibilityDisplayAndLanguages.reduceMotion}
                                handleToggle={() => handleUpdate('accessibilityDisplayAndLanguages', {...settings.accessibilityDisplayAndLanguages, reduceMotion: !settings.accessibilityDisplayAndLanguages.reduceMotion})}
                            />}
                        />
                    </SettingsSection>
                 </div>
            );
        default:
            return <p className="p-4 text-light-secondary-text dark:text-twitter-gray">Settings for {title} would be here.</p>;
    }
  }
  
  return (
    // FIX: Wrapped framer-motion props to bypass type errors.
    <motion.div
      {...{
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        transition: { type: 'tween', ease: 'easeInOut', duration: 0.3 },
      }}
      className="absolute top-0 left-0 w-full h-full bg-light-bg dark:bg-twitter-dark dim:bg-dim-bg flex flex-col"
    >
      <div className="sticky top-0 flex items-center gap-4 p-2 md:p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 hover:bg-light-hover dark:hover:bg-white/10 rounded-full"><ChevronLeftIcon /></button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default SettingsDetailView;
