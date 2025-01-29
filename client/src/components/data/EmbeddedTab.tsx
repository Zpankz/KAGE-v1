import { useState, useEffect } from 'react';
import { DataTable, Column } from '../shared/tables/DataTable';
import { HyperlinkCell } from '../shared/cells/HyperlinkCell';
import { VectorData } from '../shared/cells/VectorData';
import { Embedding, getEmbeddings, downloadEmbedding, viewEmbedding } from '@/api/embeddings';
import { useToast } from '@/hooks/use-toast';
import { Download, Eye, Loader2 } from 'lucide-react';

export function EmbeddedTab() {
  const [embeddings, setEmbeddings] = useState<Embedding[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const columns: Column<Embedding>[] = [
    {
      key: 'document',
      header: 'Source',
      searchable: true,
      width: '200px',
      render: (value) => {
        const doc = value as { id: string; name: string };
        return (
          <HyperlinkCell
            to={`/documents/${doc.id}`}
            text={doc.name}
          />
        );
      },
    },
    {
      key: 'dimensions',
      header: 'Dimensions',
      sortable: true,
      width: '120px',
      render: (value) => `${String(value)}d`,
    },
    {
      key: 'llmModel',
      header: 'LLM Model',
      searchable: true,
      width: '150px',
    },
    {
      key: 'schema',
      header: 'Schema',
      width: '150px',
      render: (value) => {
        const schema = value as { id: string; name: string } | undefined;
        return schema ? (
          <HyperlinkCell
            to={`/schema/${schema.id}`}
            text={schema.name}
          />
        ) : (
          '-'
        );
      },
    },
    {
      key: 'triplesCount',
      header: 'Triples',
      sortable: true,
      width: '100px',
      render: (value, item) => (
        <HyperlinkCell
          to={`/triples?embedding=${item.id}`}
          text={String(value)}
        />
      ),
    },
    {
      key: 'vector',
      header: 'Vector Data',
      width: '300px',
      render: (value) => (
        <VectorData
          vector={value as number[]}
          truncateAt={5}
          precision={6}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      width: '160px',
      render: (value) => new Date(String(value)).toLocaleString(),
    },
  ];

  const handleDownload = async (embedding: Embedding) => {
    try {
      await downloadEmbedding(embedding.id);
      toast({
        title: 'Success',
        description: 'Embedding data downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download embedding data',
        variant: 'destructive',
      });
    }
  };

  const handleView = async (embedding: Embedding) => {
    try {
      await viewEmbedding(embedding.id);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to view embedding data',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchEmbeddings = async () => {
      setLoading(true);
      try {
        const { embeddings } = await getEmbeddings();
        setEmbeddings(embeddings);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load embeddings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmbeddings();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <DataTable
      data={embeddings}
      columns={columns}
      onView={handleView}
      onDownload={handleDownload}
      defaultSort={{ column: 'createdAt', direction: 'desc' }}
    />
  );
}