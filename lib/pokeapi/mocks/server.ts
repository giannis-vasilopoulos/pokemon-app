import { setupServer } from 'msw/node';

import { pokeapiGraphqlHandlers } from '../graphql/mocks/handlers';

import { pokeapiHandlers } from './handlers';

export const pokeapiServer = setupServer(
  ...pokeapiHandlers,
  ...pokeapiGraphqlHandlers
);
