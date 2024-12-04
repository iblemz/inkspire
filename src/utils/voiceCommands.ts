// This file is deprecated and will be removed

import { EditorRef } from '../types/editor';

export interface VoiceCommandContext {
  content: string;
  cursorPosition: number;
  editorRef: EditorRef;
  handleContentChange: (newContent: string) => void;
}

interface VoiceCommand {
  keywords: string[];
  action: (context: VoiceCommandContext) => void;
  description: string;
}

// Helper functions
const findLastSentenceStart = (text: string, currentPosition: number): number => {
  const textBeforeCursor = text.slice(0, currentPosition);
  const match = textBeforeCursor.match(/[.!?]\s+[A-Z](?:[^.!?]|\\.)*$/);
  if (match) {
    return currentPosition - match[0].length + 2; // +2 to account for the period and space
  }
  const lastPeriod = textBeforeCursor.lastIndexOf('.');
  return lastPeriod === -1 ? 0 : lastPeriod + 1;
};

const findLastWordStart = (text: string, currentPosition: number): number => {
  const textBeforeCursor = text.slice(0, currentPosition);
  const match = textBeforeCursor.match(/\s\S+$/);
  return match ? currentPosition - match[0].length + 1 : currentPosition;
};

export const voiceCommands: VoiceCommand[] = [
  {
    keywords: ['new line', 'newline', 'line break'],
    action: ({ content, cursorPosition, handleContentChange, editorRef }) => {
      const newContent = 
        content.slice(0, cursorPosition) + 
        '\n' + 
        content.slice(cursorPosition);
      
      handleContentChange(newContent);
      
      setTimeout(() => {
        if (editorRef.current) {
          const newPosition = cursorPosition + 1;
          editorRef.current.selectionStart = newPosition;
          editorRef.current.selectionEnd = newPosition;
          editorRef.current.focus();
        }
      }, 0);
    },
    description: 'Insert a new line at cursor position'
  },
  {
    keywords: ['delete last sentence', 'remove last sentence'],
    action: ({ content, cursorPosition, handleContentChange, editorRef }) => {
      const sentenceStart = findLastSentenceStart(content, cursorPosition);
      const newContent = 
        content.slice(0, sentenceStart).trimEnd() + 
        ' ' + 
        content.slice(cursorPosition);
      
      handleContentChange(newContent);
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = sentenceStart;
          editorRef.current.selectionEnd = sentenceStart;
          editorRef.current.focus();
        }
      }, 0);
    },
    description: 'Delete the last sentence before the cursor'
  },
  {
    keywords: ['delete last word', 'remove last word'],
    action: ({ content, cursorPosition, handleContentChange, editorRef }) => {
      const wordStart = findLastWordStart(content, cursorPosition);
      const newContent = 
        content.slice(0, wordStart).trimEnd() + 
        ' ' + 
        content.slice(cursorPosition);
      
      handleContentChange(newContent);
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = wordStart;
          editorRef.current.selectionEnd = wordStart;
          editorRef.current.focus();
        }
      }, 0);
    },
    description: 'Delete the last word before the cursor'
  },
  {
    keywords: ['clear all', 'delete all'],
    action: ({ handleContentChange, editorRef }) => {
      handleContentChange('');
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = 0;
          editorRef.current.selectionEnd = 0;
          editorRef.current.focus();
        }
      }, 0);
    },
    description: 'Clear all content'
  }
];

export const processVoiceCommand = (
  text: string,
  context: VoiceCommandContext
): boolean => {
  const lowerText = text.toLowerCase().trim();
  
  for (const command of voiceCommands) {
    if (command.keywords.some(keyword => lowerText === keyword)) {
      command.action(context);
      return true;
    }
  }
  
  return false;
};
