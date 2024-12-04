import mammoth from 'mammoth';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-'
});

interface ConversionResult {
  content?: string;
  error?: string;
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
    return { content: text };
  } catch (error) {
    throw new Error('Failed to read text file');
  }
}

async function handleMarkdownFile(file: File): Promise<ConversionResult> {
  try {
    const text = await file.text();
    return { content: text };
  } catch (error) {
    throw new Error('Failed to read markdown file');
  }
}

async function handleWordFile(file: File): Promise<ConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return { content: turndownService.turndown(result.value) };
  } catch (error) {
    throw new Error('Failed to convert Word document');
  }
}
