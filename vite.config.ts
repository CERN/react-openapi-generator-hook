// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { configDefaults, coverageConfigDefaults } from 'vitest/config'
import visualizer from 'rollup-plugin-visualizer'
import pkg from './package.json'

const peerDependencies = Object.keys(pkg.peerDependencies || {})

export default defineConfig(async () => {
  const { default: tailwind } = await import('@tailwindcss/vite')
  return {
    plugins: [
      react(),
      tailwind(),
      visualizer({
        filename: 'stats.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        open: true
      })
    ],
    resolve: {
      alias: {
        'types': path.resolve(__dirname, './src/types'),
        'context': path.resolve(__dirname, './src/context'),
        'hook': path.resolve(__dirname, './src/hook')
      }
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'index.ts'),
        name: 'ReactOpenApiHook',
        fileName: (format) => `react-openapi-hook.${format}.js`
      },
      rollupOptions: {
        external: id => /^react($|\/)/.test(id) || /^react-dom($|\/)/.test(id) || peerDependencies.includes(id),
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'ReactJSXRuntime',
            'react/jsx-dev-runtime': 'ReactJSXDevRuntime'
          }
        }
      }
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: './test/tests-setup.ts',
      exclude: [...configDefaults.exclude, 'generated', 'src/types', '**/index.ts', 'src/test-utils'],
      pool: 'threads',
      poolOptions: {
        threads: {
          minThreads: 2,
          maxThreads: 4
        }
      },
      coverage: {
        provider: 'v8',
        exclude: [
          ...coverageConfigDefaults.exclude,
          'open-api-configuration', // generated files
          'generated'
        ],
        reporter: ['html'],
        thresholds: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      },
      testTimeout: 30000
    }
  }
})
