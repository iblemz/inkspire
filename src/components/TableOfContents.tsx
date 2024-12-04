import React from 'react';
import { Chapter } from '../types';

interface TableOfContentsProps {
  chapters: Chapter[];
  currentChapter: Chapter | null;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  currentChapter
}) => {
  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <div className="space-y-2">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`p-2 rounded ${
              currentChapter?.id === chapter.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700'
            }`}
          >
            {chapter.title}
          </div>
        ))}
      </div>
    </div>
  );
};
