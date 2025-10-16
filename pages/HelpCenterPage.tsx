import React from 'react';
import AccordionItem from '../components/AccordionItem';
import { SearchIcon } from '../components/Icon';

const HelpCenterPage: React.FC = () => {
  const faqs = {
    "Getting Started": [
      { q: "How do I create an account?", a: "This is a prototype, so you are logged in automatically with a mock user. In a real application, you would sign up with an email and password." },
      { q: "How do I customize my profile?", a: "Navigate to the 'Profile' page from the sidebar. There you will find an 'Edit Profile' button to change your display name, bio, and other information." },
    ],
    "Account Management": [
      { q: "How do I change my password?", a: "Password management is not implemented in this prototype. In a full application, this option would be available in 'Settings > Security'." },
      { q: "How do I deactivate my account?", a: "Account deactivation is a feature found in 'Settings > Your account'. This functionality is not live in the prototype." },
    ]
  };

  return (
    <div>
      <div className="sticky top-0 bg-light-bg/80 dark:bg-twitter-dark/80 dim:bg-dim-bg/80 backdrop-blur-md z-10 p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <h1 className="text-xl font-bold">Help Center</h1>
      </div>
       <div className="p-4 border-b border-light-border dark:border-twitter-border dim:border-dim-border">
        <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-light-secondary-text dark:text-twitter-gray">
              <SearchIcon />
            </div>
            <input
                type="text"
                placeholder="Search help articles"
                className="w-full bg-light-border dark:bg-twitter-light-dark dim:bg-dim-border text-current placeholder-light-secondary-text dark:placeholder-twitter-gray dim:placeholder-dim-secondary-text rounded-full px-10 py-2 focus:outline-none focus:ring-2 focus:ring-twitter-blue"
            />
        </div>
      </div>
      <div>
        {Object.entries(faqs).map(([category, items]) => (
            <div key={category} className="mb-4">
                <h2 className="text-lg font-bold p-4">{category}</h2>
                {items.map(item => (
                    <AccordionItem key={item.q} title={item.q}>
                        <p>{item.a}</p>
                    </AccordionItem>
                ))}
            </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenterPage;
