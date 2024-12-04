import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, BookOpen, Download, Trash2 } from 'lucide-react';
import { Chapter } from '../types';

interface ChapterListProps {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  onChapterSelect: (chapter: Chapter) => void;
  onNewChapter: () => void;
  onDeleteChapter: (id: string) => void;
  onReorderChapters: (startIndex: number, endIndex: number) => void;
  onExportChapter: (id: string) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  currentChapter,
  onChapterSelect,
  onNewChapter,
  onDeleteChapter,
  onReorderChapters,
  onExportChapter,
}) => {
  return (
    <div className="p-4">
      <button
        onClick={onNewChapter}
        className="w-full mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <Plus className="w-4 h-4" />
        <span>New Chapter</span>
      </button>

      <DragDropContext onDragEnd={(result) => {
        if (!result.destination) return;
        onReorderChapters(result.source.index, result.destination.index);
      }}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {chapters.map((chapter, index) => (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`group p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        currentChapter?.id === chapter.id
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => onChapterSelect(chapter)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm font-medium truncate">
                            {chapter.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onExportChapter(chapter.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChapter(chapter.id);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
