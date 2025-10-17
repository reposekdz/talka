import React from 'react';

interface LinkPreviewProps {
    url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
    let hostname = '';
    try {
        hostname = new URL(url).hostname;
    } catch (e) {
        hostname = url;
    }

    const mockTitle = `Link to ${hostname}`;
    const mockDescription = `This is a preview of the shared link. Click to open in a new tab.`;
    const mockImage = `https://picsum.photos/seed/${hostname}/500/261`;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 block border border-light-border dark:border-twitter-border dim:border-dim-border rounded-lg overflow-hidden no-underline hover:bg-light-hover dark:hover:bg-white/5 transition-colors max-w-sm">
            <img src={mockImage} alt="Link preview" className="w-full h-auto aspect-[1.91/1] object-cover" />
            <div className="p-3">
                <p className="text-xs text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text">{hostname}</p>
                <p className="font-bold text-sm text-light-text dark:text-dim-text truncate">{mockTitle}</p>
                <p className="text-sm text-light-secondary-text dark:text-twitter-gray dim:text-dim-secondary-text text-ellipsis line-clamp-2">{mockDescription}</p>
            </div>
        </a>
    );
};

export default LinkPreview;
