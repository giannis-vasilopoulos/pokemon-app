import type { NamedResource, PokemonSummary } from './types';

export function toPokemonSummary(resource: NamedResource): PokemonSummary {
  return {
    name: resource.name,
    url: resource.url,
  };
}
