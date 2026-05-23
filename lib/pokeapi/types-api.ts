import { pokeapiFetch } from './client';
import type { NamedResource, PaginatedList, TypeDetail } from './types';

export async function getAllTypes(): Promise<PaginatedList<NamedResource>> {
  return pokeapiFetch<PaginatedList<NamedResource>>('/type');
}

export async function getPokemonByType(typeName: string): Promise<TypeDetail> {
  return pokeapiFetch<TypeDetail>(`/type/${typeName}`);
}
