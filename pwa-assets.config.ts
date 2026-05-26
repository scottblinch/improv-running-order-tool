import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    transparent: {
      ...minimal2023Preset.transparent,
      // favicon.ico is built by scripts/generate-favicon-ico.mjs (16/32/48).
      favicons: [],
    },
  },
  images: ['public/favicon.svg'],
});
