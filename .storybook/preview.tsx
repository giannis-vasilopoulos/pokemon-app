import React from 'react';
import type { Preview } from '@storybook/react';

import { QueryProvider } from '../components/providers/QueryProvider';
import '../app/globals.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <QueryProvider>
        <Story />
      </QueryProvider>
    ),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
