import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { POKEAPI_BASE_URL } from '../../constants';
import { pokeapiServer } from '../../pokeapi/mocks/server';
import { resolveTeamPageData } from '../resolve';

describe('resolveTeamPageData', () => {
  it('keeps valid names and drops 404 siblings in order', async () => {
    const result = await resolveTeamPageData('pikachu,missingno,charizard');

    expect(result.slots).toEqual(['pikachu', 'charizard']);
    expect(result.detailsByName.pikachu?.name).toBe('pikachu');
    expect(result.detailsByName.charizard?.name).toBe('charizard');
    expect(result.detailsByName.missingno).toBeUndefined();
  });

  it('returns empty when all names are unknown', async () => {
    const result = await resolveTeamPageData('missingno');

    expect(result.slots).toEqual([]);
    expect(result.detailsByName).toEqual({});
  });

  it('returns empty for missing input', async () => {
    const result = await resolveTeamPageData(undefined);

    expect(result.slots).toEqual([]);
    expect(result.detailsByName).toEqual({});
  });

  it('sanitizes malformed segments before fetching', async () => {
    const result = await resolveTeamPageData('pikachu,!!!,charizard');

    expect(result.slots).toEqual(['pikachu', 'charizard']);
  });

  it('propagates non-404 errors', async () => {
    pokeapiServer.use(
      http.get(`${POKEAPI_BASE_URL}/pokemon/broken`, () =>
        HttpResponse.json(null, { status: 500 })
      )
    );

    await expect(resolveTeamPageData('broken')).rejects.toThrow();
  });
});
