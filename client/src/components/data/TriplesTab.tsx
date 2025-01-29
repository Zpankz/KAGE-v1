import { useEffect, useState } from 'react';
import { Column, DataTable } from '@/components/shared/tables/DataTable';
import { Triple, getTriples, downloadTriple, viewTriple } from '@/api/triples';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HyperlinkCell } from '../shared/cells/HyperlinkCell';

export function TriplesTab() {
  const [triples, setTriples] = useState<Triple[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTriples = async () => {
      try {
        const { triples } = await getTriples();
        setTriples(triples);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load triples',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadTriples();
  }, [toast]);

  const columns = [
    {
      key: 'subject',
      header: 'Subject',
      searchable: true,
    },
    {
      key: 'predicate',
      header: 'Predicate',
      searchable: true,
    },
    {
      key: 'object',
      header: 'Object',
      searchable: true,
    },
    {
      key: 'document',
      header: 'Source',
      width: '200px',
      render: (value: any) => (
        <HyperlinkCell
          to={`/documents/${value.id}`}
          text={value.name}
        />
      ),
    },
    {
      key: 'embedding',
      header: 'Model',
      width: '150px',
      render: (value: any) => value.llmModel,
    },
    {
      key: 'created',
      header: 'Created',
      width: '200px',
      render: (value: string) => new Date(value).toLocaleString(),
      sortable: true,
    },
  ];

  const handleView = async (triple: Triple) => {
    try {
      await viewTriple(triple.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to view triple',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (triple: Triple) => {
    try {
      await downloadTriple(triple.id);
      toast({
        title: 'Success',
        description: 'Triple downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download triple',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search triples..."
            className="pl-8"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Triple
        </Button>
      </div>

      <DataTable<Triple>
        data={triples}
        columns={columns as Column<Triple>[]}
        onView={handleView}
        onDownload={handleDownload}
        defaultSort={{ column: 'created' as keyof Triple, direction: 'desc' }}
      />
    </div>
  );
}