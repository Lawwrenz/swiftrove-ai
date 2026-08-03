import { type ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import Skeleton from './Skeleton';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: ReactNode;
  pageSize?: number;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  loading,
  emptyState,
  pageSize = 10,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(String(bVal)) : Number(aVal) - Number(bVal);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const displayData = sorted.slice(0, pageSize);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="table-row" className="px-6" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="bg-card rounded-xl shadow-sm ring-1 ring-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`
                      px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary
                      ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                      ${col.sortable ? 'cursor-pointer select-none hover:text-foreground transition-colors duration-150' : ''}
                      ${col.className || ''}
                    `}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="inline-flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <span className="text-muted">
                          {sortKey === col.key ? (
                            sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : (
                            <ChevronsUpDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayData.map((row, rowIdx) => (
                <tr
                  key={keyExtractor(row)}
                  className={`
                    ${rowIdx % 2 === 0 ? 'bg-card' : 'bg-surface/30'}
                    ${onRowClick ? 'cursor-pointer hover:bg-surface transition-colors duration-150' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        px-6 py-4 text-sm text-foreground whitespace-nowrap
                        ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                        ${col.className || ''}
                      `}
                    >
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > pageSize && (
          <div className="px-6 py-3 border-t border-border text-xs text-text-secondary">
            Showing {pageSize} of {data.length} results
          </div>
        )}
      </div>
  );
}