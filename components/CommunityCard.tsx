import React from 'react';
import { Community, User } from '../types';

interface CommunityCardProps {
  community: Community;
  allUsers: User[];
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, allUsers }) => {
  const members = allUsers.filter(u => community.memberIds.includes(u.id)).slice(0, 4);

  return (
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer bg-light-hover dark:bg-twitter-light-dark dim:bg-dim-hover h-64 flex flex-col justify-end p-4 text-white">
        <img src={community.bannerUrl} alt={community.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <div className="relative z-10">
            <img src={community.avatarUrl} alt={community.name} className="w-12 h-12 rounded-lg border-2 border-white/50 mb-2" />
            <h3 className="font-extrabold text-xl drop-shadow-lg">{community.name}</h3>
            <p className="text-xs opacity-90 drop-shadow-sm">{community.memberCount.toLocaleString()} members</p>
            
            <div className="flex items-center justify-between mt-3">
                <div className="flex -space-x-2">
                    {members.map(member => (
                        <img key={member.id} src={member.avatarUrl} alt={member.displayName} className="w-7 h-7 rounded-full border-2 border-black/50" />
                    ))}
                </div>
                <button className="bg-white text-black font-bold px-4 py-1.5 text-sm rounded-full hover:bg-opacity-90 transition-colors">
                    Join
                </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-4">
                {community.tags.map(tag => (
                    <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">{tag}</span>
                ))}
            </div>
        </div>
    </div>
  );
};

export default CommunityCard;
