import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, AlertCircle, Copy, Check } from 'lucide-react';

const SpeechToTextTest: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ใช้เก็บข้อความสะสมแบบ persistent
  const finalTranscriptRef = useRef<string>('');
  const recognition = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition API is not supported in this browser.');
      console.error('Speech Recognition API is not supported in this browser.');
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';

    recognition.current.onresult = (event) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcriptPart + ' ';
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(finalTranscriptRef.current + interimTranscript);
    };

    recognition.current.onerror = (event) => {
      console.error('Recognition error event:', event.error);
      setError(`Recognition error: ${event.error}`);
      if (event.error === 'aborted') {
        setRecording(false);
      }
    };

    recognition.current.onend = () => {
      console.log('Recognition ended');
      if (recording) {
        console.log('Restarting recognition...');
        try {
          recognition.current?.start();
        } catch (err) {
          console.error('Failed to restart recognition:', err);
          setError(
            `Failed to restart recognition: ${
              err instanceof Error ? err.message : err
            }`
          );
          setRecording(false);
        }
      }
    };

    return () => {
      recognition.current?.stop();
    };
  }, [recording]);

  const startRecording = async () => {
    setError(null);
    try {
      if (recognition.current && !recording) {
        finalTranscriptRef.current = ''; // reset เมื่อเริ่มบันทึกใหม่
        recognition.current.start();
        setRecording(true);
      }
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to start recording'
      );
      stopRecording();
    }
  };

  const stopRecording = () => {
    if (recognition.current && recording) {
      console.log('Stopping recognition');
      recognition.current.stop();
      setRecording(false);
    }
  };

  const copyToClipboard = async () => {
    if (transcript) {
      try {
        await navigator.clipboard.writeText(transcript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Copy to clipboard failed:', err);
        setError('Failed to copy text to clipboard');
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
    finalTranscriptRef.current = e.target.value; // sync ref กับ state เวลาพิมพ์แก้ไขเอง
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Real-time Speech-to-Text
      </h2>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`
            relative flex items-center justify-center
            w-16 h-16 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2
            transition-all duration-300 ease-in-out
            ${
              recording
                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            }
          `}
          aria-label={recording ? 'Stop recording' : 'Start recording'}
        >
          {recording ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}

          {recording && (
            <>
              <span className="absolute w-full h-full rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="absolute w-full h-full rounded-full bg-red-500 opacity-60 animate-pulse" />
            </>
          )}
        </button>

        <p className="text-sm text-gray-500">
          {recording
            ? 'Recording... Click to stop'
            : 'Click to start recording'}
        </p>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-700">Transcription:</h3>
          <button
            onClick={copyToClipboard}
            disabled={!transcript}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              !transcript ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
        <textarea
          ref={textareaRef}
          value={transcript}
          onChange={handleTextChange}
          className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Transcribed text will appear here..."
        />
      </div>
    </div>
  );
};

export default SpeechToTextTest;
