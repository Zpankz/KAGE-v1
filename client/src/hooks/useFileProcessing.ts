import { useState, useCallback } from 'react';
import { processDocument } from '@/services/documentProcessor';
import { uploadDocument } from '@/api/schema';
import { useToast } from './use-toast';

export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

interface UseFileProcessingOptions {
  onSuccess?: (document: any) => void;
  validateType?: (file: File) => boolean;
}

export function useFileProcessing(options: UseFileProcessingOptions = {}) {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateFileType = useCallback((file: File): boolean => {
    if (options.validateType) {
      return options.validateType(file);
    }
    
    const validTypes = [
      'text/plain',
      'application/json',
      'text/markdown',
      'application/pdf',
      'text/csv',
      'application/rdf+xml',
      'text/turtle',
      'text/n3'
    ];
    
    return validTypes.includes(file.type) || 
           file.name.match(/\.(json|md|pdf|csv|rdf|ttl|n3)$/i) !== null;
  }, [options.validateType]);

  const processFile = useCallback(async (file: File) => {
    if (!validateFileType(file)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a supported file type.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setStatus('processing');
      setProgress(0);
      setError(null);

      // Process the file
      const processedDoc = await processDocument(file);
      setProgress(50);

      // Upload the processed document
      const { document } = await uploadDocument(file, {
        content: processedDoc.content,
        entities: processedDoc.entities
      });
      
      setProgress(100);
      setStatus('completed');
      
      options.onSuccess?.(document);
      
      toast({
        title: 'Success',
        description: 'File processed successfully'
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to process file');
      
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to process file',
        variant: 'destructive'
      });
    }
  }, [validateFileType, options.onSuccess, toast]);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setError(null);
  }, []);

  return {
    status,
    progress,
    error,
    processFile,
    reset
  };
}