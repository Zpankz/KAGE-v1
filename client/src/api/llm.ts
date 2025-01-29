import api from './api';

export interface LLMConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  model: string;
}

// Description: Generate text using LLM
// Endpoint: POST /api/llm/generate
// Request: { prompt: string, config: LLMConfig }
// Response: { success: boolean, text: string }
export const generateText = (data: { prompt: string; config: LLMConfig }) => {
  return new Promise<{ success: boolean; text: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        text: 'Generated insights based on the knowledge graph structure...'
      });
    }, 1000);
  });
};

// Description: Get available LLM models
// Endpoint: GET /api/llm/models
// Request: {}
// Response: { success: boolean, models: string[] }
export const getAvailableModels = () => {
  return new Promise<{ success: boolean; models: string[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        models: [
          'gpt-4',
          'gpt-3.5-turbo',
          'claude-2',
          'gemini-pro',
          'llama-2-70b'
        ]
      });
    }, 500);
  });
};