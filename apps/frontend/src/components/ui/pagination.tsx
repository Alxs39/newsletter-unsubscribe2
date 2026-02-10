'use client';

import { Button } from '@heroui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Afficher tous les numéros
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique avec ellipsis
      if (currentPage <= 3) {
        // Début : 1 2 3 4 ... totalPages
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin : 1 ... n-3 n-2 n-1 n
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // Milieu : 1 ... current-1 current current+1 ... totalPages
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        isDisabled={currentPage <= 1}
        onPress={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {renderPageNumbers().map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="text-muted-fg px-2 text-sm">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="secondary"
        size="sm"
        isDisabled={currentPage >= totalPages}
        onPress={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
