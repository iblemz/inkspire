import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { calculateDocumentStatistics, formatReadingTime } from './documentStatistics';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-'
});

interface ConversionResult {
  content?: string;
  error?: string;
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  date?: string;
  statistics?: {
    wordCount: number;
    readingTime: string;
  };
}

export async function convertToMarkdown(file: File): Promise<ConversionResult> {
  try {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension) {
      throw new Error('File has no extension');
    }

    // Handle different file types
    switch (extension) {
      case 'txt':
        return await handleTextFile(file);
      case 'md':
        return await handleMarkdownFile(file);
      case 'doc':
      case 'docx':
        return await handleWordFile(file);
      default:
        throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Conversion error:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error during conversion'
    };
  }
}

async function handleTextFile(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const { content, metadata } = processDocument(text);
    return { content, metadata };
  } catch (error) {
    throw new Error('Failed to read text file');
  }
}

async function handleMarkdownFile(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    const { content, metadata } = processDocument(text);
    return { content, metadata };
  } catch (error) {
    throw new Error('Failed to read markdown file');
  }
}

async function handleWordFile(file: File): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const markdown = turndownService.turndown(result.value);
    const { content, metadata } = processDocument(markdown);
    return { content, metadata };
  } catch (error) {
    throw new Error('Failed to convert Word document');
  }
}

export const processDocument = (content: string): { content: string; metadata: DocumentMetadata } => {
  const lines = content.split('\n');
  const metadata: DocumentMetadata = {};
  const contentLines: string[] = [];
  
  // Process metadata from frontmatter if present
  if (lines[0]?.trim() === '---') {
    let i = 1;
    while (i < lines.length && lines[i]?.trim() !== '---') {
      const line = lines[i].trim();
      const [key, value] = line.split(':').map(part => part.trim());
      if (key && value) {
        metadata[key as keyof DocumentMetadata] = value;
      }
      i++;
    }
    contentLines.push(...lines.slice(i + 1));
  } else {
    contentLines.push(...lines);
  }

  const processedContent = contentLines.join('\n');
  
  // Calculate and add document statistics
  const stats = calculateDocumentStatistics(processedContent);
  metadata.statistics = {
    wordCount: stats.wordCount,
    readingTime: formatReadingTime(stats.readingTimeMinutes)
  };

  return {
    content: processedContent,
    metadata
  };
};
