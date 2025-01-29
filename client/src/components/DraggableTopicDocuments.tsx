import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileIcon, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
}

interface DraggableDocumentProps {
  document: Document;
}

function DraggableDocument({ document }: DraggableDocumentProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: document.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-2 bg-card rounded-md border',
        isDragging && 'opacity-50'
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <FileIcon className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1 text-sm">{document.name}</span>
      <span className="text-xs text-muted-foreground">
        {formatFileSize(document.size)}
      </span>
    </div>
  );
}

interface DraggableTopicDocumentsProps {
  documents: Document[];
  onReorder: (documents: Document[]) => void;
}

export function DraggableTopicDocuments({ documents, onReorder }: DraggableTopicDocumentsProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = documents.findIndex((doc) => doc.id === active.id);
      const newIndex = documents.findIndex((doc) => doc.id === over.id);
      onReorder(arrayMove(documents, oldIndex, newIndex));
    }
  };

  if (!documents.length) {
    return (
      <div className="py-2 px-4 text-sm text-muted-foreground">
        No documents assigned
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={documents} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 py-2">
          {documents.map((doc) => (
            <DraggableDocument key={doc.id} document={doc} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}