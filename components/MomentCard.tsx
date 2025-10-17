
import React from 'react';
import { Moment } from '../types';
import { motion } from 'framer-motion';

interface MomentCardProps {
    moment: Moment;
}

const MomentCard: React.FC<MomentCardProps> = ({ moment }) => {
    const { user, content } = moment;

    return (
        <div className="flex-shrink-0">
            <motion.div
                className="relative w-28 h-48 rounded-xl overflow-hidden cursor-pointer group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
                {content.imageUrl ? (
                    <img src={content.imageUrl} alt="Moment" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full" style={{ background: content.background || 'linear-gradient(to top right, #6b7280, #1f2937)' }} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-2">
                    <img src={user.avatarUrl} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-white/80" />
                    <p className="text-white text-xs font-bold leading-tight line-clamp-4 break-words">
                        {content.text}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default MomentCard;
