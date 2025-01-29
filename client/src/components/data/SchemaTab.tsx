import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Schema, getSchemas, setDefaultSchema } from '@/api/data';
import { SchemaGraph } from '@/components/SchemaGraph';
import {
  Plus,
  Upload,
  Download,
  Star,
  Pencil,
  CheckCircle2,
} from 'lucide-react';

export function SchemaTab() {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSchemas = async () => {
      try {
        const { schemas } = await getSchemas();
        setSchemas(schemas);
        if (schemas.length > 0) {
          setSelectedSchema(schemas[0]);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load schemas',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSchemas();
  }, [toast]);

  const handleSetDefault = async (schemaId: string) => {
    try {
      await setDefaultSchema(schemaId);
      setSchemas(schemas.map(schema => ({
        ...schema,
        isDefault: schema.id === schemaId
      })));
      toast({
        title: 'Success',
        description: 'Default schema updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update default schema',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead className="w-[100px]">Hierarchy</TableHead>
              <TableHead className="w-[100px]">Categories</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Default</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : schemas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No schemas found
                </TableCell>
              </TableRow>
            ) : (
              schemas.map((schema) => (
                <TableRow
                  key={schema.id}
                  className={
                    selectedSchema?.id === schema.id
                      ? 'bg-muted/50'
                      : undefined
                  }
                  onClick={() => setSelectedSchema(schema)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell className="font-medium">{schema.name}</TableCell>
                  <TableCell>{schema.topics.join(', ')}</TableCell>
                  <TableCell>{schema.hierarchyLevels}</TableCell>
                  <TableCell>{schema.categories}</TableCell>
                  <TableCell className="capitalize">
                    {schema.generationType}
                  </TableCell>
                  <TableCell>
                    {schema.isDefault ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(schema.id);
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Schema Graph</h3>
        </div>
        <div className="h-[calc(100vh-20rem)] p-4">
          <SchemaGraph />
        </div>
      </div>
    </div>
  );
}