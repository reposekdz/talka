import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode, className?: string, viewBox?: string }> = ({ children, className = "w-6 h-6", viewBox = "0 0 24 24" }) => (
  <svg className={className} viewBox={viewBox} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

export const ProtoIcon: React.FC = () => (
    <IconWrapper className="w-8 h-8 text-twitter-blue" viewBox="0 0 24 24">
        <path d="M11.96 14.94c-.13 0-.26-.05-.35-.15l-3.23-3.23c-.2-.2-.2-.51 0-.71.2-.2.51-.2.71 0l2.12 2.12 4.24-4.24c.2-.2.51-.2.71 0 .2.2.2.51 0 .71l-5.3 5.3c-.1.1-.23.15-.35.15zM22.15 6.31l-3.37-3.37c-.56-.56-1.46-.56-2.02 0l-1.37 1.37c-.2.2-.2.51 0 .71.2.2.51.2.71 0l1.37-1.37c.18-.18.47-.18.65 0l3.37 3.37c.18.18.18.47 0 .65l-1.37 1.37c-.2.2-.2.51 0 .71.1.1.23.15.35.15s.26-.05.35-.15l1.37-1.37c.56-.56.56-1.46 0-2.02zm-15.69 9.66l-1.37 1.37c-.18.18-.47.18-.65 0l-3.37-3.37c-.18-.18-.18-.47 0-.65l1.37-1.37c.2-.2.51-.2.71 0 .2.2.2.51 0 .71l-1.37 1.37c-.01 0-.01.01 0 .01l3.37 3.37c.01 0 .01.01.01 0l1.37-1.37c.2-.2.51-.2.71 0 .2.2.2.51 0 .71zm4.24 4.24c-.13 0-.26-.05-.35-.15l-5.3-5.3c-.2-.2-.2-.51 0-.71.2-.2.51-.2.71 0l5.3 5.3c.2.2.2.51 0 .71-.1.1-.23.15-.35.15zm8.48-11.31l-9.9 9.9c-.2.2-.51.2-.71 0-.2-.2-.2-.51 0-.71l9.9-9.9c.2-.2.51-.2.71 0 .2.2.2.51 0 .71z"/>
    </IconWrapper>
);

export const HomeIcon: React.FC = () => <IconWrapper><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></IconWrapper>;
export const ExploreIcon: React.FC = () => <IconWrapper><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></IconWrapper>; // Placeholder - Using pause icon for demo
export const NotificationsIcon: React.FC = () => <IconWrapper><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></IconWrapper>;
export const MessagesIcon: React.FC = () => <IconWrapper><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></IconWrapper>;
export const ProfileIcon: React.FC = () => <IconWrapper><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></IconWrapper>;
export const MoreIcon: React.FC = () => <IconWrapper><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></IconWrapper>;
export const BookmarkIcon: React.FC = () => <IconWrapper><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></IconWrapper>;
export const ListIcon: React.FC = () => <IconWrapper><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></IconWrapper>;
export const CommunityIcon: React.FC = () => <IconWrapper><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></IconWrapper>;
export const ComposeIcon: React.FC = () => <IconWrapper><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></IconWrapper>;
export const ReelsIcon: React.FC = () => <IconWrapper><path d="M10 8v8l6-4-6-4zm10-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></IconWrapper>;
export const PhotoIcon: React.FC = () => <IconWrapper><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></IconWrapper>;
export const GifIcon: React.FC = () => <IconWrapper><path d="M11.5 9H13v6h-1.5zM9 9H6c-.6 0-1 .5-1 1v4c0 .5.4 1 1 1h3c.6 0 1-.5 1-1v-2H8.5v1.5h-2v-3H10V10c0-.5-.4-1-1-1zm10 1.5V9h-4.5v6H16v-2h2v-1.5h-2v-1z"/></IconWrapper>;
export const ChartBarIcon: React.FC = () => <IconWrapper><path d="M5 9.2h3V19H5zM10.6 5h3v14h-3zm5.6 8H19v6h-2.8z"/></IconWrapper>;
export const EmojiIcon: React.FC = () => <IconWrapper><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></IconWrapper>;
export const CalendarIcon: React.FC = () => <IconWrapper><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></IconWrapper>;
export const GlobeIcon: React.FC = () => <IconWrapper><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></IconWrapper>;
export const MicrophoneIcon: React.FC = () => <IconWrapper><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></IconWrapper>;
export const StopIcon: React.FC = () => <IconWrapper><path d="M6 6h12v12H6z"/></IconWrapper>;
export const TrashIcon: React.FC = () => <IconWrapper><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></IconWrapper>;
export const VerifiedIcon: React.FC = () => <IconWrapper className="w-5 h-5 text-twitter-blue"><path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.18L12 3 8.6 1.52 6.71 4.7 3.1 5.52l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.18L12 21l3.4 1.48 1.89-3.18 3.61-.82-.34-3.7L23 12zm-10 5l-4-4 1.41-1.41L13 14.17l6.59-6.59L21 9l-8 8z"/></IconWrapper>;
export const ReplyIcon: React.FC = () => <IconWrapper><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></IconWrapper>;
export const RetweetIcon: React.FC = () => <IconWrapper><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></IconWrapper>;
export const LikeIcon: React.FC = () => <IconWrapper><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></IconWrapper>;
export const ShareIcon: React.FC = () => <IconWrapper><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.18c.52.47 1.2.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.82C7.52 9.34 6.81 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.81 0 1.52-.34 2.04-.82l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></IconWrapper>;
export const PinIcon: React.FC = () => <IconWrapper className="w-4 h-4"><path d="M16 9V4h1V2H7v2h1v5l-2 2v2h5.2v7h1.6v-7H18v-2l-2-2z"/></IconWrapper>;
export const BookmarkFillIcon: React.FC = () => <IconWrapper><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></IconWrapper>;
export const SearchIcon: React.FC = () => <IconWrapper><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></IconWrapper>;
export const HeartFillIcon: React.FC = () => <IconWrapper className="text-red-500"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></IconWrapper>;
export const RetweetFillIcon: React.FC = () => <IconWrapper className="text-green-500"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></IconWrapper>;
export const ChevronLeftIcon: React.FC = () => <IconWrapper><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></IconWrapper>;
export const SettingsIcon: React.FC = () => <IconWrapper><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></IconWrapper>;
export const CreatorStudioIcon: React.FC = () => <IconWrapper><path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/></IconWrapper>;
export const DisplayIcon: React.FC = () => <IconWrapper><path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/></IconWrapper>;
export const HelpIcon: React.FC = () => <IconWrapper><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></IconWrapper>;
export const MonetizationIcon: React.FC = () => <IconWrapper><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2z"/></IconWrapper>; // Placeholder
export const CheckmarkCircleIcon: React.FC = () => <IconWrapper className="w-5 h-5 text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></IconWrapper>;
export const PlusIcon: React.FC = () => <IconWrapper><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></IconWrapper>;
export const VideoCallIcon: React.FC = () => <IconWrapper className="w-16 h-16"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></IconWrapper>;
export const PauseIcon: React.FC = () => <IconWrapper><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></IconWrapper>;
export const PlayIcon: React.FC = () => <IconWrapper><path d="M8 5v14l11-7z"/></IconWrapper>;
export const SendIcon: React.FC = () => <IconWrapper><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></IconWrapper>;
export const AddReactionIcon: React.FC = () => <IconWrapper className="w-5 h-5"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 12h-2v-2h-2v2H8v-2H6v2H4V4h16v10z"/></IconWrapper>; // Placeholder
export const ReadReceiptIcon: React.FC = () => <IconWrapper className="w-4 h-4"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></IconWrapper>;
export const PaperPlaneIcon: React.FC = () => <IconWrapper><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></IconWrapper>;
export const CloseIcon: React.FC = () => <IconWrapper><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></IconWrapper>;
export const AccountIcon: React.FC = () => <IconWrapper><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></IconWrapper>;
export const SecurityIcon: React.FC = () => <IconWrapper><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></IconWrapper>;
export const PrivacyIcon: React.FC = () => <IconWrapper><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></IconWrapper>; // Same as profile
export const ChevronRightIcon: React.FC = () => <IconWrapper><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></IconWrapper>;
export const AnalyticsIcon: React.FC = () => <IconWrapper><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></IconWrapper>;
export const PeopleIcon: React.FC = () => <IconWrapper><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></IconWrapper>;
export const ExpandIcon: React.FC = () => <IconWrapper><path d="M4 20h4v-4H4v4zm0-6h4v-4H4v4zm0-6h4V4H4v4zm6 12h4v-4h-4v4zm0-6h4v-4h-4v4zm0-6h4V4h-4v4zm10 0v4h4V4h-4zm0 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></IconWrapper>; // Placeholder

export default IconWrapper;
