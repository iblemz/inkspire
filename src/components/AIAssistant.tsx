import React from 'react';
import { useAIAssistant } from '../hooks/useAIAssistant';

interface AIAssistantProps {
  content: string;
  onApplySuggestion?: (text: string) => void;
  onApplyTitle?: (title: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  content,
  onApplySuggestion,
  onApplyTitle
}) => {
  const {
    isLoading,
    error,
    analysis,
    chapterSuggestion,
    improvedText,
    outline,
    analyzeContent,
    suggestTitle,
    improveContent,
    generateChapterOutline,
    clearResults
  } = useAIAssistant();

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">AI Writing Assistant</h2>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => analyzeContent(content)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            Analyze Writing
          </button>
          
          <button
            onClick={() => suggestTitle(content)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={isLoading}
          >
            Suggest Title
          </button>
          
          <button
            onClick={() => improveContent(content)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            disabled={isLoading}
          >
            Improve Writing
          </button>
          
          <button
            onClick={() => generateChapterOutline("Your Book Topic")}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            disabled={isLoading}
          >
            Generate Outline
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Processing...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Writing Analysis</h3>
            <p><strong>Style:</strong> {analysis.style}</p>
            <p><strong>Tone:</strong> {analysis.tone}</p>
            <p><strong>Readability:</strong> {analysis.readabilityScore}/10</p>
            <div className="mt-2">
              <strong>Suggestions:</strong>
              <ul className="list-disc pl-5">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {chapterSuggestion && (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Title Suggestion</h3>
            <p className="text-lg font-semibold">{chapterSuggestion.title}</p>
            <p className="text-gray-600 mt-1">{chapterSuggestion.description}</p>
            <div className="mt-2">
              <strong>Key Points:</strong>
              <ul className="list-disc pl-5">
                {chapterSuggestion.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
            {onApplyTitle && (
              <button
                onClick={() => onApplyTitle(chapterSuggestion.title)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Apply Title
              </button>
            )}
          </div>
        )}

        {improvedText && (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Improved Version</h3>
            <p className="text-gray-800">{improvedText}</p>
            {onApplySuggestion && (
              <button
                onClick={() => onApplySuggestion(improvedText)}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Apply Changes
              </button>
            )}
          </div>
        )}

        {outline && (
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-bold mb-2">Chapter Outline</h3>
            <ol className="list-decimal pl-5">
              {outline.map((chapter, index) => (
                <li key={index}>{chapter}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Clear Results Button */}
        {(analysis || chapterSuggestion || improvedText || outline) && (
          <button
            onClick={clearResults}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Results
          </button>
        )}
      </div>
    </div>
  );
};
