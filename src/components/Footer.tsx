import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 bg-gray-900 dark:bg-black text-gray-400">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm">
          Powered by Web Speech API
        </p>
        <div className="flex items-center mt-3 sm:mt-0">
          <p className="text-sm flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by VoiceStream
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;