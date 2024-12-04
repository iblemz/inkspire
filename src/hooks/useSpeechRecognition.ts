import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSpeechRecognitionProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
}

// Define the SpeechRecognition constructor
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export const useSpeechRecognition = ({ onResult, onError }: UseSpeechRecognitionProps) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsSupported(true);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      onError?.('Speech recognition is not supported in this browser');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        console.log('Speech recognition result event received');
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            console.log('Final transcript:', transcript);
            finalTranscript = transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Only send final results to prevent duplicate/replacement issues
        if (finalTranscript && finalTranscript !== interimTranscript) {
          onResult(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        onError?.(event.error);
        // Automatically restart recognition on error unless it's a fatal error
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          recognition.stop();
          setTimeout(() => recognition.start(), 1000);
        }
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        // Automatically restart recognition unless manually stopped
        if (recognitionRef.current === recognition) {
          recognition.start();
        }
      };

      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      onError?.('Failed to start speech recognition');
    }
  }, [isSupported, onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      console.log('Stopping speech recognition...');
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  return {
    isSupported,
    startListening,
    stopListening
  };
};
