// Mock data for frontend development

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'processing' | 'error' | 'completed';
  uploadedAt: string;
  embeddings?: {
    id: string;
    dimensions: number;
  }[];
  topics?: {
    id: string;
    name: string;
  }[];
  schema?: {
    id: string;
    name: string;
  };
}

export const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'research-paper.pdf',
    type: 'pdf',
    size: 2500000,
    status: 'completed',
    uploadedAt: new Date().toISOString(),
    embeddings: [
      { id: 'emb1', dimensions: 768 },
      { id: 'emb2', dimensions: 1024 }
    ],
    topics: [
      { id: 'topic1', name: 'Machine Learning' },
      { id: 'topic2', name: 'Neural Networks' }
    ],
    schema: {
      id: 'schema1',
      name: 'Research Papers'
    }
  },
  {
    id: '2',
    name: 'dataset.csv',
    type: 'csv',
    size: 1500000,
    status: 'processing',
    uploadedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'notes.txt',
    type: 'txt',
    size: 50000,
    status: 'error',
    uploadedAt: new Date().toISOString()
  }
];

export interface Triple {
  id: string;
  subject: {
    entity: string;
    type: string;
    description: string;
  };
  predicate: {
    relationship: string;
    description: string;
    direction: 'outward' | 'inward';
  };
  object: {
    entity: string;
    type: string;
    description: string;
  };
  sourceDocument: {
    id: string;
    name: string;
  };
  embeddings: {
    id: string;
    llmType: string;
    dimensions: number;
  }[];
  schema: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export const mockTriples: Triple[] = [
  {
    id: '1',
    subject: {
      entity: 'Neural Networks',
      type: 'Concept',
      description: 'A computing system inspired by biological neural networks'
    },
    predicate: {
      relationship: 'is part of',
      description: 'Indicates that one concept is a subset of another',
      direction: 'outward'
    },
    object: {
      entity: 'Machine Learning',
      type: 'Concept',
      description: 'A field of artificial intelligence'
    },
    sourceDocument: {
      id: '1',
      name: 'research-paper.pdf'
    },
    embeddings: [
      {
        id: 'emb1',
        llmType: 'GPT-4',
        dimensions: 768
      }
    ],
    schema: {
      id: 'schema1',
      name: 'Research Papers'
    },
    createdAt: new Date().toISOString()
  }
];

export interface Schema {
  id: string;
  name: string;
  description: string;
  version: string;
  entities: {
    id: string;
    name: string;
    description: string;
  }[];
  relations: {
    id: string;
    name: string;
    description: string;
    sourceEntity: string;
    targetEntity: string;
  }[];
  createdAt: string;
}

export const mockSchemas: Schema[] = [
  {
    id: 'schema1',
    name: 'Research Papers',
    description: 'Schema for academic research papers',
    version: '1.0.0',
    entities: [
      {
        id: 'ent1',
        name: 'Concept',
        description: 'A scientific or technical concept'
      },
      {
        id: 'ent2',
        name: 'Method',
        description: 'A research methodology or technique'
      }
    ],
    relations: [
      {
        id: 'rel1',
        name: 'is part of',
        description: 'Indicates that one concept is a subset of another',
        sourceEntity: 'ent1',
        targetEntity: 'ent1'
      }
    ],
    createdAt: new Date().toISOString()
  }
];