'use client';

import React, { createContext, useContext } from 'react';
import { cn } from '@/utils/cn';

interface TableContextValue {
  variant: 'header' | 'body';
}

const TableContext = createContext<TableContextValue>({ variant: 'body' });

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

function TableRoot({ children, className }: TableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-default', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

function TableHeader({ children, className }: TableProps) {
  return (
    <TableContext.Provider value={{ variant: 'header' }}>
      <thead className={cn('bg-background', className)}>{children}</thead>
    </TableContext.Provider>
  );
}

function TableBody({ children, className }: TableProps) {
  return (
    <TableContext.Provider value={{ variant: 'body' }}>
      <tbody className={cn('divide-y divide-border', className)}>{children}</tbody>
    </TableContext.Provider>
  );
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

function TableRow({ children, className }: TableRowProps) {
  const { variant } = useContext(TableContext);
  return (
    <tr className={cn(variant === 'body' && 'transition-colors hover:bg-background', className)}>
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  colSpan?: number;
}

function TableHeaderCell({ children, className, align = 'left', colSpan }: TableCellProps) {
  return (
    <th
      className={cn(
        'px-4 py-3 font-medium text-muted',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      colSpan={colSpan}
    >
      {children}
    </th>
  );
}

function TableCell({ children, className, align = 'left', colSpan }: TableCellProps) {
  return (
    <td
      className={cn(
        'px-4 py-3',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});
