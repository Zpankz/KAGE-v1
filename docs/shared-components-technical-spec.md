# Shared Unstructured Data Processing Components Technical Specification

## Overview

This document specifies the technical implementation of shared components for handling unstructured data processing across both the UnstructuredTab and DataInput components.

## 1. Core Infrastructure

### Processing Modes
```typescript
type ProcessingMode = 'quick' | 'full';

interface ProcessingContext {
  mode: ProcessingMode;
  source: 'dashboard' | 'data-tab';
  options: ProcessingOptions;
}

interface ProcessingOptions {
  extractEntities: boolean;
  generateGraph: boolean;
  previewEnabled: boolean;
  batchProcessing: boolean;
}
```

### Base Components

#### FileProcessor
```typescript
interface FileProcessorProps {
  mode: ProcessingMode;
  onFileSelected: (files: File[]) => void;
  onProcessingComplete: (result: ProcessingResult) => void;
  supportedTypes: string[];
  maxFileSize?: number;
  multiple?: boolean;
}

function FileProcessor(props: FileProcessorProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const validateFiles = useCallback((files: File[]) => {
    const errors: string[] = [];
    files.forEach(file => {
      if (!props.supportedTypes.some(type => file.type.match(type))) {
        errors.push(`Unsupported file type: ${file.type}`);
      }
      if (props.maxFileSize && file.size > props.maxFileSize) {
        errors.push(`File too large: ${file.name}`);
      }
    });
    return errors;
  }, [props.supportedTypes, props.maxFileSize]);

  const handleFiles = useCallback(async (files: File[]) => {
    const errors = validateFiles(files);
    if (errors.length) {
      setValidationErrors(errors);
      return;
    }
    setFiles(files);
    props.onFileSelected(files);
  }, [validateFiles, props.onFileSelected]);

  return (
    <div className="file-processor">
      <FileDropZone
        active={dragActive}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleFiles}
        multiple={props.multiple}
      />
      {validationErrors.length > 0 && (
        <ValidationErrors errors={validationErrors} />
      )}
      <FileList files={files} />
    </div>
  );
}
```

#### UrlProcessor
```typescript
interface UrlProcessorProps {
  mode: ProcessingMode;
  onUrlSubmit: (url: string) => void;
  onProcessingComplete: (result: ProcessingResult) => void;
  validateUrl?: (url: string) => boolean;
  showPreview?: boolean;
}

function UrlProcessor(props: UrlProcessorProps) {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    props.onUrlSubmit(url);
  }, [url, isValid, props.onUrlSubmit]);

  useEffect(() => {
    if (props.showPreview && isValid) {
      fetchUrlPreview(url).then(setPreview);
    }
  }, [url, isValid, props.showPreview]);

  return (
    <div className="url-processor">
      <UrlInput
        value={url}
        onChange={setUrl}
        onValidityChange={setIsValid}
        validate={props.validateUrl}
      />
      {props.showPreview && preview && (
        <UrlPreview content={preview} />
      )}
      <Button
        onClick={handleSubmit}
        disabled={!isValid}
      >
        Process URL
      </Button>
    </div>
  );
}
```

#### ProcessingStatus
```typescript
interface ProcessingStatusProps {
  status: ProcessingStatus;
  progress: number;
  error?: string;
  mode: ProcessingMode;
  onRetry?: () => void;
}

function ProcessingStatus(props: ProcessingStatusProps) {
  return (
    <div className="processing-status">
      <StatusBadge status={props.status} />
      {props.status === 'processing' && (
        <ProgressIndicator value={props.progress} />
      )}
      {props.error && (
        <ErrorDisplay
          error={props.error}
          onRetry={props.onRetry}
        />
      )}
    </div>
  );
}
```

## 2. Hooks and State Management

### Processing Hook
```typescript
interface UseProcessingResult {
  status: ProcessingStatus;
  progress: number;
  error: string | null;
  process: (input: File | string) => Promise<void>;
  reset: () => void;
}

function useProcessing(options: ProcessingOptions): UseProcessingResult {
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const process = useCallback(async (input: File | string) => {
    try {
      setStatus('processing');
      setProgress(0);
      setError(null);

      const processor = new ProcessingManager(options);
      await processor.process(input, (progress) => {
        setProgress(progress);
      });

      setStatus('completed');
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }, [options]);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setError(null);
  }, []);

  return { status, progress, error, process, reset };
}
```

