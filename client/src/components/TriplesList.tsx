import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { Triple, getTriples } from '@/api/data';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search } from 'lucide-react';

export function TriplesList() {
  const [triples, setTriples] = useState<Triple[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadTriples = async () => {
      try {
        const { triples } = await getTriples();
        setTriples(triples);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load triples',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadTriples();
  }, [toast]);

  const filteredTriples = triples.filter((triple) => {
    const searchLower = search.toLowerCase();
    return (
      triple.subject.entity.toLowerCase().includes(searchLower) ||
      triple.predicate.relationship.toLowerCase().includes(searchLower) ||
      triple.object.entity.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search triples..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Triple
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Predicate</TableHead>
              <TableHead>Object</TableHead>
              <TableHead>Sources</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredTriples.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No triples found
                </TableCell>
              </TableRow>
            ) : (
              filteredTriples.map((triple) => (
                <TableRow key={triple.id}>
                  <TableCell>{triple.subject.entity}</TableCell>
                  <TableCell>{triple.predicate.relationship}</TableCell>
                  <TableCell>{triple.object.entity}</TableCell>
                  <TableCell>
                    {triple.sources.map(source => source.name).join(', ')}
                  </TableCell>
                  <TableCell>
                    {new Date(triple.createdAt).toLocaleString()}
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