import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChapterList } from './components/ChapterList';
import { EBookWriter } from './components/EBookWriter';
import { Chapter } from './types';

function App() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);

  const handleNewChapter = useCallback(() => {
    const newChapter: Chapter = {
      id: uuidv4(),
      title: `Chapter ${chapters.length + 1}`,
      content: ''
    };
    setChapters(prev => [...prev, newChapter]);
    setCurrentChapter(newChapter);
  }, [chapters.length]);

  const handleChapterSelect = useCallback((chapter: Chapter) => {
    setCurrentChapter(chapter);
  }, []);

  const handleUpdateChapter = useCallback((chapterId: string, content: string) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, content } : chapter
    ));
    if (currentChapter?.id === chapterId) {
      setCurrentChapter(prev => prev ? { ...prev, content } : null);
    }
  }, [currentChapter]);

  const handleDeleteChapter = useCallback((id: string) => {
    setChapters(prev => prev.filter(chapter => chapter.id !== id));
    if (currentChapter?.id === id) {
      setCurrentChapter(null);
    }
  }, [currentChapter]);

  const handleReorderChapters = useCallback((startIndex: number, endIndex: number) => {
    setChapters(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const handleExportChapter = useCallback((id: string) => {
    const chapter = chapters.find(c => c.id === id);
    if (!chapter) return;

    const blob = new Blob([chapter.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chapter.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [chapters]);

  return (
    <div className="h-screen flex">
      <div className="w-64 border-r border-gray-200 overflow-y-auto">
        <ChapterList
          chapters={chapters}
          currentChapter={currentChapter}
          onChapterSelect={handleChapterSelect}
          onNewChapter={handleNewChapter}
          onDeleteChapter={handleDeleteChapter}
          onReorderChapters={handleReorderChapters}
          onExportChapter={handleExportChapter}
        />
      </div>
      <div className="flex-1">
        <EBookWriter
          currentChapter={currentChapter}
          onUpdateChapter={handleUpdateChapter}
        />
      </div>
    </div>
  );
}

export default App;
