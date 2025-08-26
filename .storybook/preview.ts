// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import type { Preview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
initialize({
  serviceWorker: {
    url: '/mockServiceWorker.js', // must exist at this path
  },
  onUnhandledRequest: 'bypass', // helps catch misses during setup
})

export const loaders = [mswLoader]

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview
