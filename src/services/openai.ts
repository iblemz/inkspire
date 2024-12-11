import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, proxy through backend
});

export interface WritingAnalysis {
  style: string;
  tone: string;
  suggestions: string[];
  readabilityScore: number;
}

export interface ChapterSuggestion {
  title: string;
  description: string;
  keyPoints: string[];
}

export const analyzeWriting = async (text: string): Promise<WritingAnalysis> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional writing coach. Analyze the given text and provide feedback on style, tone, and suggestions for improvement. Format the response as JSON."
        },
        {
          role: "user",
          content: `Analyze this text: ${text}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    return {
      style: analysis.style || "",
      tone: analysis.tone || "",
      suggestions: analysis.suggestions || [],
      readabilityScore: analysis.readabilityScore || 0
    };
  } catch (error) {
    console.error('Error analyzing writing:', error);
    throw error;
  }
};

export const suggestChapterTitle = async (content: string): Promise<ChapterSuggestion> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a book editor. Based on the chapter content, suggest an engaging title and brief description. Format the response as JSON with title, description, and keyPoints fields."
        },
        {
          role: "user",
          content: `Suggest a title for this chapter content: ${content.substring(0, 1000)}...`
        }
      ],
      response_format: { type: "json_object" }
    });

    const suggestion = JSON.parse(response.choices[0].message.content || "{}");
    return {
      title: suggestion.title || "",
      description: suggestion.description || "",
      keyPoints: suggestion.keyPoints || []
    };
  } catch (error) {
    console.error('Error suggesting chapter title:', error);
    throw error;
  }
};

export const improveWriting = async (text: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional editor. Improve the given text while maintaining its original meaning and style. Focus on clarity, engagement, and flow."
        },
        {
          role: "user",
          content: `Improve this text: ${text}`
        }
      ]
    });

    return response.choices[0].message.content || text;
  } catch (error) {
    console.error('Error improving writing:', error);
    throw error;
  }
};

export const generateOutline = async (topic: string): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a book outlining expert. Create a detailed chapter outline for the given topic. Format as JSON array of chapter titles."
        },
        {
          role: "user",
          content: `Create an outline for: ${topic}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const outline = JSON.parse(response.choices[0].message.content || "[]");
    return outline.chapters || [];
  } catch (error) {
    console.error('Error generating outline:', error);
    throw error;
  }
};
