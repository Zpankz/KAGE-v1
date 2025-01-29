import api from './api';

export interface Schema {
  id: string;
  name: string;
  topics: string[];
  hierarchyLevels: number;
  categories: number;
  generationType: 'imported' | 'generated';
  isDefault: boolean;
  createdAt: string;
}

export interface UnstructuredDocument {
  id: string;
  name: string;
  topic: string;
  type: 'text' | 'url' | 'pdf' | 'csv' | 'json' | 'ppt' | 'md';
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  url?: string;
  content?: string;
  createdAt: string;
}

export interface EmbeddingChunk {
  id: string;
  content: string;
  source: {
    id: string;
    type: string;
    name: string;
  };
  linkedTriples: string[];
  vector: number[];
  createdAt: string;
}

export interface Triple {
  id: string;
  subject: {
    entity: string;
    aliases: string[];
  };
  predicate: {
    relationship: string;
    originalStatements: string[];
  };
  object: {
    entity: string;
    aliases: string[];
  };
  sources: Array<{
    id: string;
    type: string;
    name: string;
  }>;
  embeddingChunks: string[];
  createdAt: string;
}

// Description: Get all schemas
// Endpoint: GET /api/data/schemas
// Request: {}
// Response: { schemas: Schema[] }
export const getSchemas = () => {
  return new Promise<{ schemas: Schema[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        schemas: [
          {
            id: '1',
            name: 'Medical Knowledge Base',
            topics: ['medicine', 'healthcare', 'anatomy'],
            hierarchyLevels: 4,
            categories: 12,
            generationType: 'imported',
            isDefault: true,
            createdAt: '2024-03-20T12:00:00Z'
          },
          {
            id: '2',
            name: 'Research Papers',
            topics: ['academic', 'research', 'science'],
            hierarchyLevels: 3,
            categories: 8,
            generationType: 'generated',
            isDefault: false,
            createdAt: '2024-03-21T14:30:00Z'
          }
        ]
      });
    }, 500);
  });
};

// Description: Get all unstructured documents
// Endpoint: GET /api/data/documents
// Request: {}
// Response: { documents: UnstructuredDocument[] }
export const getDocuments = () => {
  return new Promise<{ documents: UnstructuredDocument[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        documents: [
          {
            id: '1',
            name: 'Clinical Guidelines 2024',
            topic: 'medicine',
            type: 'pdf',
            size: 2500000,
            status: 'completed',
            createdAt: '2024-03-20T10:00:00Z'
          },
          {
            id: '2',
            name: 'Research Dataset',
            topic: 'research',
            type: 'csv',
            size: 1500000,
            status: 'processing',
            createdAt: '2024-03-21T11:30:00Z'
          },
          {
            id: '3',
            url: 'https://example.com/article',
            name: 'Web Article',
            topic: 'healthcare',
            type: 'url',
            size: 50000,
            status: 'completed',
            createdAt: '2024-03-22T09:15:00Z'
          }
        ]
      });
    }, 500);
  });
};

// Description: Get all embedding chunks
// Endpoint: GET /api/data/embeddings
// Request: {}
// Response: { chunks: EmbeddingChunk[] }
export const getEmbeddings = () => {
  return new Promise<{ chunks: EmbeddingChunk[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        chunks: [
          {
            id: '1',
            content: 'The heart is a muscular organ that pumps blood throughout the body.',
            source: {
              id: '1',
              type: 'pdf',
              name: 'Clinical Guidelines 2024'
            },
            linkedTriples: ['1', '2'],
            vector: Array(384).fill(0).map(() => Math.random()),
            createdAt: '2024-03-20T10:05:00Z'
          },
          {
            id: '2',
            content: 'Blood pressure is measured using systolic and diastolic values.',
            source: {
              id: '1',
              type: 'pdf',
              name: 'Clinical Guidelines 2024'
            },
            linkedTriples: ['3'],
            vector: Array(384).fill(0).map(() => Math.random()),
            createdAt: '2024-03-20T10:05:00Z'
          }
        ]
      });
    }, 500);
  });
};

// Description: Get all triples
// Endpoint: GET /api/data/triples
// Request: {}
// Response: { triples: Triple[] }
export const getTriples = () => {
  return new Promise<{ triples: Triple[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        triples: [
          {
            id: '1',
            subject: {
              entity: 'heart',
              aliases: ['cardiac muscle', 'cardiac organ']
            },
            predicate: {
              relationship: 'pumps',
              originalStatements: [
                'pumps blood throughout the body',
                'circulates blood in the circulatory system'
              ]
            },
            object: {
              entity: 'blood',
              aliases: ['blood flow', 'circulatory fluid']
            },
            sources: [
              {
                id: '1',
                type: 'pdf',
                name: 'Clinical Guidelines 2024'
              }
            ],
            embeddingChunks: ['1'],
            createdAt: '2024-03-20T10:05:00Z'
          }
        ]
      });
    }, 500);
  });
};

// Description: Set default schema
// Endpoint: POST /api/data/schemas/default
// Request: { schemaId: string }
// Response: { success: boolean }
export const setDefaultSchema = (schemaId: string) => {
  return new Promise<{ success: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};