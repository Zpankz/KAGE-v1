import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useGraph } from '@/contexts/GraphContext';
import { processUnstructuredData } from '@/api/knowledgeGraph';
import { FileText, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DataInputProps {
  initialMode?: 'text' | 'file' | 'url';
  onClose?: () => void;
}

export function DataInput({ initialMode = 'text', onClose }: DataInputProps) {
  const [mode] = useState(initialMode);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlMode, setUrlMode] = useState('single');
  const { setGraphData } = useGraph();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide input data',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsProcessing(true);
      const result = await processUnstructuredData({
        data: inputValue,
        type: mode,
        ...(mode === 'url' && { urlMode })
      });

      if (result) {
        setGraphData({
          nodes: result.nodes,
          edges: result.edges
        });
        toast({
          title: 'Success',
          description: 'Knowledge graph generated successfully'
        });
        if (onClose) onClose();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process data',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getInputSection = () => {
    switch (mode) {
      case 'text':
        return (
          <div className="space-y-4">
            <textarea
              className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Paste your text here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        );
      case 'file':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setInputValue(file.name);
                  }
                }}
                disabled={isProcessing}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isProcessing}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              {inputValue && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Selected: {inputValue}
                </p>
              )}
            </div>
          </div>
        );
      case 'url':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL Mode</Label>
              <Tabs value={urlMode} onValueChange={setUrlMode} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="single">Single</TabsTrigger>
                  <TabsTrigger value="multiple">Multiple</TabsTrigger>
                  <TabsTrigger value="domain">Domain</TabsTrigger>
                  <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Input
              type="url"
              placeholder="Enter URL..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        );
    }
  };

  const titles = {
    text: 'Process Text',
    file: 'Upload File',
    url: 'Process URL'
  };

  const descriptions = {
    text: 'Paste your text content to generate a knowledge graph',
    file: 'Upload a file to extract knowledge graph data',
    url: 'Enter a URL to process its content'
  };

  const icons = {
    text: <FileText className="h-4 w-4 mr-2" />,
    file: <Upload className="h-4 w-4 mr-2" />,
    url: <LinkIcon className="h-4 w-4 mr-2" />
  };

  return (
    <div className="flex flex-col h-full">
      <DialogHeader>
        <DialogTitle>{titles[mode]}</DialogTitle>
        <DialogDescription>{descriptions[mode]}</DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          {getInputSection()}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </div>
              <Progress value={33} />
            </div>
          )}
        </div>
      </ScrollArea>

      <DialogFooter className="pt-4">
        <Button variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isProcessing}>
          {icons[mode]}
          Generate
        </Button>
      </DialogFooter>
    </div>
  );
}