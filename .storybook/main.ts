// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  staticDirs: ['../mocks'],
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  }
};
export default config;
