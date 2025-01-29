import { useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useGraph } from '@/contexts/GraphContext';
import { useTheme } from 'next-themes';

export function GraphVisualization() {
  const { graphData, selectedNodes, setSelectedNodes } = useGraph();
  const graphRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNodes((prev) => {
      if (prev.includes(node.id)) {
        return prev.filter((id) => id !== node.id);
      }
      return [...prev, node.id];
    });
  }, [setSelectedNodes]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && graphRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        graphRef.current.width(width);
        graphRef.current.height(height);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0) {
      graphRef.current.d3Force('charge').strength(-300);
      graphRef.current.d3Force('link').distance(100);

      // Center the graph
      setTimeout(() => {
        graphRef.current.zoomToFit(400);
        graphRef.current.centerAt();
      }, 300);
    }
  }, [graphData.nodes]);

  const nodeColor = useCallback((node: any) => {
    if (selectedNodes.includes(node.id)) {
      return theme === 'dark' ? '#ff79c6' : '#0ea5e9';
    }
    return theme === 'dark' ? '#bd93f9' : '#3b82f6';
  }, [selectedNodes, theme]);

  if (!graphData.nodes.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">No graph data available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg shadow-lg overflow-hidden bg-transparent"
      style={{ position: 'relative' }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeColor={nodeColor}
        nodeRelSize={6}
        linkColor={() => theme === 'dark' ? '#6272a4' : '#94a3b8'}
        linkWidth={2}
        onNodeClick={handleNodeClick}
        backgroundColor="transparent"
        nodeLabel="label"
        enableZoomInteraction={true}
        enablePanInteraction={true}
        enableNodeDrag={true}
      />
    </div>
  );
}