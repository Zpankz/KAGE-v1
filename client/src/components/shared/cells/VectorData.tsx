import { useState } from 'react';
import { Copy, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface VectorDataProps {
  vector: number[];
  truncateAt?: number;
  precision?: number;
  className?: string;
}

export function VectorData({
  vector,
  truncateAt = 5,
  precision = 6,
  className,
}: VectorDataProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const formattedVector = vector.map(v => v.toFixed(precision));
  const displayVector = isExpanded 
    ? formattedVector 
    : formattedVector.slice(0, truncateAt);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedVector.join(', '));
    toast({
      title: 'Copied',
      description: 'Vector data copied to clipboard',
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 px-2"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <div className="font-mono text-sm">
          [{displayVector.join(', ')}
          {!isExpanded && vector.length > truncateAt && ', ...'}]
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy vector data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {isExpanded && (
        <div className="text-xs text-muted-foreground">
          {vector.length} dimensions
        </div>
      )}
    </div>
  );
}