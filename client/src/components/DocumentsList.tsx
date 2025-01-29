import { useEffect, useState } from 'react';
import { Document, getDocuments, uploadDocument } from '@/api/schema';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import {
  FileText,
  Upload,
  File,
  RefreshCw,
  AlertCircle,
  Search,
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

export function DocumentsList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const { documents } = await getDocuments();
        setDocuments(documents);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load documents',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { document } = await uploadDocument(file);
      setDocuments((prev) => [document, ...prev]);
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.csv,.txt,.md"
          />
        </div>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div>Loading...</div>
          ) : filteredDocuments.length === 0 ? (
            <div>No documents found</div>
          ) : (
            filteredDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {doc.name}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(doc.size)} • {doc.type.toUpperCase()} •{' '}
                    {new Date(doc.uploadedAt).toLocaleString()}
                  </div>
                  <div className="mt-4">
                    {doc.status === 'processing' ? (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </div>
                        <Progress value={33} />
                      </div>
                    ) : doc.status === 'error' ? (
                      <div className="flex items-center text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Error processing document
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <File className="h-4 w-4 mr-2" />
                          {doc.embedding
                            ? `Embedded (${doc.embedding.dimensions}d)`
                            : 'Processed'}
                        </div>
                        {doc.embedding && (
                          <div className="text-xs text-muted-foreground">
                            Last updated:{' '}
                            {new Date(
                              doc.embedding.updatedAt
                            ).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}