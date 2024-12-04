import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Sun, Moon, BookOpen, Plus, 
  Sparkles, MoreVertical, Check, FileText, Eye, List, Upload, ChevronDown } from 'lucide-react';
import { Chapter, TableOfContentsItem } from '../types';
import { convertToMarkdown } from '../utils/documentConverter';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface Props {
  currentChapter: Chapter | null;
  onUpdateChapter: (chapterId: string, content: string) => void;
}

export const EBookWriter: React.FC<Props> = ({
  currentChapter,
  onUpdateChapter
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [content, setContent] = useState('');
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const [activeView, setActiveView] = useState<'editor' | 'preview' | 'split'>('editor');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const importDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and sync content with current chapter
  useEffect(() => {
    if (currentChapter) {
      setContent(currentChapter.content || '');
    }
  }, [currentChapter]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (currentChapter) {
      onUpdateChapter(currentChapter.id, newContent);
    }
  }, [currentChapter, onUpdateChapter]);

  const handleVoiceInput = useCallback((text: string) => {
    if (!currentChapter || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart || content.length;
    const beforeCursor = content.slice(0, cursorPos);
    const afterCursor = content.slice(cursorPos);
    
    // Add appropriate spacing based on context
    const needsSpace = beforeCursor.length > 0 && 
      !beforeCursor.endsWith(' ') && 
      !beforeCursor.endsWith('\n');

    // Construct new content with proper spacing
    const newContent = 
      beforeCursor + 
      (needsSpace ? ' ' : '') + 
      text +
      afterCursor;

    // Update content
    setContent(newContent);
    onUpdateChapter(currentChapter.id, newContent);

    // Move cursor to end of inserted text
    const newPosition = cursorPos + 
      (needsSpace ? 1 : 0) + 
      text.length;

    // Update cursor position
    requestAnimationFrame(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newPosition, newPosition);
      }
    });
  }, [currentChapter, onUpdateChapter, content]);

  const { startListening, stopListening, isSupported } = useSpeechRecognition({
    onResult: handleVoiceInput,
    onError: (error) => {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    }
  });

  const handleVoiceButtonClick = useCallback(() => {
    if (!currentChapter) {
      alert('Please select a chapter first');
      return;
    }

    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  }, [currentChapter, isListening, startListening, stopListening]);

  const handleImportClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentChapter) return;

    try {
      const result = await convertToMarkdown(file);
      if (!result.content) {
        throw new Error('No content found in file');
      }

      const cursorPos = textareaRef.current?.selectionStart || 0;
      const beforeCursor = content.slice(0, cursorPos);
      const afterCursor = content.slice(cursorPos);
      
      const newContent = beforeCursor + result.content + afterCursor;
      setContent(newContent);
      onUpdateChapter(currentChapter.id, newContent);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing file');
    }
  }, [content, currentChapter, onUpdateChapter]);

  const enhanceWriting = async () => {
    if (!currentChapter) return;
    
    try {
      setIsAiLoading(true);
      // Add AI enhancement logic here
      alert('AI enhancement coming soon!');
    } catch (error) {
      console.error('AI enhancement error:', error);
      alert('Error enhancing writing');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('editor')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeView === 'editor' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeView === 'preview' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setActiveView('split')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              activeView === 'split' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Split View</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative" ref={importDropdownRef}>
            <button
              onClick={() => setShowImportDropdown(!showImportDropdown)}
              onMouseEnter={() => setShowImportDropdown(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-all duration-200 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {showImportDropdown && (
              <div 
                className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-50"
                onMouseLeave={() => setShowImportDropdown(false)}
              >
                <button
                  onClick={handleImportClick}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Insert at Cursor
                </button>
              </div>
            )}
          </div>

          <button
            onClick={enhanceWriting}
            disabled={isAiLoading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAiLoading ? 'Enhancing...' : 'Enhance Writing'}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showThemeDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  Theme
                </div>
                {['light', 'dark', 'sepia'].map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => {
                      setTheme(themeOption as 'light' | 'dark' | 'sepia');
                      setShowThemeDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                      theme === themeOption ? 'text-blue-500 font-medium' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      {theme === themeOption && (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      <span className={theme !== themeOption ? 'ml-6' : ''}>
                        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.md,.doc,.docx"
        className="hidden"
      />

      <div className={`flex-1 ${activeView === 'split' ? 'flex space-x-4' : ''}`}>
        {(activeView === 'editor' || activeView === 'split') && (
          <div className={`relative ${activeView === 'split' ? 'flex-1' : 'h-full'}`}>
            <textarea
              ref={textareaRef}
              className={`w-full h-full p-4 resize-none focus:outline-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 text-white' 
                  : theme === 'sepia'
                  ? 'bg-[#f4ecd8] text-gray-900'
                  : 'bg-white text-gray-900'
              }`}
              value={content}
              onChange={handleTextChange}
              placeholder="Start writing or click the microphone to use voice input..."
            />
            {isSupported && (
              <button
                onClick={handleVoiceButtonClick}
                className={`fixed bottom-4 right-4 p-3 rounded-full transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-white" />
                )}
              </button>
            )}
          </div>
        )}

        {(activeView === 'preview' || activeView === 'split') && (
          <div 
            className={`prose max-w-none ${activeView === 'split' ? 'flex-1' : ''} p-6 ${
              theme === 'dark' 
                ? 'prose-invert bg-gray-900' 
                : theme === 'sepia'
                ? 'bg-[#f4ecd8]'
                : 'bg-white'
            }`}
          >
            {content}
          </div>
        )}
      </div>
    </div>
  );
};
