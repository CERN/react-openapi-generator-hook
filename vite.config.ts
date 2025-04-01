import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
    }
})
