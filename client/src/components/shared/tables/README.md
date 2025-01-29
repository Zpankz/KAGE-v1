# Table Components Architecture

## DataTable Component

The DataTable component serves as the foundation for all table-based views in the application. It provides consistent functionality for displaying, sorting, filtering, and interacting with tabular data.

### Interface Design

```typescript
interface DataTableProps<T> {
  // Data
  data: T[];
  columns: Column<T>[];
  
  // State
  loading?: boolean;
  error?: Error;
  
  // Pagination
  pagination?: {
    pageSize: number;
    currentPage: number;
    totalItems: number;
  };
  
  // Sorting
  sortable?: boolean;
  defaultSort?: {
    column: keyof T;
    direction: 'asc' | 'desc';
  };
  
  // Filtering
  filterable?: boolean;
  filters?: FilterConfig[];
  
  // Actions
  actions?: {
    view?: (item: T) => void;
    download?: (item: T) => void;
    custom?: CustomAction<T>[];
  };
  
  // Customization
  rowClassName?: (item: T) => string;
  onRowClick?: (item: T) => void;
  
  // Rendering
  renderCell?: (column: Column<T>, item: T) => ReactNode;
  renderEmpty?: () => ReactNode;
  renderError?: (error: Error) => ReactNode;
  renderLoading?: () => ReactNode;
}

interface Column<T> {
  key: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], item: T) => ReactNode;
}

interface FilterConfig {
  field: string;
  type: 'text' | 'select' | 'date' | 'number';
  label: string;
  options?: string[]; // For select type
  range?: boolean; // For number/date types
}

interface CustomAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  disabled?: (item: T) => boolean;
}
```

### Features

1. **Data Handling**
   - Automatic sorting of data based on column headers
   - Client-side pagination with configurable page sizes
   - Filtering based on column values
   - Loading and error states with customizable rendering

2. **Customization**
   - Custom cell rendering
   - Row click handlers
   - Conditional row styling
   - Custom action buttons
   - Empty/loading/error state customization

3. **Accessibility**
   - ARIA labels for interactive elements
   - Keyboard navigation support
   - Screen reader friendly markup
   - Focus management

4. **Performance**
   - Virtualization for large datasets
   - Debounced search/filter operations
   - Memoized rendering optimizations

### Usage Example

```typescript
// Example usage in a view component
function UnstructuredDataView() {
  const columns = [
    {
      key: 'name',
      header: 'Document Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'type',
      header: 'Type',
      width: '100px',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'embeddings',
      header: 'Embeddings',
      render: (embeddingId) => (
        <Hyperlink to={`/embeddings/${embeddingId}`} />
      ),
    },
  ];

  return (
    <DataTable
      data={documents}
      columns={columns}
      loading={isLoading}
      error={error}
      pagination={{
        pageSize: 10,
        currentPage: page,
        totalItems: totalCount,
      }}
      actions={{
        view: (doc) => handleView(doc.id),
        download: (doc) => handleDownload(doc.id),
      }}
    />
  );
}
```

### Implementation Guidelines

1. **State Management**
   - Use React Query for data fetching and caching
   - Implement optimistic updates for actions
   - Handle loading/error states gracefully

2. **Performance Optimization**
   - Implement virtualization for large datasets
   - Memoize expensive computations
   - Debounce filter/search operations
   - Lazy load related data

3. **Styling**
   - Use Tailwind CSS for consistent styling
   - Support dark/light mode
   - Maintain responsive design
   - Follow accessibility guidelines

4. **Testing**
   - Unit tests for sorting/filtering logic
   - Component tests for rendering behavior
   - Integration tests for data flow
   - Accessibility tests

### Related Components

- `SearchBar`: Handles search and filter UI
- `Pagination`: Controls page navigation
- `ActionButtons`: Renders action buttons
- `StatusBadge`: Displays status indicators
- `Hyperlink`: Handles navigation to related views