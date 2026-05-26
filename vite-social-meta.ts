import type { Plugin } from 'vite';

import {
  DEFAULT_SITE_URL,
  FAVICON_VERSION,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  OG_LOCALE,
  PWA_SHORT_NAME,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from './site-metadata';

function resolveSiteUrl(): string {
  return (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '');
}

function resolveAbsoluteUrl(siteUrl: string, pathname: string): string {
  return `${siteUrl}/${pathname.replace(/^\//, '')}`;
}

export function socialMetaPlugin(): Plugin {
  const siteUrl = resolveSiteUrl();
  const pageUrl = `${siteUrl}/`;
  const ogImageUrl = resolveAbsoluteUrl(siteUrl, 'og-image.png');

  const tags = [
    `<link rel="canonical" href="${pageUrl}" />`,
    `<meta name="author" content="${SITE_AUTHOR}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_TITLE}" />`,
    `<meta property="og:locale" content="${OG_LOCALE}" />`,
    `<meta property="og:title" content="${SITE_TITLE}" />`,
    `<meta property="og:description" content="${SITE_DESCRIPTION}" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    `<meta property="og:image" content="${ogImageUrl}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />`,
    `<meta property="og:image:alt" content="${OG_IMAGE_ALT}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${SITE_TITLE}" />`,
    `<meta name="twitter:description" content="${SITE_DESCRIPTION}" />`,
    `<meta name="twitter:image" content="${ogImageUrl}" />`,
    `<meta name="twitter:image:alt" content="${OG_IMAGE_ALT}" />`,
  ].join('\n    ');

  return {
    name: 'social-meta',
    transformIndexHtml(html) {
      return html
        .replace('<!--vite-social-meta-->', tags)
        .replaceAll('<!--vite-site-description-->', SITE_DESCRIPTION)
        .replaceAll('<!--vite-site-title-->', SITE_TITLE)
        .replaceAll('<!--vite-pwa-short-name-->', PWA_SHORT_NAME)
        .replaceAll('<!--vite-favicon-version-->', FAVICON_VERSION);
    },
  };
}
