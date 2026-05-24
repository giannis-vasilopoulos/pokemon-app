import { describe, expect, it } from 'vitest';

import { getPokemonListByType, getPokemonListPage } from '../pokemon-list';

describe('getPokemonListPage', () => {
  it('returns mapped paginated list data', async () => {
    const data = await getPokemonListPage(2, 0);

    expect(data.items).toHaveLength(2);
    expect(data.items[0]).toEqual({
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      description:
        'A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.',
    });
    expect(data.total).toBe(1302);
    expect(data.hasNext).toBe(true);
    expect(data.hasPrev).toBe(false);
  });
});

describe('getPokemonListByType', () => {
  it('returns mapped type-filtered list data', async () => {
    const data = await getPokemonListByType('fire', 2, 0);

    expect(data.items).toHaveLength(1);
    expect(data.items[0].name).toBe('charmander');
    expect(data.items[0].types).toEqual(['fire']);
    expect(data.total).toBe(109);
  });
});
