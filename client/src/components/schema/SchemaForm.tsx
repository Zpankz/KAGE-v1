import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash } from 'lucide-react';
import { Schema } from '@/api/mockData';

interface SchemaFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (schema: Schema) => void;
  initialData?: Schema;
}

export function SchemaForm({ open, onClose, onSave, initialData }: SchemaFormProps) {
  const [schema, setSchema] = useState<Partial<Schema>>(
    initialData || {
      name: '',
      description: '',
      version: '1.0.0',
      entities: [],
      relations: [],
    }
  );

  const addEntity = () => {
    setSchema((prev) => ({
      ...prev,
      entities: [
        ...(prev.entities || []),
        {
          id: `ent${(prev.entities || []).length + 1}`,
          name: '',
          description: '',
        },
      ],
    }));
  };

  const updateEntity = (index: number, field: string, value: string) => {
    setSchema((prev) => ({
      ...prev,
      entities: prev.entities?.map((entity, i) =>
        i === index ? { ...entity, [field]: value } : entity
      ),
    }));
  };

  const removeEntity = (index: number) => {
    setSchema((prev) => ({
      ...prev,
      entities: prev.entities?.filter((_, i) => i !== index),
    }));
  };

  const addRelation = () => {
    setSchema((prev) => ({
      ...prev,
      relations: [
        ...(prev.relations || []),
        {
          id: `rel${(prev.relations || []).length + 1}`,
          name: '',
          description: '',
          sourceEntity: '',
          targetEntity: '',
        },
      ],
    }));
  };

  const updateRelation = (index: number, field: string, value: string) => {
    setSchema((prev) => ({
      ...prev,
      relations: prev.relations?.map((relation, i) =>
        i === index ? { ...relation, [field]: value } : relation
      ),
    }));
  };

  const removeRelation = (index: number) => {
    setSchema((prev) => ({
      ...prev,
      relations: prev.relations?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    if (!schema.name || !schema.version) return;

    onSave({
      ...schema,
      id: initialData?.id || `schema${Date.now()}`,
      name: schema.name,
      description: schema.description || '',
      version: schema.version,
      entities: schema.entities || [],
      relations: schema.relations || [],
      createdAt: initialData?.createdAt || new Date().toISOString(),
    } as Schema);

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Schema' : 'Create New Schema'}
          </DialogTitle>
          <DialogDescription>
            Define the structure of your knowledge graph
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Schema Name</Label>
              <Input
                value={schema.name}
                onChange={(e) =>
                  setSchema((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter schema name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={schema.description}
                onChange={(e) =>
                  setSchema((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter schema description"
              />
            </div>
            <div className="space-y-2">
              <Label>Version</Label>
              <Input
                value={schema.version}
                onChange={(e) =>
                  setSchema((prev) => ({ ...prev, version: e.target.value }))
                }
                placeholder="1.0.0"
              />
            </div>
          </div>

          {/* Entity Types */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Entity Types</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEntity}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entity
              </Button>
            </div>
            {schema.entities?.map((entity, index) => (
              <div key={entity.id} className="space-y-2 p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <Label>Entity {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntity(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={entity.name}
                  onChange={(e) => updateEntity(index, 'name', e.target.value)}
                  placeholder="Entity name"
                />
                <Textarea
                  value={entity.description}
                  onChange={(e) =>
                    updateEntity(index, 'description', e.target.value)
                  }
                  placeholder="Entity description"
                />
              </div>
            ))}
          </div>

          {/* Relations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Relations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRelation}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Relation
              </Button>
            </div>
            {schema.relations?.map((relation, index) => (
              <div key={relation.id} className="space-y-2 p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <Label>Relation {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRelation(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={relation.name}
                  onChange={(e) => updateRelation(index, 'name', e.target.value)}
                  placeholder="Relation name"
                />
                <Textarea
                  value={relation.description}
                  onChange={(e) =>
                    updateRelation(index, 'description', e.target.value)
                  }
                  placeholder="Relation description"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Source Entity</Label>
                    <select
                      className="w-full border rounded-md p-2"
                      value={relation.sourceEntity}
                      onChange={(e) =>
                        updateRelation(index, 'sourceEntity', e.target.value)
                      }
                    >
                      <option value="">Select source</option>
                      {schema.entities?.map((entity) => (
                        <option key={entity.id} value={entity.id}>
                          {entity.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Entity</Label>
                    <select
                      className="w-full border rounded-md p-2"
                      value={relation.targetEntity}
                      onChange={(e) =>
                        updateRelation(index, 'targetEntity', e.target.value)
                      }
                    >
                      <option value="">Select target</option>
                      {schema.entities?.map((entity) => (
                        <option key={entity.id} value={entity.id}>
                          {entity.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Schema</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}