import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface MicrophoneButtonProps {
  isListening: boolean;
  onClick: () => void;
  hasSupport: boolean;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isListening,
  onClick,
  hasSupport
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!hasSupport}
      className={`
        relative flex items-center justify-center
        w-16 h-16 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-all duration-300 ease-in-out ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
        } ${!hasSupport ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      aria-label={isListening ? "Stop listening" : "Start listening"}
      title={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
      
      {/* Ripple animation when active */}
      {isListening && (
        <>
          <span className="absolute w-full h-full rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="absolute w-full h-full rounded-full bg-red-500 opacity-60 animate-pulse" />
        </>
      )}
    </button>
  );
};

export default MicrophoneButton;