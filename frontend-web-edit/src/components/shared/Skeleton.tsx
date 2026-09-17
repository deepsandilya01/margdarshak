import React from 'react';
import { clsx } from 'clsx';

/** Generic skeleton block */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={clsx('skeleton-shimmer rounded', className)}
      style={style}
      aria-hidden="true"
    />
  );
}

/** Skeleton row for a table */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-6">
          <Skeleton className={clsx('h-4 rounded', i === 0 ? 'w-28' : i === 1 ? 'w-48' : 'w-20')} />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton card */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-surface rounded-xl border border-outline-variant/30 p-5 space-y-3" aria-hidden="true">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-5 w-3/4 rounded" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} className="h-3 rounded" style={{ width: `${70 + i * 8}%` } as React.CSSProperties} />
      ))}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}

/** Full Standards table skeleton (5 skeleton rows) */
export function StandardsTableSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant/30">
            {['Standard Identifier', 'Title & Scope', 'Division', 'Legal Status', 'Lab Network', 'Actions'].map(h => (
              <th key={h} className="py-3 px-6 text-left">
                <Skeleton className="h-3 w-16 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f2f3ff]">
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} cols={6} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** AI Sathi results skeleton */
export function AISathiSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-3 items-start">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
