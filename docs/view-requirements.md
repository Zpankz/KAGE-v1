# View-Specific Requirements

## Unstructured Documents View

### Data Structure
```typescript
interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'processing' | 'error' | 'completed';
  uploadedAt: string;
  embedding?: {
    id: string;
    dimensions: number;
    updatedAt: string;
  };
  topics?: Array<{
    id: string;
    name: string;
  }>;
  schema?: {
    id: string;
    name: string;
  };
}
```

### Table Configuration
- Column order: Name, Type, Size, Status, Embeddings, Topics, Schema, Actions
- Processing UI in a separate column with progress indicator
- View/Download actions in the last column
- Hyperlinks to related data:
  * Embeddings -> Embeddings view
  * Topics -> Topics view
  * Schema -> Schema view

### Filter Requirements
- Filter by name (text)
- Filter by type (select)
- Filter by status (select)
- Filter by date range (date picker)
- Filter by has/doesn't have embeddings (boolean)

## Embeddings View

### Data Structure
```typescript
interface Embedding {
  id: string;
  dimensions: number;
  vector: number[];
  llmModel: string;
  document: {
    id: string;
    name: string;
  };
  schema?: {
    id: string;
    name: string;
  };
  triplesCount: number;
  createdAt: string;
}
```

### Table Configuration
- Column order: Document, Dimensions, LLM Model, Schema, Triples, Vector Data, Created, Actions
- Vector data column shows truncated vector with full data on hover/expand
- View/Download actions for vector data
- Hyperlinks to related data:
  * Document -> Unstructured view
  * Schema -> Schema view
  * Triples -> Filtered triples view

### Filter Requirements
- Filter by document name (text)
- Filter by LLM model (select)
- Filter by dimensions (number range)
- Filter by date range (date picker)
- Filter by has/doesn't have schema (boolean)

## Triples View

### Data Structure
```typescript
interface Triple {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  created: string;
  embedding: {
    id: string;
    llmModel: string;
  };
  document: {
    id: string;
    name: string;
  };
  schema: {
    id: string;
    name: string;
  };
}
```

### Table Configuration
- Column order: Subject, Predicate, Object, Created, Embedding, Source, Schema, LLM
- Tooltips on SPO columns explaining directionality:
  * Subject: "Outward directed entity"
  * Predicate: "Relationship between subject and object"
  * Object: "Inward directed entity"
- Hyperlinks to related data:
  * Embedding -> Embeddings view
  * Source -> Unstructured view
  * Schema -> Schema view

### Filter Requirements
- Filter by subject (text)
- Filter by predicate (text)
- Filter by object (text)
- Filter by LLM model (select)
- Filter by date range (date picker)
- Filter by document name (text)

## Shared Components

### FilterBar
```typescript
interface FilterOption<T> {
  type: 'text' | 'select' | 'date' | 'boolean' | 'number';
  field: keyof T;
  label: string;
  options?: Array<{value: string; label: string}>; // For select type
  placeholder?: string;
}

interface FilterBarProps<T> {
  options: FilterOption<T>[];
  onChange: (filters: Record<string, any>) => void;
  value: Record<string, any>;
}
```

### ProcessingStatus
```typescript
interface ProcessingStatusProps {
  status: 'processing' | 'error' | 'completed';
  progress?: number;
  error?: string;
}
```

### VectorDataCell
```typescript
interface VectorDataCellProps {
  vector: number[];
  truncateAt?: number;
  className?: string;
}
```

## UI/UX Guidelines

### Table Interactions
1. Sorting
- Click column header to sort
- Shift+click for multi-column sort
- Visual indicators for sort direction

2. Filtering
- Filters appear in header area
- Clear all/Apply all buttons
- Save filter presets (future)

3. Row Actions
- Hover to reveal actions
- Keyboard navigation support
- Bulk selection support

### Responsive Design
1. Mobile View
- Horizontal scroll for tables
- Collapsible filters
- Simplified row actions

2. Tablet View
- Optional column hiding
- Sticky header/actions
- Touch-friendly controls

3. Desktop View
- Full feature set
- Multi-pane layout
- Advanced filtering

### Accessibility
1. Keyboard Navigation
- Tab through interactive elements
- Arrow keys for table navigation
- Keyboard shortcuts for common actions

2. Screen Readers
- Meaningful cell descriptions
- Status announcements
- Clear hierarchy

3. Visual Accessibility
- High contrast mode support
- Adjustable text size
- Clear focus indicators

## Implementation Notes

1. Common Patterns
- Use consistent date formatting
- Standardized hyperlink styling
- Uniform action button layout

2. Performance Considerations
- Lazy load vector data
- Virtualized table for large datasets
- Debounced filter updates

3. Error Handling
- Clear error states
- Retry mechanisms
- Fallback UI

4. Future Enhancements
- Export functionality
- Bulk operations
- Custom column visibility
- Saved filter presets
- Advanced search queries