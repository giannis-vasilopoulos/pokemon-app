import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { getPokemonTypeBadgeStyles } from '@/lib/pokemon/type-colors';
import { cn } from '@/lib/utils';

type TypeBadgeProps = Omit<React.ComponentProps<typeof Badge>, 'variant'> & {
  type: string;
};

export function TypeBadge({
  type,
  className,
  style,
  children,
  ...props
}: TypeBadgeProps) {
  return (
    <Badge
      className={cn('border-transparent capitalize', className)}
      style={{ ...getPokemonTypeBadgeStyles(type), ...style }}
      {...props}
    >
      {children ?? type}
    </Badge>
  );
}
