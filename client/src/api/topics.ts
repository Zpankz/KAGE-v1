import api from './api';

export interface Topic {
  id: string;
  name: string;
  description: string;
  color: string;
  schema: {
    id: string;
    name: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
  }>;
  documentCount: number;
  createdAt: string;
}

// Description: Get topics
// Endpoint: GET /api/topics
// Request: {}
// Response: { topics: Topic[] }
export const getTopics = () => {
  return new Promise<{ topics: Topic[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        topics: [
          {
            id: '1',
            name: 'Medicine',
            description: 'Medical research and healthcare topics',
            color: '#FF6B6B',
            schema: {
              id: '1',
              name: 'Medical Knowledge Base'
            },
            documents: [
              {
                id: 'd1',
                name: 'Clinical Guidelines 2024.pdf',
                type: 'pdf',
                size: 2500000
              },
              {
                id: 'd2',
                name: 'Research Dataset.csv',
                type: 'csv',
                size: 1500000
              }
            ],
            documentCount: 2,
            createdAt: '2024-03-20T12:00:00Z'
          },
          {
            id: '2',
            name: 'Technology',
            description: 'Software development and tech innovation',
            color: '#4ECDC4',
            schema: {
              id: '2',
              name: 'Research Papers'
            },
            documents: [
              {
                id: 'd3',
                name: 'Tech Specs.md',
                type: 'md',
                size: 50000
              }
            ],
            documentCount: 1,
            createdAt: '2024-03-21T14:30:00Z'
          },
          {
            id: '3',
            name: 'Biology',
            description: 'Biological sciences and research',
            color: '#45B7D1',
            schema: {
              id: '1',
              name: 'Medical Knowledge Base'
            },
            documents: [],
            documentCount: 0,
            createdAt: '2024-03-22T09:15:00Z'
          }
        ]
      });
    }, 500);
  });
};

// Description: Create topic
// Endpoint: POST /api/topics
// Request: { name: string, description: string, color: string, schemaId: string }
// Response: { topic: Topic }
export const createTopic = (data: { name: string; description: string; color: string; schemaId: string }) => {
  return new Promise<{ topic: Topic }>((resolve) => {
    setTimeout(() => {
      resolve({
        topic: {
          id: Math.random().toString(36).substr(2, 9),
          ...data,
          schema: {
            id: data.schemaId,
            name: 'New Schema'
          },
          documents: [],
          documentCount: 0,
          createdAt: new Date().toISOString()
        }
      });
    }, 500);
  });
};

// Description: Delete topic
// Endpoint: DELETE /api/topics/:id
// Request: {}
// Response: { success: boolean }
export const deleteTopic = (id: string) => {
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

// Description: Update topic
// Endpoint: PUT /api/topics/:id
// Request: { name?: string, description?: string, color?: string, schemaId?: string }
// Response: { topic: Topic }
export const updateTopic = (id: string, data: { name?: string; description?: string; color?: string; schemaId?: string }) => {
  return new Promise<{ topic: Topic }>((resolve) => {
    setTimeout(() => {
      resolve({
        topic: {
          id,
          name: data.name || 'Updated Topic',
          description: data.description || 'Updated description',
          color: data.color || '#FF6B6B',
          schema: {
            id: data.schemaId || '1',
            name: 'Updated Schema'
          },
          documents: [],
          documentCount: 0,
          createdAt: new Date().toISOString()
        }
      });
    }, 500);
  });
};

// Description: Update topic documents order
// Endpoint: PUT /api/topics/:id/documents
// Request: { documents: string[] }
// Response: { success: boolean }
export const updateTopicDocuments = (id: string, documents: string[]) => {
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};