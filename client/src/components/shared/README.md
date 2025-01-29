# Shared Components

This directory contains reusable components that implement the common patterns defined in the UI architecture.

## Component Categories

### Tables
- `DataTable`: Base table component with sorting, filtering, and pagination
- `SearchBar`: Reusable search component with advanced filtering
- `ActionButtons`: Common action buttons (View/Download)
- `ProcessingStatus`: Status indicator for document processing

### Navigation
- `Hyperlink`: Component for consistent cross-view navigation
- `HoverPreview`: Preview component for linked items
- `Breadcrumbs`: Navigation breadcrumbs

### Data Display
- `VectorDisplay`: Component for displaying and formatting vector data
- `StatusBadge`: Visual indicator for various status states
- `Tooltip`: Enhanced tooltip with consistent styling

### Forms
- `FilterGroup`: Reusable filter components
- `SchemaForm`: Base form for schema editing
- `EntityEditor`: Reusable entity editing interface

## Usage Guidelines

1. Component Composition
   - Use composition over inheritance
   - Keep components focused and single-purpose
   - Implement consistent prop interfaces

2. State Management
   - Use React Query for data fetching
   - Implement proper loading states
   - Handle errors consistently

3. Styling
   - Use Tailwind CSS for consistent styling
   - Follow the project's design system
   - Maintain responsive design principles

4. Accessibility
   - Include proper ARIA labels
   - Support keyboard navigation
   - Maintain color contrast requirements

## Example Usage

```tsx
import { DataTable, SearchBar, ActionButtons } from '@/components/shared';

function MyTableView() {
  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        filters={myFilters}
        onFilterChange={handleFilterChange}
      />
      <DataTable
        data={myData}
        columns={myColumns}
        loading={isLoading}
        error={error}
      >
        <ActionButtons
          onView={handleView}
          onDownload={handleDownload}
        />
      </DataTable>
    </div>
  );
}
```

## Component Directory Structure

```
shared/
├── tables/
│   ├── DataTable.tsx
│   ├── SearchBar.tsx
│   └── ActionButtons.tsx
├── navigation/
│   ├── Hyperlink.tsx
│   └── HoverPreview.tsx
├── display/
│   ├── VectorDisplay.tsx
│   └── StatusBadge.tsx
└── forms/
    ├── FilterGroup.tsx
    └── SchemaForm.tsx