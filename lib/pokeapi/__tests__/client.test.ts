import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { pokeapiServer } from '../mocks/server';
import { POKEAPI_BASE_URL } from '../constants';
import { PokeApiError, PokeApiNotFoundError, pokeapiFetch } from '../client';

describe('pokeapiFetch', () => {
  it('returns parsed JSON on 200', async () => {
    const data = await pokeapiFetch<{ name: string }>('/pokemon/pikachu');
    expect(data.name).toBe('pikachu');
  });

  it('throws PokeApiNotFoundError on 404', async () => {
    await expect(pokeapiFetch('/pokemon/missingno')).rejects.toBeInstanceOf(
      PokeApiNotFoundError
    );
  });

  it('throws PokeApiError on 5xx', async () => {
    pokeapiServer.use(
      http.get(`${POKEAPI_BASE_URL}/pokemon/broken`, () =>
        HttpResponse.json(null, { status: 500 })
      )
    );

    await expect(pokeapiFetch('/pokemon/broken')).rejects.toBeInstanceOf(
      PokeApiError
    );
  });
});
