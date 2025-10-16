import React from 'react';
import { TalkaIcon } from '../components/Icon';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-twitter-dark">
      <div className="bg-twitter-light-dark p-8 rounded-2xl max-w-sm w-full text-center shadow-lg">
        <div className="text-twitter-blue mx-auto mb-6">
            <TalkaIcon className="w-12 h-12 mx-auto" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Welcome to Talka</h1>
        <p className="text-twitter-gray mb-8">This is a frontend prototype. Click below to log in with a mock user.</p>
        
        <button 
          onClick={onLogin}
          className="w-full bg-twitter-blue text-white font-bold py-3 px-4 rounded-full hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105"
        >
          Log in as Demo User
        </button>

        <div className="mt-8 text-xs text-twitter-gray">
            <p>Built with React & Tailwind CSS.</p>
            <p>No backend is connected. All data is mocked.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;