import { ReactNode, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Eye, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface SortConfig<T> {
  column: keyof T | null;
  direction: 'asc' | 'desc';
}

export interface FilterConfig<T> {
  column: keyof T;
  value: string;
}

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => ReactNode;
  searchable?: boolean;
  sortable?: boolean;
  tooltip?: string;
  width?: string;
}

export interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onView?: (item: T) => void;
  onDownload?: (item: T) => void;
  defaultSort?: SortConfig<T>;
  rowClassName?: (item: T) => string;
  onSelectionChange?: (selectedIds: string[]) => void;
  loading?: boolean;
}

function compareValues(a: any, b: any): number {
  if (a === null || a === undefined || b === null || b === undefined) {
    // Handle null/undefined values
    if (a === b) return 0;
    if (a === null || a === undefined) return -1;
    return 1;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  }

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onView,
  onDownload,
  defaultSort,
  rowClassName,
  onSelectionChange,
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortConfig<T>>(
    defaultSort ?? { column: null, direction: 'asc' }
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Memoize the sorting function
  const sortData = useMemo(() => {
    if (!sort.column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sort.column!];
      const bValue = b[sort.column!];
      const comparison = compareValues(aValue, bValue);
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sort.column, sort.direction]);

  // Memoize the filtering
  const filteredData = useMemo(() => {
    if (!search) return sortData;

    return sortData.filter((item) =>
      columns.some((column) => {
        if (!column.searchable) return false;
        const value = item[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [sortData, columns, search]);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSort((prev) => ({
      column: column.key,
      direction:
        prev.column === column.key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked 
      ? new Set(filteredData.map(item => item.id))
      : new Set<string>();
    setSelectedIds(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
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
              {onSelectionChange && (
                <TableHead className="w-[40px]">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={cn(
                    column.sortable && 'cursor-pointer select-none',
                    column.width && `w-[${column.width}]`
                  )}
                  onClick={() => handleSort(column)}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          {column.header}
                          {column.sortable && sort.column === column.key && (
                            <span className="text-muted-foreground">
                              {sort.direction === 'asc' ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      {column.tooltip && (
                        <TooltipContent>
                          <p>{column.tooltip}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              ))}
              {(onView || onDownload) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (onView || onDownload ? 1 : 0) +
                    (onSelectionChange ? 1 : 0)
                  }
                  className="h-32 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (onView || onDownload ? 1 : 0) +
                    (onSelectionChange ? 1 : 0)
                  }
                  className="text-center"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    selectedIds.has(item.id) && 'bg-muted/50',
                    rowClassName?.(item)
                  )}
                >
                  {onSelectionChange && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] ?? '')}
                    </TableCell>
                  ))}
                  {(onView || onDownload) && (
                    <TableCell>
                      <div className="flex gap-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onDownload && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownload(item)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}