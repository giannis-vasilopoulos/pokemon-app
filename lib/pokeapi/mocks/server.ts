import { setupServer } from 'msw/node';

import { pokeapiHandlers } from './handlers';

export const pokeapiServer = setupServer(...pokeapiHandlers);
