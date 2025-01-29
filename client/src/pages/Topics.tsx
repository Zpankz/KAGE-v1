import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Topic, getTopics, createTopic, deleteTopic, updateTopic, updateTopicDocuments } from '@/api/topics';
import { Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { DraggableDocumentList } from '@/components/DraggableDocumentList';

export function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#FF6B6B',
    schemaId: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const { topics } = await getTopics();
      setTopics(topics);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load topics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const { topic } = await createTopic(formData);
      setTopics([...topics, topic]);
      setIsCreateOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Topic created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create topic',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingTopic) return;
    try {
      const { topic } = await updateTopic(editingTopic.id, formData);
      setTopics(topics.map(t => t.id === topic.id ? topic : t));
      setEditingTopic(null);
      resetForm();
      toast({
        title: 'Success',
        description: 'Topic updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update topic',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTopic(id);
      setTopics(topics.filter(topic => topic.id !== id));
      toast({
        title: 'Success',
        description: 'Topic deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete topic',
        variant: 'destructive',
      });
    }
  };

  const handleDocumentsReorder = async (topicId: string, documentIds: string[]) => {
    try {
      await updateTopicDocuments(topicId, documentIds);
      toast({
        title: 'Success',
        description: 'Documents reordered successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reorder documents',
        variant: 'destructive',
      });
    }
  };

  const handleColorChange = async (id: string, color: string) => {
    try {
      const { topic } = await updateTopic(id, { color });
      setTopics(topics.map(t => t.id === topic.id ? topic : t));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update color',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#FF6B6B',
      schemaId: ''
    });
  };

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(search.toLowerCase()) ||
    topic.description.toLowerCase().includes(search.toLowerCase())
  );

  const TopicForm = () => (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter topic name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter topic description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <div className="flex gap-2">
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-20"
            />
            <Input
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Topics</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Topic</DialogTitle>
              <DialogDescription>
                Add a new topic to organize your knowledge graph.
              </DialogDescription>
            </DialogHeader>
            <TopicForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Schema</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="w-[150px]">Created</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredTopics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No topics found
                </TableCell>
              </TableRow>
            ) : (
              filteredTopics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.name}</TableCell>
                  <TableCell>{topic.schema.name}</TableCell>
                  <TableCell>{topic.description}</TableCell>
                  <TableCell>
                    <DraggableDocumentList 
                      documents={topic.documents}
                      onReorder={(documentIds) => handleDocumentsReorder(topic.id, documentIds)}
                    />
                  </TableCell>
                  <TableCell>{new Date(topic.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Input
                        type="color"
                        value={topic.color}
                        onChange={(e) => handleColorChange(topic.id, e.target.value)}
                        className="w-8 h-8 p-0 border-none rounded-full overflow-hidden"
                      />
                      <Dialog
                        open={editingTopic?.id === topic.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setEditingTopic(topic);
                            setFormData({
                              name: topic.name,
                              description: topic.description,
                              color: topic.color,
                              schemaId: topic.schema.id
                            });
                          } else {
                            setEditingTopic(null);
                            resetForm();
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Topic</DialogTitle>
                            <DialogDescription>
                              Modify the topic details.
                            </DialogDescription>
                          </DialogHeader>
                          <TopicForm />
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setEditingTopic(null)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleUpdate}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(topic.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}