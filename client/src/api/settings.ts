import api from './api';

export interface LLMModel {
  id: string;
  name: string;
  contextWindow?: number;
  maxTokens?: number;
  description: string;
}

export interface ModelParameter {
  id: string;
  name: string;
  type: 'number' | 'string' | 'boolean';
  default: any;
  description: string;
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  enabled?: boolean;
}

export interface LLMProvider {
  id: string;
  name: string;
  baseUrl: string;
  models: LLMModel[];
  description: string;
  category: 'embedding' | 'reranking' | 'reasoning' | 'chat' | 'realtime';
  parameters: ModelParameter[];
}

// Description: Get available LLM providers and models
// Endpoint: GET /api/settings/llm-providers
// Request: {}
// Response: { providers: LLMProvider[] }
export const getLLMProviders = () => {
  return new Promise<{ providers: LLMProvider[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        providers: [
          {
            id: 'openai-embedding',
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1',
            description: 'OpenAI embedding models',
            category: 'embedding',
            parameters: [
              {
                id: 'api_key',
                name: 'API Key',
                type: 'string',
                default: '',
                description: 'Your OpenAI API key',
                required: true,
                enabled: true
              },
              {
                id: 'max_tokens',
                name: 'Max Tokens',
                type: 'number',
                default: 8191,
                min: 1,
                max: 8191,
                step: 1,
                description: 'Maximum number of tokens for input',
                required: true,
                enabled: true
              },
              {
                id: 'user',
                name: 'User Identifier',
                type: 'string',
                default: '',
                description: 'Optional identifier for tracking usage',
                required: false,
                enabled: true
              }
            ],
            models: [
              {
                id: 'text-embedding-3-large',
                name: 'Text Embedding 3 Large',
                contextWindow: 8191,
                description: 'Most capable text embedding model'
              }
            ]
          },
          {
            id: 'nvidia',
            name: 'NVIDIA',
            baseUrl: 'https://integrate.api.nvidia.com/v1/',
            description: 'NVIDIA embedding models',
            category: 'embedding',
            parameters: [
              {
                id: 'batch_size',
                name: 'Batch Size',
                type: 'number',
                default: 32,
                min: 1,
                max: 128,
                step: 1,
                description: 'Number of inputs processed simultaneously',
                required: true,
                enabled: true
              },
              {
                id: 'output_format',
                name: 'Output Format',
                type: 'string',
                default: 'json',
                description: 'Format of the embedding output',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'nv-embed-v2',
                name: 'NV Embed v2',
                description: 'NVIDIA\'s embedding model'
              }
            ]
          },
          {
            id: 'baai-embedding',
            name: 'BAAI',
            baseUrl: 'local',
            description: 'BAAI embedding models',
            category: 'embedding',
            parameters: [
              {
                id: 'device',
                name: 'Device',
                type: 'string',
                default: 'cuda',
                description: 'Hardware device for processing',
                required: true,
                enabled: true
              },
              {
                id: 'batch_size',
                name: 'Batch Size',
                type: 'number',
                default: 32,
                min: 1,
                max: 128,
                step: 1,
                description: 'Number of inputs per batch',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'bge-en-icl',
                name: 'BGE English ICL',
                description: 'BAAI\'s English embedding model'
              }
            ]
          },
          {
            id: 'cohere-embedding',
            name: 'Cohere',
            baseUrl: 'https://api.cohere.ai',
            description: 'Cohere embedding models',
            category: 'embedding',
            parameters: [
              {
                id: 'api_key',
                name: 'API Key',
                type: 'string',
                default: '',
                description: 'Your Cohere API key',
                required: true,
                enabled: true
              },
              {
                id: 'truncate',
                name: 'Truncate',
                type: 'string',
                default: 'END',
                description: 'How to handle long inputs',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'embed-English-v3.0',
                name: 'English Embedding v3.0',
                description: 'Cohere\'s English embedding model'
              }
            ]
          },
          {
            id: 'baai-rerank',
            name: 'BAAI',
            baseUrl: 'local',
            description: 'BAAI reranking models',
            category: 'reranking',
            parameters: [
              {
                id: 'device',
                name: 'Device',
                type: 'string',
                default: 'cuda',
                description: 'Hardware device for processing',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'bge-reranker-v2-m3',
                name: 'BGE Reranker v2 M3',
                description: 'BAAI\'s reranking model'
              }
            ]
          },
          {
            id: 'cohere-rerank',
            name: 'Cohere',
            baseUrl: 'https://api.cohere.ai',
            description: 'Cohere reranking models',
            category: 'reranking',
            parameters: [
              {
                id: 'api_key',
                name: 'API Key',
                type: 'string',
                default: '',
                description: 'Your Cohere API key',
                required: true,
                enabled: true
              },
              {
                id: 'top_k',
                name: 'Top K',
                type: 'number',
                default: 10,
                min: 1,
                max: 100,
                step: 1,
                description: 'Number of top results to return',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'cohere-rerank-3.5',
                name: 'Rerank v3.5',
                description: 'Cohere\'s reranking model'
              }
            ]
          },
          {
            id: 'voyage',
            name: 'VoyageAI',
            baseUrl: 'https://api.voyageai.com/v1/',
            description: 'VoyageAI reranking models',
            category: 'reranking',
            parameters: [
              {
                id: 'api_key',
                name: 'API Key',
                type: 'string',
                default: '',
                description: 'Your VoyageAI API key',
                required: true,
                enabled: true
              },
              {
                id: 'max_results',
                name: 'Max Results',
                type: 'number',
                default: 10,
                min: 1,
                max: 100,
                step: 1,
                description: 'Maximum number of reranked results',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'rerank-2',
                name: 'Rerank v2',
                description: 'VoyageAI\'s reranking model'
              }
            ]
          },
          {
            id: 'google',
            name: 'Google',
            baseUrl: 'https://vertexai.googleapis.com',
            description: 'Google\'s Gemini models',
            category: 'chat',
            parameters: [
              {
                id: 'temperature',
                name: 'Temperature',
                type: 'number',
                default: 0.7,
                min: 0,
                max: 1,
                step: 0.1,
                description: 'Controls randomness in responses',
                required: true,
                enabled: true
              },
              {
                id: 'max_output_tokens',
                name: 'Max Output Tokens',
                type: 'number',
                default: 2048,
                min: 1,
                max: 8192,
                step: 1,
                description: 'Maximum tokens in the output',
                required: true,
                enabled: true
              },
              {
                id: 'top_p',
                name: 'Top P',
                type: 'number',
                default: 0.9,
                min: 0,
                max: 1,
                step: 0.1,
                description: 'Probability mass for nucleus sampling',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'gemini-2.0-flash-exp',
                name: 'Gemini 2.0 Flash Exp',
                description: 'Experimental Flash version of Gemini 2.0'
              },
              {
                id: 'gemini-exp-1206',
                name: 'Gemini Exp 1206',
                description: 'Experimental version 1206 of Gemini'
              }
            ]
          },
          {
            id: 'minimax',
            name: 'MiniMax',
            baseUrl: 'https://api.aimlapi.com/v1',
            description: 'MiniMax chat models',
            category: 'chat',
            parameters: [
              {
                id: 'context_length',
                name: 'Context Length',
                type: 'number',
                default: 4096,
                min: 1,
                max: 8192,
                step: 1,
                description: 'Maximum context length for input',
                required: true,
                enabled: true
              },
              {
                id: 'response_length',
                name: 'Response Length',
                type: 'number',
                default: 1024,
                min: 1,
                max: 4096,
                step: 1,
                description: 'Maximum length of the response',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: '01',
                name: 'MiniMax-01',
                description: 'MiniMax chat model'
              }
            ]
          },
          {
            id: 'google-realtime',
            name: 'Google',
            baseUrl: 'https://vertexai.googleapis.com',
            description: 'Google\'s realtime models',
            category: 'realtime',
            parameters: [
              {
                id: 'temperature',
                name: 'Temperature',
                type: 'number',
                default: 0.7,
                min: 0,
                max: 1,
                step: 0.1,
                description: 'Controls randomness in responses',
                required: true,
                enabled: true
              },
              {
                id: 'max_output_tokens',
                name: 'Max Output Tokens',
                type: 'number',
                default: 2048,
                min: 1,
                max: 8192,
                step: 1,
                description: 'Maximum tokens in the output',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'gemini-2.0-flash',
                name: 'Gemini 2.0 Flash',
                description: 'Realtime version of Gemini 2.0 Flash'
              }
            ]
          },
          {
            id: 'openai-realtime',
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1',
            description: 'OpenAI realtime models',
            category: 'realtime',
            parameters: [
              {
                id: 'temperature',
                name: 'Temperature',
                type: 'number',
                default: 0.7,
                min: 0,
                max: 1,
                step: 0.1,
                description: 'Controls randomness in responses',
                required: true,
                enabled: true
              },
              {
                id: 'stream',
                name: 'Stream',
                type: 'boolean',
                default: true,
                description: 'Enable streaming responses',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: '4o',
                name: 'GPT-4 Optimized',
                description: 'Optimized version of GPT-4'
              },
              {
                id: '4o-mini',
                name: 'GPT-4 Optimized Mini',
                description: 'Smaller optimized version of GPT-4'
              }
            ]
          },
          {
            id: 'twilio',
            name: 'Twilio',
            baseUrl: 'https://api.twilio.com',
            description: 'Twilio live communication',
            category: 'realtime',
            parameters: [
              {
                id: 'session_id',
                name: 'Session ID',
                type: 'string',
                default: '',
                description: 'Session identifier for streaming',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'live',
                name: 'Twilio Live',
                description: 'Twilio live communication service'
              }
            ]
          },
          {
            id: 'deepseek',
            name: 'DeepSeek',
            baseUrl: 'https://api.deepseek.com',
            description: 'DeepSeek reasoning models',
            category: 'reasoning',
            parameters: [
              {
                id: 'stream',
                name: 'Stream',
                type: 'boolean',
                default: true,
                description: 'Enable streaming responses',
                required: true,
                enabled: true
              },
              {
                id: 'max_tokens',
                name: 'Max Tokens',
                type: 'number',
                default: 2048,
                min: 1,
                max: 8192,
                step: 1,
                description: 'Maximum tokens in the output',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'r1',
                name: 'DeepSeek-R1',
                description: 'DeepSeek reasoning model'
              }
            ]
          },
          {
            id: 'openai-reasoning',
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1',
            description: 'OpenAI reasoning models',
            category: 'reasoning',
            parameters: [
              {
                id: 'temperature',
                name: 'Temperature',
                type: 'number',
                default: 0.7,
                min: 0,
                max: 1,
                step: 0.1,
                description: 'Controls randomness in responses',
                required: true,
                enabled: true
              },
              {
                id: 'max_tokens',
                name: 'Max Tokens',
                type: 'number',
                default: 2048,
                min: 1,
                max: 8192,
                step: 1,
                description: 'Maximum tokens in the output',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'o1',
                name: 'O1',
                description: 'OpenAI reasoning model'
              }
            ]
          },
          {
            id: 'google-reasoning',
            name: 'Google',
            baseUrl: 'https://vertexai.googleapis.com',
            description: 'Google reasoning models',
            category: 'reasoning',
            parameters: [
              {
                id: 'temperature',
                name: 'Temperature',
                type: 'number',
                default: 0.7,
                min: 0,
                max: 1,
                step: 0.1,
                description: 'Controls randomness in responses',
                required: true,
                enabled: true
              },
              {
                id: 'max_output_tokens',
                name: 'Max Output Tokens',
                type: 'number',
                default: 2048,
                min: 1,
                max: 8192,
                step: 1,
                description: 'Maximum tokens in the output',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'gemini-2.0-flash-thinking-exp',
                name: 'Gemini 2.0 Flash Thinking Exp',
                description: 'Experimental thinking model based on Gemini 2.0'
              }
            ]
          },
          {
            id: 'perplexity',
            name: 'Perplexity',
            baseUrl: 'https://api.perplexity.ai/',
            description: 'Perplexity reasoning models',
            category: 'reasoning',
            parameters: [
              {
                id: 'max_results',
                name: 'Max Results',
                type: 'number',
                default: 10,
                min: 1,
                max: 100,
                step: 1,
                description: 'Maximum number of reasoning outputs',
                required: true,
                enabled: true
              }
            ],
            models: [
              {
                id: 'sonar-reasoning',
                name: 'Sonar Reasoning',
                description: 'Perplexity\'s Sonar reasoning model'
              }
            ]
          }
        ]
      });
    }, 500);
  });
};

// Description: Save LLM settings
// Endpoint: POST /api/settings/llm
// Request: {
//   provider: string,
//   model: string,
//   parameters: Record<string, any>
// }
// Response: { success: boolean }
export const saveLLMSettings = (data: {
  provider: string;
  model: string;
  parameters: Record<string, any>;
}) => {
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};