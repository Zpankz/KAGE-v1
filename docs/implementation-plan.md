# UnstructuredTab and DataInput Enhancement Implementation Plan

## Overview
This document outlines the plan for enhancing both the UnstructuredTab component and the DataInput component to provide consistent functionality for handling unstructured data across the application.

## 1. Shared Infrastructure

### Create Shared Components
```typescript
// client/src/components/shared/unstructured/
├── FileProcessor/
│   ├── FileDropZone.tsx
│   ├── FilePreview.tsx
│   └── FileTypeValidator.tsx
├── UrlProcessor/
│   ├── UrlInput.tsx
│   ├── UrlPreview.tsx
│   └── UrlValidator.tsx
├── ProcessingStatus/
│   ├── ProgressIndicator.tsx
│   ├── StatusBadge.tsx
│   └── ErrorDisplay.tsx
└── EntityDisplay/
    ├── EntityList.tsx
    ├── EntityGraph.tsx
    └── EntityFilter.tsx
```

### Shared Hooks and Utils
```typescript
// client/src/hooks/unstructured/
├── useFileProcessing.ts
├── useUrlProcessing.ts
├── useEntityExtraction.ts
└── useProcessingQueue.ts
```

## 2. Component-Specific Implementations

### UnstructuredTab (Data Section)
- Full document management interface
- Extended file type support
- Detailed entity visualization
- Document history and status tracking

### DataInput (Dashboard)
- Streamlined interface for quick input
- Real-time graph preview
- Simplified entity extraction
- Collapsible interface
- Direct graph generation

## 3. Technical Improvements

### Document Processing Service
```typescript
interface ProcessingOptions {
  mode: 'full' | 'quick';
  extractEntities: boolean;
  generateGraph: boolean;
  previewOnly: boolean;
}

class UnstructuredProcessor {
  async process(input: File | string, options: ProcessingOptions) {
    // Implementation varies based on mode
  }
}
```

### Entity Extraction
```typescript
interface EntityExtractionOptions {
  depth: 'basic' | 'detailed';
  types: EntityType[];
  relationshipDetection: boolean;
}

class EntityExtractor {
  async extract(content: string, options: EntityExtractionOptions) {
    // Implementation varies based on options
  }
}
```

## 4. UI Components

### Shared Features
- File type detection
- Progress indicators
- Error handling
- Basic entity extraction

### UnstructuredTab Specific
```typescript
function UnstructuredTab() {
  return (
    <div className="space-y-6">
      <ProcessorTabs>
        <FileProcessorPanel mode="full" />
        <UrlProcessorPanel mode="full" />
      </ProcessorTabs>
      <EntityVisualization mode="detailed" />
      <DocumentHistory />
    </div>
  );
}
```

### DataInput Specific
```typescript
function DataInput() {
  return (
    <div className="space-y-4">
      <ProcessorTabs>
        <FileProcessorPanel mode="quick" />
        <UrlProcessorPanel mode="quick" />
      </ProcessorTabs>
      <GraphPreview />
    </div>
  );
}
```

## 5. Implementation Phases

### Phase 1: Shared Infrastructure
1. Create shared component directory structure
2. Implement base processing hooks
3. Set up shared types and utilities
4. Create basic UI components

### Phase 2: UnstructuredTab Enhancement
1. Implement full document management
2. Add detailed entity visualization
3. Add document history tracking
4. Enhance file type support

### Phase 3: DataInput Enhancement
1. Integrate shared components
2. Implement quick processing mode
3. Add graph preview
4. Enhance collapsible interface

### Phase 4: Integration and Testing
1. Ensure consistent behavior
2. Test both processing modes
3. Optimize performance
4. Add error recovery

## 6. API Updates

### Processing API
```typescript
interface ProcessingRequest {
  input: File | string;
  mode: 'full' | 'quick';
  options: ProcessingOptions;
}

interface ProcessingResponse {
  entities: Entity[];
  graphData?: GraphData;
  preview?: string;
  status: ProcessingStatus;
}
```

## 7. State Management

### Shared State
```typescript
interface SharedProcessingState {
  status: ProcessingStatus;
  entities: Entity[];
  errors: ProcessingError[];
}
```

### Component-Specific State
```typescript
// UnstructuredTab
interface TabProcessingState extends SharedProcessingState {
  documents: ProcessedDocument[];
  history: ProcessingHistory[];
}

// DataInput
interface InputProcessingState extends SharedProcessingState {
  preview: GraphPreview;
  isCollapsed: boolean;
}
```

## 8. Testing Strategy

### Unit Tests
- Shared components
- Processing hooks
- Entity extraction
- File type detection

### Integration Tests
- Full processing pipeline
- Quick processing pipeline
- Graph generation
- Error handling

### UI Tests
- Component interactions
- State management
- User feedback
- Error recovery

## 9. Documentation

### Technical Documentation
- Component API documentation
- Processing pipeline documentation
- Integration guide
- Testing guide

### User Documentation
- Feature documentation
- Supported file types
- Processing modes
- Troubleshooting guide

## 10. Migration Strategy

1. Create shared infrastructure
2. Update UnstructuredTab gradually
3. Integrate with DataInput
4. Test both implementations
5. Deploy changes incrementally