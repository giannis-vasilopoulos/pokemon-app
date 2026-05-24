import { POKEAPI_BASE_URL } from '../constants';

export class PokeApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'PokeApiError';
  }
}

export class PokeApiNotFoundError extends PokeApiError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'PokeApiNotFoundError';
  }
}

export async function pokeapiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = path.startsWith('http') ? path : `${POKEAPI_BASE_URL}${path}`;
  const response = await fetch(url, options);

  if (response.status === 404) {
    throw new PokeApiNotFoundError(`Resource not found: ${path}`);
  }

  if (!response.ok) {
    throw new PokeApiError(
      `PokeAPI request failed: ${response.status}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}
