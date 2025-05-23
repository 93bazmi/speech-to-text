import { useState, useEffect, useRef, useCallback } from 'react';
import { TranscriptSegment } from '../types';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  hasRecognitionSupport: boolean;
  startListening: (language: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
  transcriptSegments: TranscriptSegment[];
  error: string | null;
}

const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState<string>('');
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const hasRecognitionSupport = 'SpeechRecognition' in window || 
                               'webkitSpeechRecognition' in window;

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setTranscriptSegments([]);
  }, []);

  const startListening = useCallback((language: string) => {
    setError(null);
    
    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        setError('Your browser does not support speech recognition');
        return;
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = language;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Optimize for real-time transcription
      recognition.interimResults = true;
      recognition.continuous = true;
      // Set a shorter speechRecognitionTimeout
      (recognition as any).speechRecognitionTimeout = 100;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscript += text;
            setTranscriptSegments(prev => [
              ...prev, 
              { text, timestamp: Date.now(), isFinal: true }
            ]);
          } else {
            interimTranscript += text;
          }
        }

        // Update interim results immediately
        if (interimTranscript) {
          setTranscriptSegments(prev => {
            const newSegments = [...prev];
            if (newSegments.length > 0 && !newSegments[newSegments.length - 1].isFinal) {
              newSegments[newSegments.length - 1] = {
                text: interimTranscript,
                timestamp: Date.now(),
                isFinal: false
              };
            } else {
              newSegments.push({
                text: interimTranscript,
                timestamp: Date.now(),
                isFinal: false
              });
            }
            return newSegments;
          });
        }

        // Update final transcript
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript + ' ');
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== 'no-speech') {
          setError(`Error occurred in recognition: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      setError(`Could not start speech recognition: ${err}`);
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    transcript,
    isListening,
    hasRecognitionSupport,
    startListening,
    stopListening,
    resetTranscript,
    transcriptSegments,
    error
  };
};

export default useSpeechRecognition;