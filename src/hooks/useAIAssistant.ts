import { useState, useCallback } from 'react';
import { 
  analyzeWriting, 
  suggestChapterTitle, 
  improveWriting, 
  generateOutline,
  WritingAnalysis,
  ChapterSuggestion 
} from '../services/openai';

interface AIAssistantState {
  isLoading: boolean;
  error: string | null;
  analysis: WritingAnalysis | null;
  chapterSuggestion: ChapterSuggestion | null;
  improvedText: string | null;
  outline: string[] | null;
}

export const useAIAssistant = () => {
  const [state, setState] = useState<AIAssistantState>({
    isLoading: false,
    error: null,
    analysis: null,
    chapterSuggestion: null,
    improvedText: null,
    outline: null
  });

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: null }));
  };

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  };

  const analyzeContent = useCallback(async (text: string) => {
    try {
      setLoading(true);
      const analysis = await analyzeWriting(text);
      setState(prev => ({ ...prev, analysis, isLoading: false }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze writing');
    }
  }, []);

  const suggestTitle = useCallback(async (content: string) => {
    try {
      setLoading(true);
      const suggestion = await suggestChapterTitle(content);
      setState(prev => ({ ...prev, chapterSuggestion: suggestion, isLoading: false }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to suggest title');
    }
  }, []);

  const improveContent = useCallback(async (text: string) => {
    try {
      setLoading(true);
      const improved = await improveWriting(text);
      setState(prev => ({ ...prev, improvedText: improved, isLoading: false }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to improve writing');
    }
  }, []);

  const generateChapterOutline = useCallback(async (topic: string) => {
    try {
      setLoading(true);
      const outline = await generateOutline(topic);
      setState(prev => ({ ...prev, outline, isLoading: false }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate outline');
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      analysis: null,
      chapterSuggestion: null,
      improvedText: null,
      outline: null
    });
  }, []);

  return {
    ...state,
    analyzeContent,
    suggestTitle,
    improveContent,
    generateChapterOutline,
    clearResults
  };
};
