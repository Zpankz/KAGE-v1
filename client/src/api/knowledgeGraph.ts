import api from './api';

// ... (keep all previous interfaces up until compareNodes)
interface NodeDetails {
  id: string;
  label: string;
  type: string;
  summary: string;
  properties: { key: string; value: string | number }[];
  relations: { type: string; target: string; label: string }[];
  analytics: {
    centrality: {
      degree: number;
      betweenness: number;
      closeness: number;
    };
    community: string;
    importance: number;
  };
  embeddings: {
    model: string;
    vector: number[];
    similarity: number[];
  };
}

export const compareNodes = (nodeIds: string[]) => {
  return new Promise<{ details: NodeDetails[]; comparison: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        details: nodeIds.map(id => ({
          id,
          label: `Concept ${id}`,
          type: 'concept',
          summary: `This is a summary for concept ${id} in the knowledge graph.`,
          properties: [
            { key: 'field', value: 'Computer Science' },
            { key: 'importance', value: 0.8 + Math.random() * 0.2 }
          ],
          relations: [
            { type: 'related_to', target: `Concept ${(parseInt(id) + 1)}`, label: 'Related' }
          ],
          analytics: {
            centrality: {
              degree: 0.7 + Math.random() * 0.3,
              betweenness: 0.7 + Math.random() * 0.3,
              closeness: 0.7 + Math.random() * 0.3
            },
            community: 'AI Technologies',
            importance: 0.7 + Math.random() * 0.3
          },
          embeddings: {
            model: 'text-embedding-3-large',
            vector: Array(384).fill(0).map(() => Math.random()),
            similarity: [0.8 + Math.random() * 0.2, 0.7 + Math.random() * 0.2]
          }
        })),
        comparison: `# Concept Comparison Analysis

## Key Distinctions
- Node A focuses on fundamental machine learning concepts
- Node B specializes in neural network architectures
- Node C emphasizes deep learning implementations

## Interconnections
1. Direct Relationships:
   - Node A → Node B: Foundational concepts enable neural network understanding
   - Node B → Node C: Neural architectures support deep learning models

2. Predicted Links:
   - Knowledge transfer pathways identified between concepts
   - Shared theoretical foundations suggest strong coupling
   - Common application domains indicate practical synergies

## Integration Analysis
Based on centrality and community metrics:

1. Core Function:
   - High betweenness centrality suggests bridge concepts
   - Community overlap indicates unified knowledge domain
   - Centrality patterns reveal hierarchical relationships

2. Contextual Significance:
   - Concepts form a coherent learning progression
   - Strong community cohesion supports integrated understanding
   - Centrality distribution suggests balanced knowledge structure`
      });
    }, 800);
  });
};

export async function processUnstructuredData(data: unknown) {
  // Mock graph generation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nodes: [
          { id: '1', label: 'Machine Learning', type: 'concept', x: 100, y: 100 },
          { id: '2', label: 'Neural Networks', type: 'concept', x: 200, y: 100 },
          { id: '3', label: 'Deep Learning', type: 'concept', x: 300, y: 100 },
          { id: '4', label: 'Training', type: 'process', x: 150, y: 200 },
          { id: '5', label: 'Inference', type: 'process', x: 250, y: 200 }
        ],
        edges: [
          { source: '1', target: '2', label: 'includes' },
          { source: '2', target: '3', label: 'enables' },
          { source: '1', target: '4', label: 'requires' },
          { source: '3', target: '5', label: 'performs' }
        ]
      });
    }, 500);
  });
}