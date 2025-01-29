# Triples View Architecture

## Overview

The triples view provides a comprehensive interface for displaying and managing knowledge graph triples, with enhanced tooltips, cross-linking capabilities, and integrated metadata display.

## Components

### TriplesTable

Main component for displaying triple data in a tabular format.

```typescript
interface TriplesTableProps {
  data: Triple[];
  onViewSource: (id: string) => void;
  onViewEmbeddings: (id: string) => void;
  onViewSchema: (id: string) => void;
}

interface Triple {
  id: string;
  subject: {
    entity: string;
    type: string;
    description: string;
  };
  predicate: {
    relationship: string;
    description: string;
    direction: 'outward' | 'inward';
  };
  object: {
    entity: string;
    type: string;
    description: string;
  };
  metadata: {
    createdAt: string;
    sourceDocument: {
      id: string;
      name: string;
      type: string;
    };
    embeddings: Array<{
      id: string;
      llmType: string;
      dimensions: number;
    }>;
    schema: {
      id: string;
      name: string;
      version: string;
    };
  };
}
```

### TooltipSystem

Enhanced tooltip component for displaying entity and relationship information.

```typescript
interface TooltipProps {
  type: 'subject' | 'predicate' | 'object';
  content: {
    title: string;
    description: string;
    type?: string;
    direction?: 'outward' | 'inward';
    additionalInfo?: Record<string, unknown>;
  };
  position?: 'top' | 'bottom' | 'left' | 'right';
}
```

## Features

### 1. Enhanced Table View

#### Column Configuration
- Subject (with tooltip)
- Predicate (with tooltip)
- Object (with tooltip)
- Source Document (hyperlinked)
- Embeddings (hyperlinked)
- Schema + LLM
- Created At

#### Interaction Features
- Sortable columns
- Advanced filtering
- Batch operations
- Quick navigation

### 2. Tooltip System

#### Subject/Object Tooltips
- Entity type
- Brief description
- Related entity count
- Quick actions

#### Predicate Tooltips
- Relationship description
- Directionality indicator
- Usage statistics
- Validation rules

### 3. Cross-Linking System

#### Related Data Navigation
- Source document links
- Embedding references
- Schema documentation
- Topic associations

#### Preview System
- Hover previews
- Quick view modals
- Context preservation
- Navigation history

## Implementation Guidelines

### 1. State Management

```typescript
interface TriplesState {
  items: Map<string, Triple>;
  selectedIds: Set<string>;
  filters: TripleFilter;
  sort: SortConfig;
  pagination: PaginationState;
}

interface TripleFilter {
  subjectType?: string[];
  predicateType?: string[];
  objectType?: string[];
  dateRange?: [Date, Date];
  schemaId?: string;
  sourceType?: string[];
}
```

### 2. Tooltip Management

```typescript
interface TooltipState {
  visible: boolean;
  position: Position;
  content: TooltipContent;
  type: TooltipType;
}

interface TooltipManager {
  show: (params: ShowTooltipParams) => void;
  hide: () => void;
  update: (content: Partial<TooltipContent>) => void;
  reposition: (position: Position) => void;
}
```

### 3. Cross-Linking

```typescript
interface CrossLinkManager {
  navigateToSource: (id: string) => void;
  navigateToEmbedding: (id: string) => void;
  navigateToSchema: (id: string) => void;
  navigateToTopic: (id: string) => void;
  getPreviewData: (type: string, id: string) => Promise<PreviewData>;
}
```

## Performance Optimizations

### 1. Data Loading
- Pagination
- Infinite scroll
- Data caching
- Lazy loading

### 2. Tooltip Performance
- Tooltip pooling
- Content preloading
- Position caching
- Render optimization

### 3. Cross-Linking
- Data prefetching
- Cache management
- Lazy references
- Batch loading

## Accessibility

### 1. Tooltip Accessibility
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA attributes

### 2. Table Accessibility
- Row navigation
- Column headers
- Sort indicators
- Filter controls

## Integration Points

### 1. API Integration

```typescript
interface TriplesAPI {
  getTriples: (params: QueryParams) => Promise<TripleResponse>;
  getTooltipData: (type: string, id: string) => Promise<TooltipData>;
  getRelatedData: (id: string, type: string) => Promise<RelatedData>;
  exportTriples: (ids: string[], format: ExportFormat) => Promise<Blob>;
}
```

### 2. Event System

```typescript
interface TriplesEvents {
  onTripleSelect: (id: string) => void;
  onTooltipShow: (params: TooltipParams) => void;
  onNavigate: (target: NavigationTarget) => void;
  onFilterChange: (filters: TripleFilter) => void;
}
```

## Testing Strategy

### 1. Unit Tests
- Tooltip positioning
- Filter logic
- Sort functionality
- Data transformation

### 2. Component Tests
- Table rendering
- Tooltip behavior
- Navigation handling
- State management

### 3. Integration Tests
- API integration
- Cross-linking
- Data flow
- Event handling

### 4. Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Focus management
- ARIA compliance

### 5. Visual Tests
- Tooltip positioning
- Table layout
- Responsive design
- Theme compatibility

## Error Handling

### 1. Data Errors
- Loading failures
- Invalid data
- Missing references
- API errors

### 2. UI Errors
- Tooltip positioning
- Navigation failures
- Render errors
- State inconsistencies

## Documentation

### 1. User Documentation
- Tooltip usage
- Navigation patterns
- Filter operations
- Export features

### 2. Developer Documentation
- Component API
- State management
- Event handling
- Extension points

## Future Enhancements

1. **Advanced Filtering**
   - Complex queries
   - Saved filters
   - Filter sharing
   - Visual query builder

2. **Enhanced Tooltips**
   - Rich content
   - Interactive elements
   - Custom renderers
   - Animation support

3. **Cross-Linking**
   - Bidirectional navigation
   - Deep linking
   - History management
   - Context preservation