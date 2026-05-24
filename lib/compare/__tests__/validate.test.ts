import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';

import { POKEAPI_BASE_URL } from '../../constants';
import { pokeapiServer } from '../../pokeapi/mocks/server';
import { validateCompareSlots } from '../validate';

describe('validateCompareSlots', () => {
  it('keeps valid names and drops 404 siblings in order', async () => {
    await expect(
      validateCompareSlots(['pikachu', 'missingno', 'charizard'])
    ).resolves.toEqual(['pikachu', 'charizard']);
  });

  it('returns empty when all names are unknown', async () => {
    await expect(validateCompareSlots(['missingno'])).resolves.toEqual([]);
  });

  it('returns empty for empty input', async () => {
    await expect(validateCompareSlots([])).resolves.toEqual([]);
  });

  it('propagates non-404 errors', async () => {
    pokeapiServer.use(
      http.get(`${POKEAPI_BASE_URL}/pokemon/broken`, () =>
        HttpResponse.json(null, { status: 500 })
      )
    );

    await expect(validateCompareSlots(['broken'])).rejects.toThrow();
  });
});
