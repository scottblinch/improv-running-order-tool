import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repositoryName = 'improv-running-order-tool';
const githubPagesBase = `/${repositoryName}/`;

// https://vite.dev/config/
export default defineConfig({
  // GitHub project pages are served from /repo-name/, not domain root.
  base: process.env.GITHUB_PAGES === 'true' ? githubPagesBase : '/',
  plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
