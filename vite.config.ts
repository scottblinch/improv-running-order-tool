import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { browserslistToTargets } from 'lightningcss';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repositoryName = 'improv-running-order-tool';
const githubPagesBase = `/${repositoryName}/`;
const base = process.env.GITHUB_PAGES === 'true' ? githubPagesBase : '/';

const pwaManifestIcons = [
  {
    src: 'pwa-64x64.png',
    sizes: '64x64',
    type: 'image/png',
  },
  {
    src: 'pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
  },
  {
    src: 'maskable-icon-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
] as const;

const browserslistOptions = {
  path: __dirname,
  env: process.env.BROWSERSLIST_ENV ?? 'production',
};

const supportedBrowsers = browserslist(undefined, browserslistOptions);
const buildTarget = browserslistToEsbuild(supportedBrowsers);

// https://vite.dev/config/
export default defineConfig({
  // GitHub project pages are served from /repo-name/, not domain root.
  base,
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'apple-touch-icon-180x180.png',
      ],
      manifest: {
        name: "Scott's Improv Running Order Tool",
        short_name: 'Improv Shows',
        description:
          'Build and manage improv show lineups and cast assignments.',
        theme_color: '#863bff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        start_url: base,
        scope: base,
        icons: [...pwaManifestIcons],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: 'index.html',
      },
      devOptions: {
        enabled: true,
      },
    }),
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
