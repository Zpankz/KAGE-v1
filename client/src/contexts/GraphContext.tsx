import React, { createContext, useContext, useState, useCallback } from 'react';

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  properties: Record<string, any>;
  relations: string[];
  centrality: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

export type PathwayMode = 'direct' | 'importance' | 'context' | null;

interface GraphContextType {
  graphData: GraphData;
  selectedNodes: string[];
  pathwayMode: PathwayMode;
  setGraphData: (data: { nodes: GraphNode[], edges: GraphEdge[] }) => void;
  setSelectedNodes: (nodes: string[] | ((prev: string[]) => string[])) => void;
  updateGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  setPathwayMode: (mode: PathwayMode) => void;
}

const initialGraphData: GraphData = {
  nodes: [],
  links: []
};

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export function GraphProvider({ children }: { children: React.ReactNode }) {
  const [graphData, setGraphData] = useState<GraphData>(initialGraphData);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [pathwayMode, setPathwayMode] = useState<PathwayMode>(null);

  const transformEdgeToLink = (edge: GraphEdge) => ({
    source: edge.source,
    target: edge.target,
    label: edge.label,
    weight: edge.weight
  });

  const updateGraph = useCallback((nodes: GraphNode[], edges: GraphEdge[]) => {
    setGraphData((prev) => ({
      nodes: [...prev.nodes, ...nodes],
      links: [...prev.links, ...edges.map(transformEdgeToLink)]
    }));
  }, []);

  const handleSetGraphData = useCallback((data: { nodes: GraphNode[], edges: GraphEdge[] }) => {
    // Ensure we have valid nodes and edges
    if (!data.nodes || !data.edges) {
      console.warn('Invalid graph data provided');
      return;
    }

    // Transform the data to match ForceGraph2D's expected format
    const transformedData: GraphData = {
      nodes: data.nodes.map(node => ({
        ...node,
        id: String(node.id), // Ensure IDs are strings
        label: node.label || `Node ${node.id}`, // Provide fallback label
      })),
      links: data.edges.map(edge => ({
        ...transformEdgeToLink(edge),
        source: String(edge.source), // Ensure source is a string
        target: String(edge.target), // Ensure target is a string
      }))
    };

    setGraphData(transformedData);
  }, []);

  return (
    <GraphContext.Provider
      value={{
        graphData,
        selectedNodes,
        pathwayMode,
        setGraphData: handleSetGraphData,
        setSelectedNodes,
        updateGraph,
        setPathwayMode
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}