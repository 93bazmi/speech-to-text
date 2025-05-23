import React, { useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { TranscriptSegment } from '../types';

interface TranscriptDisplayProps {
  transcriptSegments: TranscriptSegment[];
  isProcessing: boolean;
  sourceLanguage: string;
  targetLanguage: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcriptSegments,
  isProcessing,
  sourceLanguage,
  targetLanguage,
}) => {
  const [copied, setCopied] = React.useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  
  const fullTranscript = transcriptSegments
    .map(segment => segment.text)
    .join(' ')
    .trim();

  const copyToClipboard = () => {
    if (!fullTranscript) return;
    
    navigator.clipboard.writeText(fullTranscript)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Auto-scroll to the bottom when new content is added
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcriptSegments]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-80">
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
        <div className="text-sm font-medium text-gray-700">
          {sourceLanguage !== targetLanguage 
            ? `Translating: ${sourceLanguage} → ${targetLanguage}` 
            : `Transcribing: ${sourceLanguage}`}
        </div>
        <button
          onClick={copyToClipboard}
          disabled={!fullTranscript}
          className={`p-1.5 rounded-full ${
            fullTranscript 
              ? 'text-gray-700 hover:bg-gray-200 transition-colors' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Copy transcript"
          aria-label="Copy transcript"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      
      <div 
        ref={transcriptRef}
        className="flex-1 p-4 overflow-y-auto font-medium text-gray-800 space-y-2"
      >
        {transcriptSegments.length === 0 ? (
          <p className="text-gray-500 italic">
            {isProcessing 
              ? "Listening..." 
              : "Transcript will appear here..."}
          </p>
        ) : (
          transcriptSegments.map((segment, index) => (
            <p 
              key={index} 
              className={`${
                segment.isFinal ? 'text-gray-800' : 'text-gray-500'
              } transition-colors duration-300 leading-relaxed`}
            >
              {segment.text}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default TranscriptDisplay;