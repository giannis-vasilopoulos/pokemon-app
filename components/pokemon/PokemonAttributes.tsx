import { TypeBadge } from '@/components/pokemon/TypeBadge';
import { Badge } from '@/components/ui/badge';
import type { PokemonAbilityView } from '@/lib/pokeapi/mappers';

type PokemonAttributesProps = {
  types: string[];
  height: string;
  weight: string;
  abilities: PokemonAbilityView[];
};

export function PokemonAttributes({
  types,
  height,
  weight,
  abilities,
}: PokemonAttributesProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:max-w-xs">
        <dt className="text-muted-foreground">Height</dt>
        <dd>{height}</dd>
        <dt className="text-muted-foreground">Weight</dt>
        <dd>{weight}</dd>
      </dl>

      <section aria-label="Abilities">
        <h3 className="mb-2 text-sm font-medium">Abilities</h3>
        <ul className="space-y-2">
          {abilities.map((ability) => (
            <li
              key={ability.name}
              className="flex flex-wrap items-center gap-2 text-sm"
            >
              <span>{ability.name}</span>
              {ability.isHidden ? (
                <Badge variant="secondary">Hidden</Badge>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
