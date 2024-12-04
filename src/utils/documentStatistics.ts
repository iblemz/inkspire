interface DocumentStatistics {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  averageWordsPerSentence: number;
  readingTimeMinutes: number;
}

export const calculateDocumentStatistics = (text: string): DocumentStatistics => {
  // Clean up the text
  const cleanText = text.trim();
  
  // Calculate basic statistics
  const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;
  const characterCount = cleanText.length;
  const paragraphCount = cleanText.split(/\n\s*\n/).filter(para => para.length > 0).length;
  
  // Calculate sentence count (basic implementation)
  const sentences = cleanText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Calculate averages
  const averageWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  
  // Estimate reading time (assuming average reading speed of 200 words per minute)
  const readingTimeMinutes = wordCount / 200;

  return {
    wordCount,
    characterCount,
    sentenceCount,
    paragraphCount,
    averageWordsPerSentence: Math.round(averageWordsPerSentence * 10) / 10,
    readingTimeMinutes: Math.round(readingTimeMinutes * 10) / 10
  };
};

export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) {
    return 'Less than a minute';
  }
  
  const roundedMinutes = Math.round(minutes);
  return `${roundedMinutes} minute${roundedMinutes !== 1 ? 's' : ''}`;
};
