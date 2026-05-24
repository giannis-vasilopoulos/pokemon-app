import { http, HttpResponse } from 'msw';

import { POKEAPI_GRAPHQL_URL } from '../../../constants';

const testPokemonPageData = {
  pokemon: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
  pokemon_aggregate: { aggregate: { count: 1302 } },
};

type GraphQLBody = {
  operationName?: string | null;
  query?: string;
};

export const pokeapiGraphqlHandlers = [
  http.post(POKEAPI_GRAPHQL_URL, async ({ request }) => {
    const body = (await request.json()) as GraphQLBody;

    if (body.operationName === 'TestBroken') {
      return new HttpResponse(null, { status: 500 });
    }

    if (body.operationName === 'TestNotFound') {
      return new HttpResponse(null, { status: 404 });
    }

    if (body.operationName === 'TestGraphQLError') {
      return HttpResponse.json({
        errors: [{ message: 'field not found' }],
      });
    }

    if (body.operationName === 'TestMissingData') {
      return HttpResponse.json({});
    }

    return HttpResponse.json({ data: testPokemonPageData });
  }),
];
