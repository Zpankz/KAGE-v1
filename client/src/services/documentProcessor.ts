import { UnstructuredDocument } from '@/api/data';

export type DocumentType = 
  | 'text' | 'url' | 'pdf' | 'csv' | 'json' 
  | 'json-ld' | 'rdf' | 'md' | 'ppt';

export interface ProcessedDocument extends Omit<UnstructuredDocument, 'type'> {
  type: DocumentType;
  error?: string;
  entities?: Entity[];
  relationships?: Relationship[];
}

interface Entity {
  name: string;
  type: string;
  aliases?: string[];
}

interface Relationship {
  source: string;
  target: string;
  type: string;
}

export const detectFileFormat = (file: File): DocumentType => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'json':
      // Note: isJsonLD check moved to processDocument
      return 'json';
    case 'rdf':
    case 'ttl':
    case 'n3':
      return 'rdf';
    case 'md':
    case 'markdown':
      return 'md';
    case 'pdf':
      return 'pdf';
    case 'csv':
      return 'csv';
    case 'ppt':
    case 'pptx':
      return 'ppt';
    default:
      return 'text';
  }
};

const isJsonLD = async (content: string): Promise<boolean> => {
  try {
    const json = JSON.parse(content);
    return '@context' in json || '@type' in json;
  } catch {
    return false;
  }
};

export const processDocument = async (
  file: File | string
): Promise<ProcessedDocument> => {
  // If string is passed, treat it as URL
  if (typeof file === 'string') {
    return processURL(file);
  }

  const initialType = detectFileFormat(file);
  const content = await file.text();

  let processedDoc: ProcessedDocument = {
    id: Math.random().toString(36).substring(7),
    name: typeof file === 'string' ? new URL(file).hostname : file.name,
    topic: '',  // Required field, can be updated later
    type: initialType,
    size: typeof file === 'string' ? 0 : file.size,
    status: 'processing',
    createdAt: new Date().toISOString(),
  };

  try {
    // Check for JSON-LD after reading content
    if (initialType === 'json' && await isJsonLD(content)) {
      processedDoc.type = 'json-ld';
    }

    switch (processedDoc.type) {
      case 'json':
      case 'json-ld':
        processedDoc = await processStructuredData(content, processedDoc);
        break;
      case 'rdf':
        processedDoc = await processRDF(content, processedDoc);
        break;
      case 'md':
        processedDoc = await processMarkdown(content, processedDoc);
        break;
      default:
        if (processedDoc.type === 'pdf' || processedDoc.type === 'csv') {
          processedDoc = await convertToMarkdown(file, processedDoc);
        } else {
          processedDoc.content = content;
        }
    }

    processedDoc.status = 'completed';
  } catch (error) {
    processedDoc.status = 'error';
    processedDoc.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return processedDoc;
};

const processURL = async (url: string): Promise<ProcessedDocument> => {
  const response = await fetch(url);
  const content = await response.text();
  const contentType = response.headers.get('content-type') || '';

  const doc: ProcessedDocument = {
    id: Math.random().toString(36).substring(7),
    name: new URL(url).hostname,
    topic: '',  // Required field, can be updated later
    type: 'url',
    size: content.length,
    status: 'processing',
    url,
    createdAt: new Date().toISOString(),
  };

  try {
    if (contentType.includes('json')) {
      return await processStructuredData(content, doc);
    } else if (contentType.includes('text/markdown')) {
      return await processMarkdown(content, doc);
    } else {
      // For HTML or other content, store as is
      doc.content = content;
      doc.status = 'completed';
    }
  } catch (error) {
    doc.status = 'error';
    doc.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return doc;
};

interface StructuredData {
  '@type'?: string;
  '@id'?: string;
  '@context'?: string | Record<string, unknown>;
  [key: string]: unknown;
}

const processStructuredData = async (
  content: string,
  doc: ProcessedDocument
): Promise<ProcessedDocument> => {
  const data = JSON.parse(content) as StructuredData;
  doc.content = content;

  // Extract entities and relationships from structured data
  const entities: Entity[] = [];
  const relationships: Relationship[] = [];

  // Simple extraction - can be enhanced later
  const processObject = (obj: StructuredData, path: string = '') => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        const valueObj = value as StructuredData;
        if ('@type' in valueObj) {
          // Found an entity
          entities.push({
            name: valueObj['@id']?.toString() || `${path}${key}`,
            type: valueObj['@type']?.toString() || 'unknown',
          });
        }
        processObject(valueObj, `${path}${key}.`);
      }
    }
  };

  processObject(data);

  doc.entities = entities;
  doc.relationships = relationships;
  return doc;
};

const processRDF = async (
  content: string,
  doc: ProcessedDocument
): Promise<ProcessedDocument> => {
  // Basic RDF processing - can be enhanced with proper RDF parser
  doc.content = content;
  // Extract basic entities and relationships
  const entities: Entity[] = [];
  const relationships: Relationship[] = [];

  // Simple regex-based extraction
  const subjectRegex = /<([^>]+)>/g;
  const matches = content.matchAll(subjectRegex);
  
  for (const match of matches) {
    entities.push({
      name: match[1],
      type: 'resource'
    });
  }

  doc.entities = entities;
  doc.relationships = relationships;
  return doc;
};

const processMarkdown = async (
  content: string,
  doc: ProcessedDocument
): Promise<ProcessedDocument> => {
  doc.content = content;
  // Basic entity extraction from markdown
  const entities = extractEntitiesFromMarkdown(content);
  doc.entities = entities;
  return doc;
};

const extractEntitiesFromMarkdown = (content: string): Entity[] => {
  const entities: Entity[] = [];
  
  // Extract headings as potential entities
  const headingRegex = /^#+\s+(.+)$/gm;
  const headings = content.matchAll(headingRegex);
  
  for (const heading of headings) {
    entities.push({
      name: heading[1].trim(),
      type: 'heading'
    });
  }

  // Extract inline code as potential technical entities
  const codeRegex = /`([^`]+)`/g;
  const codes = content.matchAll(codeRegex);
  
  for (const code of codes) {
    entities.push({
      name: code[1],
      type: 'code'
    });
  }

  return entities;
};

const convertToMarkdown = async (
  file: File,
  doc: ProcessedDocument
): Promise<ProcessedDocument> => {
  // TODO: Integrate with Marker for conversion
  // For now, store original content
  doc.content = await file.text();
  return doc;
};