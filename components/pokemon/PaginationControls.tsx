'use client';

import { Button } from '@/components/ui/button';

type PaginationControlsProps = {
  offset: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (offset: number) => void;
};

export function PaginationControls({
  offset,
  pageSize,
  total,
  hasNext,
  hasPrev,
  onPageChange,
}: PaginationControlsProps) {
  const currentPage = Math.floor(offset / pageSize) + 1;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrev}
        onClick={() => onPageChange(Math.max(0, offset - pageSize))}
      >
        Previous
      </Button>
      <span className="text-muted-foreground text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        onClick={() => onPageChange(offset + pageSize)}
      >
        Next
      </Button>
    </div>
  );
}
