import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { browserslistToTargets } from 'lightningcss';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repositoryName = 'improv-running-order-tool';
const githubPagesBase = `/${repositoryName}/`;

const browserslistOptions = {
  path: __dirname,
  env: process.env.BROWSERSLIST_ENV ?? 'production',
};

const supportedBrowsers = browserslist(undefined, browserslistOptions);
const buildTarget = browserslistToEsbuild(supportedBrowsers);

// https://vite.dev/config/
export default defineConfig({
  // GitHub project pages are served from /repo-name/, not domain root.
  base: process.env.GITHUB_PAGES === 'true' ? githubPagesBase : '/',
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: buildTarget.length > 0 ? buildTarget : 'baseline-widely-available',
    cssTarget:
      buildTarget.length > 0 ? buildTarget : 'baseline-widely-available',
  },
  css: {
    lightningcss: {
      targets: browserslistToTargets(supportedBrowsers),
    },
  },
});
