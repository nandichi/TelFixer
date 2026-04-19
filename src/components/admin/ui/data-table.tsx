'use client';

import {
  ReactNode,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
  sortable?: boolean;
  sortValue?: (row: T) => string | number | null | undefined;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  loading?: boolean;
  initialSort?: { key: string; direction: 'asc' | 'desc' };
  pageSize?: number;
  className?: string;
  rowClassName?: (row: T) => string | undefined;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  empty,
  loading,
  initialSort,
  pageSize = 25,
  className,
  rowClassName,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<
    | { key: string; direction: 'asc' | 'desc' }
    | null
  >(initialSort ?? null);
  const [page, setPage] = useState(0);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv), 'nl', {
        numeric: true,
        sensitivity: 'base',
      }) * dir;
    });
  }, [rows, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const visibleRows = sortedRows.slice(
    safePage * pageSize,
    safePage * pageSize + pageSize
  );

  const handleSort = useCallback(
    (col: Column<T>) => {
      if (!col.sortable) return;
      setPage(0);
      setSort((prev) => {
        if (!prev || prev.key !== col.key) {
          return { key: col.key, direction: 'asc' };
        }
        if (prev.direction === 'asc') {
          return { key: col.key, direction: 'desc' };
        }
        return null;
      });
    },
    []
  );

  return (
    <div
      className={cn(
        'bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[10px] overflow-hidden',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-[var(--a-surface-2)] border-b border-[var(--a-border)]">
              {columns.map((col) => {
                const sorted = sort?.key === col.key ? sort.direction : null;
                const Icon =
                  sorted === 'asc'
                    ? ArrowUp
                    : sorted === 'desc'
                      ? ArrowDown
                      : ChevronsUpDown;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={cn(
                      'px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--a-text-3)] select-none',
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                          ? 'text-center'
                          : 'text-left',
                      col.sortable &&
                        'cursor-pointer hover:text-[var(--a-text)]',
                      col.headerClassName
                    )}
                    onClick={() => handleSort(col)}
                  >
                    <span
                      className={cn(
                        'inline-flex items-center gap-1',
                        col.align === 'right' && 'flex-row-reverse'
                      )}
                    >
                      {col.header}
                      {col.sortable && (
                        <Icon
                          className={cn(
                            'h-3 w-3',
                            sorted
                              ? 'text-[var(--a-accent)]'
                              : 'text-[var(--a-text-4)]'
                          )}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={`s-${i}`}
                    className="border-b border-[var(--a-border)] last:border-0"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-3 py-3"
                        style={{ width: col.width }}
                      >
                        <div className="h-3 rounded-md bg-[var(--a-surface-2)] animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : visibleRows.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className={cn(
                      'border-b border-[var(--a-border)] last:border-0 hover:bg-[var(--a-surface-2)] transition-colors',
                      onRowClick && 'cursor-pointer',
                      rowClassName?.(row)
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'px-3 py-2.5 align-middle text-[var(--a-text-2)]',
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                              ? 'text-center'
                              : 'text-left',
                          col.className
                        )}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && visibleRows.length === 0 && empty && (
        <div className="border-t border-[var(--a-border)]">{empty}</div>
      )}

      {!loading && sortedRows.length > pageSize && (
        <div className="flex items-center justify-between gap-3 px-3 py-2 border-t border-[var(--a-border)] text-[12px] text-[var(--a-text-3)] bg-[var(--a-surface)]">
          <span className="admin-num">
            {safePage * pageSize + 1}
            {'-'}
            {Math.min((safePage + 1) * pageSize, sortedRows.length)}
            {' van '}
            {sortedRows.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="px-2 py-1 rounded-md border border-[var(--a-border)] hover:bg-[var(--a-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Vorige
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={safePage >= totalPages - 1}
              className="px-2 py-1 rounded-md border border-[var(--a-border)] hover:bg-[var(--a-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Volgende
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
