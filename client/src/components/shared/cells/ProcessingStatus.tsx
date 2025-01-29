import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export type ProcessingState = 'processing' | 'error' | 'completed';

interface ProcessingStatusProps {
  status: ProcessingState;
  progress?: number;
  error?: string;
}

export function ProcessingStatus({
  status,
  progress = 33,
  error,
}: ProcessingStatusProps) {
  if (status === 'processing') {
    return (
      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </div>
        <Progress value={progress} />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        className="flex items-center text-sm text-destructive"
        title={error}
      >
        <AlertCircle className="h-4 w-4 mr-2" />
        Error processing document
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <CheckCircle className="h-4 w-4 mr-2" />
      Completed
    </div>
  );
}