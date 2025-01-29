import { useState } from 'react';
import { DataTable } from '@/components/shared/tables/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  FileText,
  Upload,
  Link as LinkIcon,
  Globe,
  FileUp,
  Loader2,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Document } from '@/api/schema';
import { cn } from '@/lib/utils';
import isURL from 'validator/lib/isURL';
import { useFileProcessing } from '@/hooks/useFileProcessing';
import type { Column } from '@/components/shared/tables/DataTable';

export function UnstructuredTab() {
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const {
    status: fileStatus,
    progress: fileProgress,
    error: fileError,
    processFile,
    reset: resetFileProcessing
  } = useFileProcessing({
    onSuccess: (doc) => {
      setDocuments(prev => [doc, ...prev]);
    }
  });

  const validateUrl = (input: string) => {
    const isValid = isURL(input, {
      require_protocol: true,
      require_valid_protocol: true,
      protocols: ['http', 'https']
    });
    setIsUrlValid(isValid);
    return isValid;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    // Process each file
    for (const file of files) {
      await processFile(file);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUrlValid) return;
    
    // For now, just add URL as a document
    // URL processing will be implemented similarly to file processing
    setDocuments(prev => [{
      id: Math.random().toString(36).substring(7),
      name: url,
      type: 'url',
      size: 0,
      status: 'completed',
      uploadedAt: new Date().toISOString()
    }, ...prev]);
    
    setUrl('');
  };

  const renderProcessingStatus = () => {
    if (fileStatus === 'processing') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </div>
          <Progress value={fileProgress} />
        </div>
      );
    }

    if (fileStatus === 'error') {
      return (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          {fileError}
        </div>
      );
    }

    if (fileStatus === 'completed') {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          Processing complete
        </div>
      );
    }

    return null;
  };

  const columns: Column<Document>[] = [
    {
      key: 'name',
      header: 'Name',
      searchable: true,
      render: (_, item) => (
        <div className="flex items-center gap-2">
          {item.type === 'url' ? (
            <Globe className="h-4 w-4 text-muted-foreground" />
          ) : (
            <FileText className="h-4 w-4 text-muted-foreground" />
          )}
          <span>{item.name}</span>
          {item.entities && item.entities.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {item.entities.length} entities
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      width: '100px',
      render: (value) => (
        <Badge variant="outline">
          {String(value).toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '200px',
      render: (value) => {
        const status = String(value);
        return (
          <div className="flex items-center gap-2">
            {status === 'completed' ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : status === 'error' ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <span className="capitalize">{status}</span>
          </div>
        );
      }
    },
    {
      key: 'size',
      header: 'Size',
      width: '100px',
      render: (value) => formatFileSize(Number(value))
    },
    {
      key: 'uploadedAt',
      header: 'Uploaded',
      width: '200px',
      render: (value) => new Date(String(value)).toLocaleString(),
      sortable: true
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'file' | 'url')}>
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="file">
                <FileUp className="h-4 w-4 mr-2" />
                File Upload
              </TabsTrigger>
              <TabsTrigger value="url">
                <LinkIcon className="h-4 w-4 mr-2" />
                URL Import
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="file" className="space-y-4">
                <div className="flex flex-col gap-4">
                  <Label htmlFor="file-upload">Upload Files</Label>
                  <div className="flex gap-4">
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.csv,.txt,.md,.json,.rdf,.ttl,.n3"
                      multiple
                      disabled={fileStatus === 'processing'}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={fileStatus === 'processing'}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                  </div>
                  {renderProcessingStatus()}
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url-input">Enter URL</Label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Input
                          id="url-input"
                          type="url"
                          value={url}
                          onChange={(e) => {
                            setUrl(e.target.value);
                            validateUrl(e.target.value);
                          }}
                          placeholder="https://example.com"
                          className={cn(
                            'w-full',
                            url && !isUrlValid && 'border-destructive'
                          )}
                        />
                        {url && !isUrlValid && (
                          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Please enter a valid URL
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        disabled={!isUrlValid}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Process URL
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <DataTable
        data={documents}
        columns={columns}
        defaultSort={{ column: 'uploadedAt', direction: 'desc' }}
      />
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