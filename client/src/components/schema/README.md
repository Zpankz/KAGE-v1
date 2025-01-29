# Schema Management Architecture

## Overview

The schema management system provides a comprehensive interface for creating, editing, and visualizing knowledge graph schemas. It supports both form-based editing and interactive visualization.

## Components

### SchemaEditor

The main component for schema creation and editing.

```typescript
interface SchemaEditorProps {
  initialSchema?: Schema;
  onSave: (schema: Schema) => void;
  onCancel: () => void;
}

interface Schema {
  id: string;
  name: string;
  description: string;
  version: string;
  entities: EntityType[];
  relations: RelationType[];
  metadata: Record<string, unknown>;
}

interface EntityType {
  id: string;
  name: string;
  description: string;
  properties: Property[];
  constraints: Constraint[];
}

interface RelationType {
  id: string;
  name: string;
  description: string;
  sourceEntity: string; // Entity Type ID
  targetEntity: string; // Entity Type ID
  properties: Property[];
  constraints: Constraint[];
  cardinality: Cardinality;
}
```

### SchemaVisualizer

Interactive visualization component for schema exploration.

```typescript
interface SchemaVisualizerProps {
  schema: Schema;
  onEntityClick?: (entityId: string) => void;
  onRelationClick?: (relationId: string) => void;
  highlightedElements?: {
    entities: string[];
    relations: string[];
  };
  readOnly?: boolean;
}
```

## Features

### 1. Schema Creation

#### Modal Dialog
- Triggered by "Create" button
- Multi-step form process:
  1. Basic Information (name, description, version)
  2. Entity Types Definition
  3. Relation Types Definition
  4. Validation & Review

#### Entity Type Editor
- Name and description fields
- Property management
  - Data type selection
  - Validation rules
  - Required/optional flags
- Constraint definition
  - Uniqueness constraints
  - Value constraints
  - Custom validation rules

#### Relation Type Editor
- Source and target entity selection
- Cardinality configuration
- Property management
- Constraint definition
- Bidirectional relationship support

### 2. Schema Visualization

#### Interactive Graph
- Force-directed layout
- Entity types as nodes
- Relation types as edges
- Visual indicators for:
  - Cardinality
  - Required properties
  - Constraints
  - Validation rules

#### Interaction Features
- Zoom and pan
- Node dragging
- Click to edit
- Hover tooltips
- Highlight connected elements
- Mini-map for large schemas

### 3. Schema Validation

#### Validation Rules
- Entity name uniqueness
- Relation validity
- Property consistency
- Constraint compatibility
- Version format

#### Real-time Validation
- Immediate feedback
- Error highlighting
- Suggestion system
- Conflict resolution

## Implementation Guidelines

### 1. State Management

```typescript
interface SchemaState {
  current: Schema | null;
  history: Schema[];
  isValid: boolean;
  validationErrors: ValidationError[];
  unsavedChanges: boolean;
}

interface ValidationError {
  type: 'entity' | 'relation' | 'property' | 'constraint';
  elementId: string;
  message: string;
  severity: 'error' | 'warning';
}
```

### 2. Event Handling

```typescript
interface SchemaEvents {
  onEntityCreate: (entity: EntityType) => void;
  onEntityUpdate: (id: string, updates: Partial<EntityType>) => void;
  onEntityDelete: (id: string) => void;
  onRelationCreate: (relation: RelationType) => void;
  onRelationUpdate: (id: string, updates: Partial<RelationType>) => void;
  onRelationDelete: (id: string) => void;
}
```

### 3. Persistence

- Autosave functionality
- Version history
- Export/Import capabilities
- Schema migration support

### 4. Performance Considerations

- Lazy loading of complex visualizations
- Debounced validation
- Memoized computations
- Efficient graph rendering

### 5. Accessibility

- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus management

## Integration Points

### 1. API Integration

```typescript
interface SchemaAPI {
  createSchema: (schema: Schema) => Promise<Schema>;
  updateSchema: (id: string, updates: Partial<Schema>) => Promise<Schema>;
  deleteSchema: (id: string) => Promise<void>;
  validateSchema: (schema: Schema) => Promise<ValidationResult>;
}
```

### 2. Event System

```typescript
interface SchemaEvents {
  onSchemaChange: (schema: Schema) => void;
  onValidationError: (errors: ValidationError[]) => void;
  onSaveComplete: (schema: Schema) => void;
  onVisualizationUpdate: (layout: LayoutData) => void;
}
```

### 3. Plugin System

```typescript
interface SchemaPlugin {
  name: string;
  hooks: {
    beforeSave?: (schema: Schema) => Schema;
    afterLoad?: (schema: Schema) => Schema;
    validateCustom?: (schema: Schema) => ValidationError[];
  };
  visualizations?: {
    customLayouts?: LayoutGenerator[];
    nodeRenderers?: NodeRenderer[];
    edgeRenderers?: EdgeRenderer[];
  };
}
```

## Testing Strategy

1. **Unit Tests**
   - Schema validation logic
   - State management
   - Event handling
   - Data transformations

2. **Component Tests**
   - Form interactions
   - Visualization rendering
   - Error handling
   - User interactions

3. **Integration Tests**
   - API integration
   - Plugin system
   - Event propagation
   - State persistence

4. **E2E Tests**
   - Schema creation flow
   - Visualization interactions
   - Import/Export functionality
   - Error recovery