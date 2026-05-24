import { http, HttpResponse } from 'msw';

import { POKEAPI_GRAPHQL_URL } from '../../../constants';

const mockPokemonRow = {
  name: 'bulbasaur',
  pokemontypes: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  pokemonspecy: {
    pokemonspeciesflavortexts: [
      {
        flavor_text:
          'A strange seed was\nplanted on its\nback at birth.\fThe plant sprouts\nand grows with\nthis POKéMON.',
      },
    ],
  },
};

const mockPokemonPageData = {
  pokemon: [
    mockPokemonRow,
    {
      name: 'ivysaur',
      pokemontypes: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      pokemonspecy: {
        pokemonspeciesflavortexts: [
          {
            flavor_text:
              'When the bulb on its back grows, it appears to lose the ability to stand on its hind legs.',
          },
        ],
      },
    },
  ],
  pokemon_aggregate: { aggregate: { count: 1302 } },
};

const mockPokemonByTypeData = {
  pokemon: [
    {
      name: 'charmander',
      pokemontypes: [{ type: { name: 'fire' } }],
      pokemonspecy: {
        pokemonspeciesflavortexts: [
          {
            flavor_text:
              'Obviously prefers\nhot places.\fWhen it rains, steam is said to spout from the tip of its tail.',
          },
        ],
      },
    },
  ],
  pokemon_aggregate: { aggregate: { count: 109 } },
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

    if (body.operationName === 'PokemonListByType') {
      return HttpResponse.json({ data: mockPokemonByTypeData });
    }

    if (
      body.operationName === 'PokemonListPage' ||
      body.operationName === 'TestPokemonPage'
    ) {
      return HttpResponse.json({ data: mockPokemonPageData });
    }

    return HttpResponse.json({ data: mockPokemonPageData });
  }),
];
