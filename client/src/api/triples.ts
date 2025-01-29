export interface Triple {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  created: string;
  embedding: {
    id: string;
    llmModel: string;
  };
  document: {
    id: string;
    name: string;
  };
  schema: {
    id: string;
    name: string;
  };
}

export async function getTriples(): Promise<{ triples: Triple[] }> {
  // TODO: Implement actual API call
  return { triples: [] };
}

export async function downloadTriple(id: string): Promise<void> {
  // TODO: Implement actual API call
  console.log('Downloading triple:', id);
}

export async function viewTriple(id: string): Promise<void> {
  // TODO: Implement actual API call
  console.log('Viewing triple:', id);
}