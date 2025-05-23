import React from "react";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 bg-gray-900  text-gray-400">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm"></p>
        <div className="flex items-center mt-3 sm:mt-0">
          <p className="text-sm flex items-center"></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
