'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompareStore } from '@/stores/compare-store';

export function CompareTable() {
  const slots = useCompareStore((state) => state.slots);
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);

  if (slots.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Add Pokémon from the list to compare up to 4.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm">{slots.length} selected</p>
        <Button variant="outline" size="sm" onClick={clear}>
          Clear all
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {slots.map((name) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle className="capitalize">{name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Badge variant="secondary">Compare slot</Badge>
              <Button variant="ghost" size="sm" onClick={() => remove(name)}>
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
