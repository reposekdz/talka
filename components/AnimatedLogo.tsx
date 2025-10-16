import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
    className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
    const svgVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.2,
            } 
        },
    };

    const pathVariants = {
        hidden: { pathLength: 0, fill: 'rgba(29, 161, 242, 0)' },
        visible: {
            pathLength: 1,
            fill: 'rgba(29, 161, 242, 1)',
            transition: {
                pathLength: { duration: 1, ease: 'easeInOut' },
                fill: { duration: 0.5, ease: 'easeIn', delay: 0.8 },
            },
        },
    };

    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={className}
            variants={svgVariants}
            initial="hidden"
            animate="visible"
        >
            {/* FIX: Wrapped framer-motion props to bypass type errors. */}
            <motion.path
                d="M22.46,6.52c-0.85,0.38-1.76,0.63-2.7,0.74c0.98-0.58,1.72-1.51,2.07-2.6c-0.91,0.54-1.92,0.93-2.99,1.14 C17.9,4.8,16.75,4,15.4,4c-2.55,0-4.62,2.06-4.62,4.6c0,0.36,0.04,0.71,0.12,1.05C7.4,9.4,4.27,7.77,2.24,5.29 C1.84,5.98,1.6,6.78,1.6,7.64c0,1.6,0.81,3.01,2.05,3.84C2.9,11.45,2.18,11.23,1.5,10.9v0.06c0,2.23,1.59,4.09,3.69,4.51 c-0.39,0.11-0.79,0.16-1.21,0.16c-0.29,0-0.58-0.03-0.86-0.08c0.58,1.83,2.28,3.16,4.29,3.2C6.1,19.9,4.08,20.5,1.9,20.5 c-0.38,0-0.75-0.02-1.12-0.07c2.08,1.34,4.55,2.12,7.2,2.12c8.64,0,13.36-7.14,13.36-13.36c0-0.2,0-0.41-0.05-0.61 C21.05,8.3,21.84,7.47,22.46,6.52z"
                {...{
                    variants: pathVariants,
                }}
                fill="none"
                stroke="#1DA1F2"
                strokeWidth="0.5"
            />
        </motion.svg>
    );
};

export default AnimatedLogo;