### Shared State Management
```typescript
interface ProcessingState {
  queue: QueueItem[];
  processing: QueueItem | null;
  completed: ProcessedItem[];
  failed: FailedItem[];
}

const processingReducer = (state: ProcessingState, action: ProcessingAction): ProcessingState => {
  switch (action.type) {
    case 'QUEUE_ITEMS':
      return {
        ...state,
        queue: [...state.queue, ...action.items]
      };
    case 'START_PROCESSING':
      return {
        ...state,
        processing: action.item,
        queue: state.queue.filter(i => i.id !== action.item.id)
      };
    case 'COMPLETE_PROCESSING':
      return {
        ...state,
        processing: null,
        completed: [...state.completed, action.result]
      };
    case 'FAIL_PROCESSING':
      return {
        ...state,
        processing: null,
        failed: [...state.failed, action.error]
      };
    default:
      return state;
  }
};
```

## 3. Error Handling

```typescript
class ProcessingError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = false
  ) {
    super(message);
    this.name = 'ProcessingError';
  }
}

function handleProcessingError(error: unknown): ProcessingError {
  if (error instanceof ProcessingError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new ProcessingError(
      error.message,
      'UNKNOWN_ERROR',
      false
    );
  }
  
  return new ProcessingError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    false
  );
}
```

## 4. Integration Points

### With UnstructuredTab
```typescript
function UnstructuredTab() {
  const processing = useProcessing({
    mode: 'full',
    extractEntities: true,
    generateGraph: false,
    previewEnabled: true,
    batchProcessing: true
  });

  return (
    <div className="unstructured-tab">
      <FileProcessor
        mode="full"
        onFileSelected={processing.process}
        supportedTypes={['*/*']}
        multiple={true}
      />
      <UrlProcessor
        mode="full"
        onUrlSubmit={processing.process}
        showPreview={true}
      />
      <ProcessingStatus
        status={processing.status}
        progress={processing.progress}
        error={processing.error}
        onRetry={processing.reset}
      />
    </div>
  );
}
```

### With DataInput
```typescript
function DataInput() {
  const processing = useProcessing({
    mode: 'quick',
    extractEntities: true,
    generateGraph: true,
    previewEnabled: true,
    batchProcessing: false
  });

  return (
    <div className="data-input">
      <FileProcessor
        mode="quick"
        onFileSelected={processing.process}
        supportedTypes={['text/*', 'application/json']}
        multiple={false}
      />
      <UrlProcessor
        mode="quick"
        onUrlSubmit={processing.process}
        showPreview={true}
      />
      <ProcessingStatus
        status={processing.status}
        progress={processing.progress}
        error={processing.error}
        onRetry={processing.reset}
      />
    </div>
  );
}
```

## 5. Testing Strategy

```typescript
describe('Shared Processing Components', () => {
  describe('FileProcessor', () => {
    it('should validate file types', () => {
      // Implementation
    });

    it('should handle multiple files', () => {
      // Implementation
    });

    it('should show validation errors', () => {
      // Implementation
    });
  });

  describe('UrlProcessor', () => {
    it('should validate URLs', () => {
      // Implementation
    });

    it('should show preview when enabled', () => {
      // Implementation
    });

    it('should handle invalid URLs', () => {
      // Implementation
    });
  });

  describe('ProcessingStatus', () => {
    it('should show progress', () => {
      // Implementation
    });

    it('should handle errors', () => {
      // Implementation
    });

    it('should allow retry on error', () => {
      // Implementation
    });
  });
});
```

## 6. Performance Considerations

1. File Processing
- Implement chunked processing for large files
- Use Web Workers for heavy processing
- Cache processed results
- Implement request debouncing

2. URL Processing
- Implement request caching
- Add rate limiting
- Handle timeouts gracefully
- Cache previews

3. State Management
- Implement efficient state updates
- Use memoization for expensive computations
- Optimize re-renders
- Use virtual scrolling for large lists

4. Error Recovery
- Implement automatic retries
- Add fallback processing options
- Cache partial results
- Implement progressive enhancement