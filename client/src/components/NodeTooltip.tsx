import { useGraph } from '@/contexts/GraphContext';
import { useEffect, useState } from 'react';
import { compareNodes } from '@/api/knowledgeGraph';
import { ScrollArea } from './ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Brain, Network, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '@/hooks/use-toast';

export function NodeTooltip() {
  const { selectedNodes } = useGraph();
  const [nodeDetails, setNodeDetails] = useState<NodeDetails[]>([]);
  const [comparison, setComparison] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!selectedNodes.length) {
        setNodeDetails([]);
        setComparison(null);
        return;
      }

      setLoading(true);
      try {
        const { details, comparison } = await compareNodes(selectedNodes);
        setNodeDetails(details);
        setComparison(comparison);
      } catch (error) {
        console.error('Failed to fetch node details:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch node details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedNodes, toast]);

  if (!selectedNodes.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select nodes to view details
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading details...</p>
      </div>
    );
  }

  if (!nodeDetails.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No details available for selected nodes
      </div>
    );
  }

  if (selectedNodes.length === 1 && nodeDetails[0]) {
    // Single node view
    const details = nodeDetails[0];
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{details.label}</CardTitle>
              <CardDescription>Type: {details.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground">{details.summary}</p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Centrality Metrics
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(details.analytics.centrality).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-muted-foreground capitalize">
                        {key}
                      </div>
                      <div className="text-sm font-medium">
                        {(value as number).toFixed(3)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Relations
                </h4>
                <div className="space-y-2">
                  {details.relations.map((relation: { type: string; target: string }, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Badge variant="outline">{relation.type}</Badge>
                      <span className="text-sm">{relation.target}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Embeddings
                </h4>
                <div className="text-sm space-y-1">
                  <div>Model: {details.embeddings.model}</div>
                  <div>Dimensions: {details.embeddings.vector.length}</div>
                  <div className="text-xs text-muted-foreground">
                    Similarity: {details.embeddings.similarity.map(s => s.toFixed(3)).join(', ')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  // Multi-node comparison view
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {comparison && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>
                Comparison of selected nodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{comparison}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Node Comparison</CardTitle>
            <CardDescription>
              Comparing {selectedNodes.length} selected nodes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="properties" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="centrality">Centrality</TabsTrigger>
                <TabsTrigger value="relations">Relations</TabsTrigger>
                <TabsTrigger value="embeddings">Embeddings</TabsTrigger>
              </TabsList>

              <TabsContent value="properties">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      {nodeDetails.map((node) => (
                        <TableHead key={node.id}>{node.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Type</TableCell>
                      {nodeDetails.map((node) => (
                        <TableCell key={node.id}>{node.type}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Community</TableCell>
                      {nodeDetails.map((node) => (
                        <TableCell key={node.id}>{node.analytics.community}</TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Importance</TableCell>
                      {nodeDetails.map((node) => (
                        <TableCell key={node.id}>
                          {node.analytics.importance.toFixed(3)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="centrality">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      {nodeDetails.map((node) => (
                        <TableHead key={node.id}>{node.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(nodeDetails[0].analytics.centrality).map((metric) => (
                      <TableRow key={metric}>
                        <TableCell className="font-medium capitalize">
                          {metric}
                        </TableCell>
                        {nodeDetails.map((node) => (
                          <TableCell key={node.id}>
                            {node.analytics.centrality[metric as keyof typeof node.analytics.centrality].toFixed(3)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="relations">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Node</TableHead>
                      <TableHead>Relations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nodeDetails.map((node) => (
                      <TableRow key={node.id}>
                        <TableCell className="font-medium">{node.label}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {node.relations.map((relation: {type: string, target: string}, idx: number) => (
                              <Badge key={idx} variant="outline">
                                {relation.type}: {relation.target}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="embeddings">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Node</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Similarity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nodeDetails.map((node) => (
                      <TableRow key={node.id}>
                        <TableCell className="font-medium">{node.label}</TableCell>
                        <TableCell>{node.embeddings.model}</TableCell>
                        <TableCell>{node.embeddings.vector.length}</TableCell>
                        <TableCell>
                          {node.embeddings.similarity.map(s => s.toFixed(3)).join(', ')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}