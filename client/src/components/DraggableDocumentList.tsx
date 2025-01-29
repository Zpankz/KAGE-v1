import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronRight, GripVertical, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
}

interface DraggableDocumentListProps {
  documents: Document[];
  onReorder: (documents: string[]) => void;
}

const SortableDocument = ({ document }: { document: Document }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: document.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-2 rounded-md cursor-move bg-background',
        isDragging && 'opacity-50 border-2 border-dashed border-primary'
      )}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1">{document.name}</span>
      <span className="text-sm text-muted-foreground">
        {(document.size / 1024).toFixed(1)} KB
      </span>
    </div>
  );
};

export function DraggableDocumentList({ documents, onReorder }: DraggableDocumentListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(documents);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        onReorder(newItems.map(item => item.id));
        return newItems;
      });
    }
  };

  if (!documents.length) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary">
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-90'
          )}
        />
        <span>{items.length} documents</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((document) => (
              <SortableDocument key={document.id} document={document} />
            ))}
          </SortableContext>
        </DndContext>
      </CollapsibleContent>
    </Collapsible>
  );
}