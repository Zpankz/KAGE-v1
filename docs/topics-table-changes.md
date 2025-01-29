# Topics Table UI Changes

## Overview
This document outlines the planned changes to the Topics table UI to improve usability and add new features.

## Table Structure Changes

### Column Reordering
1. Move Topics section to the start of the row
2. Add Schema column after Name
3. Remove Configuration section
4. Move Color column to Actions section

New column order will be:
- Name
- Schema 
- Description
- Documents
- Created
- Actions (including Color)

## New Features

### Collapsible Documents List
- Each topic row will be expandable to show associated documents
- Documents will be displayed in a nested list under the topic
- Documents can be reordered via drag and drop
- Implementation will use the Collapsible component from Radix UI

### Color Selection Enhancement
- Color selection will be moved to the Actions column
- Color can be changed directly from the table view
- Will maintain current color picker functionality but in a more accessible location

### Schema Integration
- New Schema column will display the schema name
- Schema information is already available in the Topic interface
- Will be displayed prominently to improve information hierarchy

## Technical Implementation

### Component Updates
1. Modify Topics.tsx table structure
2. Integrate Collapsible component for document lists
3. Add drag-and-drop functionality for documents
4. Update color selection UI in Actions column

### API Integration
- Use existing updateTopicDocuments API for document reordering
- Leverage current Topic interface which already includes schema information
- Maintain existing color update functionality through updateTopic API

## Design Considerations
- Maintain consistent styling with existing UI
- Ensure smooth animations for collapsible sections
- Provide clear visual feedback for drag-and-drop interactions
- Keep color selection intuitive and accessible