import { pokemonExists } from '@/lib/pokeapi/pokemon';

export async function validateTeamSlots(names: string[]): Promise<string[]> {
  if (names.length === 0) return [];

  const checks = await Promise.all(
    names.map(async (name) => ({
      name,
      valid: await pokemonExists(name),
    }))
  );

  return checks.filter((check) => check.valid).map((check) => check.name);
}
