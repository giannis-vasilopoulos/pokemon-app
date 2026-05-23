'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTypes } from '@/hooks/useTypes';

type TypeFilterProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export function TypeFilter({ value, onChange }: TypeFilterProps) {
  const { data, isLoading, isError } = useTypes();

  if (isLoading) {
    return <Skeleton className="h-9 w-48" />;
  }

  if (isError || !data) {
    return <p className="text-destructive text-sm">Failed to load types.</p>;
  }

  return (
    <Select
      value={value ?? 'all'}
      onValueChange={(next) => onChange(next === 'all' ? null : next)}
    >
      <SelectTrigger className="w-48" aria-label="Filter by type">
        <SelectValue placeholder="All types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All types</SelectItem>
        {data.results.map((type) => (
          <SelectItem key={type.name} value={type.name}>
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
