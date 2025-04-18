import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { configDefaults, coverageConfigDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
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
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
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
        'generated',
      ],
      reporter: ['lcov', 'text', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },
    testTimeout: 30000,
  },
})
