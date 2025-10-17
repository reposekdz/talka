import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon } from './Icon';
import { AppSettings, User } from '../types';
import ToggleSwitch from './ToggleSwitch';

interface SettingsDetailViewProps {
  title: string;
  onBack: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdateProfileDetails: (updatedUser: Partial<User>) => void;
}

const SettingsSection: React.FC<{title: string; description?: string; children: React.ReactNode}> = ({ title, description, children }) => (
    <div className="p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {description && <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mt-1 mb-4">{description}</p>}
        <div className="mt-4 bg-light-hover/50 dark:bg-white/5 rounded-2xl overflow-hidden divide-y divide-light-border dark:divide-twitter-border dim:divide-dim-border">
          {children}
        </div>
    </div>
);

const SettingsRow: React.FC<{title: string; description: string; control: React.ReactNode}> = ({ title, description, control }) => (
    <div className="flex justify-between items-center p-4">
        <div className="max-w-[70%]">
            <h4 id={title.replace(/\s+/g, '-')} className="font-semibold">{title}</h4>
            <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">{description}</p>
        </div>
        <div className="flex-shrink-0">
          {control}
        </div>
    </div>
);

const SettingsOptionGroup: React.FC<{ options: {value: string, label: string}[], selected: string, onChange: (value: string) => void }> = ({ options, selected, onChange }) => (
  <div className="flex flex-col gap-2 p-4">
    {options.map(opt => (
      <button key={opt.value} onClick={() => onChange(opt.value)} className="flex justify-between items-center w-full text-left p-3 rounded-lg hover:bg-light-border dark:hover:bg-white/10">
        <span>{opt.label}</span>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === opt.value ? 'border-twitter-blue' : 'border-gray-500'}`}>
          {selected === opt.value && <div className="w-2.5 h-2.5 bg-twitter-blue rounded-full"></div>}
        </div>
      </button>
    ))}
  </div>
);


const SettingsDetailView: React.FC<SettingsDetailViewProps> = ({ title, onBack, settings, onUpdateSettings, onUpdateProfileDetails }) => {
    const [mutedWordInput, setMutedWordInput] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');

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
        case "Your account":
            return (
                 <div>
                    <SettingsSection title="Account Information" description="Update your public profile information.">
                        <div className="space-y-4 p-4">
                            <input type="text" placeholder="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-light-border dark:bg-twitter-light-dark rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-twitter-blue" />
                            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-light-border dark:bg-twitter-light-dark rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-twitter-blue" />
                            <button onClick={() => onUpdateProfileDetails({ displayName, username })} className="w-full bg-twitter-blue text-white font-bold py-2 rounded-full">Save Changes</button>
                        </div>
                    </SettingsSection>
                    <SettingsSection title="Deactivate your account">
                        <div className="p-4">
                           <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text mb-4">This is a temporary deactivation. Your profile, Posts, and other data will be hidden until you reactivate by logging back in.</p>
                           <button className="text-red-500 font-bold hover:underline">Deactivate (Prototype)</button>
                        </div>
                    </SettingsSection>
                 </div>
            );
        case "Security and account access":
            return (
                <div>
                    <SettingsSection title="Security">
                         <SettingsRow
                            title="Two-factor authentication"
                            description="Help protect your account from unauthorized access."
                            control={<ToggleSwitch
                                labelId="2fa-toggle"
                                isOn={settings.security.twoFactorEnabled}
                                handleToggle={() => handleUpdate('security', {...settings.security, twoFactorEnabled: !settings.security.twoFactorEnabled})}
                            />}
                        />
                    </SettingsSection>
                    <SettingsSection title="Connected apps">
                        <p className="p-4 text-sm text-light-secondary-text dark:text-twitter-gray">No apps connected. (This is a prototype feature).</p>
                    </SettingsSection>
                </div>
            );
        case "Privacy and safety":
            return (
                 <div>
                    <SettingsSection title="Audience and tagging">
                        <SettingsRow
                            title="Protect your Posts"
                            description="When selected, your Posts and other account information are only visible to people who follow you."
                            control={<ToggleSwitch
                                labelId="Protect-your-Posts"
                                isOn={settings.privacyAndSafety.protectPosts}
                                handleToggle={() => handleUpdate('privacyAndSafety', {...settings.privacyAndSafety, protectPosts: !settings.privacyAndSafety.protectPosts})}
                            />}
                        />
                    </SettingsSection>
                    <SettingsSection title="Photo tagging">
                         <SettingsOptionGroup 
                            options={[
                              { value: 'everyone', label: 'Anyone can tag you' },
                              { value: 'following', label: 'Only people you follow' },
                              { value: 'off', label: 'Off' }
                            ]}
                            selected={settings.privacyAndSafety.photoTagging}
                            onChange={(value) => handleUpdate('privacyAndSafety', {...settings.privacyAndSafety, photoTagging: value as any})}
                         />
                    </SettingsSection>
                 </div>
            );
        case "Notifications":
             return (
                 <div>
                     <SettingsSection title="Preferences">
                        <SettingsRow title="Likes" description="Receive notifications when someone likes your post." control={<ToggleSwitch labelId="likes-toggle" isOn={settings.notifications.likes} handleToggle={() => handleUpdate('notifications', {...settings.notifications, likes: !settings.notifications.likes})} />} />
                        <SettingsRow title="Retweets" description="Receive notifications when someone retweets your post." control={<ToggleSwitch labelId="retweets-toggle" isOn={settings.notifications.retweets} handleToggle={() => handleUpdate('notifications', {...settings.notifications, retweets: !settings.notifications.retweets})} />} />
                        <SettingsRow title="Direct Messages" description="Receive notifications for new direct messages." control={<ToggleSwitch labelId="dms-toggle" isOn={settings.notifications.dms} handleToggle={() => handleUpdate('notifications', {...settings.notifications, dms: !settings.notifications.dms})} />} />
                     </SettingsSection>
                    <SettingsSection title="Muted words">
                        <div className="p-4">
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
                        </div>
                    </SettingsSection>
                 </div>
            );
         case "Accessibility, display, and languages":
            return (
                 <div>
                    <SettingsSection title="Video autoplay">
                      <SettingsOptionGroup 
                          options={[
                            { value: 'on-cellular-wifi', label: 'On cellular or Wi-Fi' },
                            { value: 'on-wifi-only', label: 'On Wi-Fi only' },
                            { value: 'never', label: 'Never' }
                          ]}
                          selected={settings.accessibilityDisplayAndLanguages.videoAutoplay}
                          onChange={(value) => handleUpdate('accessibilityDisplayAndLanguages', {...settings.accessibilityDisplayAndLanguages, videoAutoplay: value as any})}
                       />
                    </SettingsSection>
                     <SettingsSection title="Accessibility">
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
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
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