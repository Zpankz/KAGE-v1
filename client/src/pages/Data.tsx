import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { UnstructuredTab } from '@/components/data/UnstructuredTab';
import { EmbeddedTab } from '@/components/data/EmbeddedTab';
import { TriplesTab } from '@/components/data/TriplesTab';

export function Data() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Management</h1>
        <p className="text-muted-foreground">
          View and manage your unstructured data, embeddings, and triples
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="unstructured">
            <TabsList className="mb-4">
              <TabsTrigger value="unstructured">
                Unstructured Data
              </TabsTrigger>
              <TabsTrigger value="embeddings">
                Embeddings
              </TabsTrigger>
              <TabsTrigger value="triples">
                Triples
              </TabsTrigger>
            </TabsList>
            <TabsContent value="unstructured" className="m-0">
              <UnstructuredTab />
            </TabsContent>
            <TabsContent value="embeddings" className="m-0">
              <EmbeddedTab />
            </TabsContent>
            <TabsContent value="triples" className="m-0">
              <TriplesTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}