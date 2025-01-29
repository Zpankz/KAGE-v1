import api from './api';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Description: Send chat message
// Endpoint: POST /api/chat/message
// Request: { message: string, context: { selectedNodes: string[], path: string[] } }
// Response: { message: ChatMessage }
export const sendChatMessage = (data: { message: string; context: { selectedNodes: string[], path: string[] } }) => {
  // Mocking the response
  return new Promise<{ message: ChatMessage }>((resolve) => {
    setTimeout(() => {
      resolve({
        message: {
          id: Math.random().toString(36).substr(2, 9),
          type: 'assistant',
          content: 'Based on the selected nodes and path in your knowledge graph, I can explain the relationships and insights. What specific aspects would you like to explore?',
          timestamp: new Date().toISOString()
        }
      });
    }, 800);
  });
};

// Description: Generate graph insights for selected path
// Endpoint: POST /api/chat/insights
// Request: { nodeIds: string[], pathMode: 'shortest' | 'all' | 'optimal' }
// Response: { insights: { paths: Array<{ nodes: string[], score: number }>, explanation: string } }
export const getPathInsights = (data: { nodeIds: string[], pathMode: 'shortest' | 'all' | 'optimal' }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        insights: {
          paths: [
            {
              nodes: data.nodeIds,
              score: 0.85
            }
          ],
          explanation: 'These nodes form a coherent path through the knowledge graph, representing key concepts and their relationships.'
        }
      });
    }, 600);
  });
};