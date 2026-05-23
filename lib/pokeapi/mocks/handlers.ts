import { http, HttpResponse } from 'msw';

import { POKEAPI_BASE_URL } from '../constants';

import listFixture from './fixtures/pokemon-list.json';
import typesFixture from './fixtures/types-list.json';
import typeFireFixture from './fixtures/type-fire.json';
import pikachuFixture from './fixtures/pokemon-pikachu.json';

export const pokeapiHandlers = [
  http.get(`${POKEAPI_BASE_URL}/pokemon`, () => HttpResponse.json(listFixture)),
  http.get(`${POKEAPI_BASE_URL}/type`, () => HttpResponse.json(typesFixture)),
  http.get(`${POKEAPI_BASE_URL}/type/:name`, ({ params }) => {
    if (params.name === 'unknown') {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(typeFireFixture);
  }),
  http.get(`${POKEAPI_BASE_URL}/pokemon/:name`, ({ params }) => {
    if (params.name === 'missingno') {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(pikachuFixture);
  }),
];
