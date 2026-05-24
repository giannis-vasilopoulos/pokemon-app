'use client';

import { Input } from '@/components/ui/input';

type SearchFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchFilter({ value, onChange }: SearchFilterProps) {
  return (
    <Input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by name…"
      aria-label="Search Pokémon by name"
      className="w-48"
    />
  );
}
