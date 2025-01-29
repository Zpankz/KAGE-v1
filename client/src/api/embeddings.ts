export interface Embedding {
  id: string;
  dimensions: number;
  vector: number[];
  llmModel: string;
  document: {
    id: string;
    name: string;
  };
  schema?: {
    id: string;
    name: string;
  };
  triplesCount: number;
  createdAt: string;
}

export async function getEmbeddings(): Promise<{ embeddings: Embedding[] }> {
  // TODO: Implement actual API call
  return { embeddings: [] };
}

export async function downloadEmbedding(id: string): Promise<void> {
  // TODO: Implement actual API call
  console.log('Downloading embedding:', id);
}

export async function viewEmbedding(id: string): Promise<void> {
  // TODO: Implement actual API call
  console.log('Viewing embedding:', id);
}