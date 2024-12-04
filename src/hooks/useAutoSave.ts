import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Chapter } from '../types';

interface UseAutoSaveProps {
  chapters: Chapter[];
  onRestore: (chapters: Chapter[]) => void;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

const STORAGE_KEY = 'ebook-writer-chapters';
const SAVE_DELAY = 1000; // 1 second

export const useAutoSave = ({ chapters, onRestore, onNotify }: UseAutoSaveProps) => {
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);

  // Restore saved chapters on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedChapters = JSON.parse(saved);
        onRestore(parsedChapters);
        onNotify?.('Previous content restored');
      }
    } catch (error) {
      console.error('Error restoring chapters:', error);
      onNotify?.('Error restoring previous content', 'error');
    }
  }, [onRestore, onNotify]);

  // Save chapters when they change
  const saveChapters = useCallback(
    debounce((chaptersToSave: Chapter[]) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chaptersToSave));
        const time = Date.now();
        setLastSaveTime(time);
        onNotify?.('Content saved');
      } catch (error) {
        console.error('Error saving chapters:', error);
        onNotify?.('Error saving content', 'error');
      }
    }, SAVE_DELAY),
    [onNotify]
  );

  // Auto-save whenever chapters change
  useEffect(() => {
    if (chapters.length > 0) {
      saveChapters(chapters);
    }
  }, [chapters, saveChapters]);

  return {
    lastSaveTime
  };
};
