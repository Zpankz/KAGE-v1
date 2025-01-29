import type { ProcessingState } from '@/components/shared/cells/ProcessingStatus';
import type { Node, Edge } from 'react-flow-renderer';

export interface TopicReference {
  id: string;
  name: string;
}

export interface SchemaReference {
  id: string;
  name: string;
}

export interface EmbeddingReference {
  id: string;
  dimensions: number;
  updatedAt: string;
}

export interface Entity {
  name: string;
  type: string;
  aliases?: string[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: ProcessingState;
  error?: string;
  progress?: number;
  uploadedAt: string;
  embedding?: EmbeddingReference;
  topics?: TopicReference[];
  schema?: SchemaReference;
  url?: string;
  content?: string;
  entities?: Entity[];
}

export interface UploadDocumentOptions {
  content?: string;
  entities?: Entity[];
}

export async function getDocuments(): Promise<{ documents: Document[] }> {
  // TODO: Implement actual API call
  return { documents: [] };
}

export async function uploadDocument(
  source: File | string,
  options?: UploadDocumentOptions
): Promise<{ document: Document }> {
  // TODO: Implement actual API call
  const isUrl = typeof source === 'string';
  
  const document: Document = {
    id: Math.random().toString(),
    name: isUrl ? new URL(source).hostname : source.name,
    type: isUrl ? 'url' : source.type,
    size: isUrl ? 0 : source.size,
    status: 'processing',
    uploadedAt: new Date().toISOString(),
    url: isUrl ? source : undefined,
    content: options?.content,
    entities: options?.entities,
  };
  
  return { document };
}

export async function downloadDocument(id: string): Promise<void> {
  // TODO: Implement actual API call
  console.log('Downloading document:', id);
}

// Schema Graph Functions
interface SchemaGraph {
  nodes: Node[];
  edges: Edge[];
}

export async function getSchemaGraph(): Promise<SchemaGraph> {
  // TODO: Replace with actual API call
  return {
    nodes: [
      {
        id: '1',
        type: 'class',
        position: { x: 100, y: 100 },
        data: {
          label: 'Person',
          properties: [
            { id: '1', name: 'name', type: 'string', required: true },
            { id: '2', name: 'age', type: 'number', required: false }
          ]
        }
      },
      {
        id: '2',
        type: 'class',
        position: { x: 400, y: 100 },
        data: {
          label: 'Organization',
          properties: [
            { id: '3', name: 'name', type: 'string', required: true },
            { id: '4', name: 'founded', type: 'date', required: false }
          ]
        }
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'relationship',
        data: { label: 'works at' }
      }
    ]
  };
}

export async function saveSchemaVersion(schema: SchemaGraph): Promise<void> {
  // TODO: Replace with actual API call
  console.log('Saving schema version:', schema);
}