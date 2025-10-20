import React from 'react';
import { TalkaIcon } from '../components/Icon';
import { motion } from 'framer-motion';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-twitter-dark p-4">
       <div className="absolute inset-0 -z-10 bg-aurora from-blue-900 via-purple-900 to-pink-900 bg-[size:400%_400%] animate-aurora" />
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-twitter-light-dark/50 backdrop-blur-lg border border-twitter-border/50 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl"
      >
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="text-twitter-blue mx-auto mb-6"
        >
            <TalkaIcon className="w-12 h-12 mx-auto" />
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-extrabold mb-2"
        >
            Welcome to Talka
        </motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-twitter-gray mb-8"
        >
            This is a frontend prototype. Click below to log in with a mock user.
        </motion.p>
        
        <motion.button 
          onClick={onLogin}
          className="w-full bg-interactive-gradient text-white font-bold py-3 px-4 rounded-full transition-all duration-200 bg-[size:200%_auto] animate-gradient-shift"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(29, 161, 242, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Log in as Demo User
        </motion.button>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-xs text-twitter-gray"
        >
            <p>Built with React & Tailwind CSS.</p>
            <p>No backend is connected. All data is mocked.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;