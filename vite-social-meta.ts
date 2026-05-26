import type { Plugin } from 'vite';

const SITE_TITLE = "Scott's Improv Running Order Tool";
const SITE_DESCRIPTION =
  'Build and manage improv show lineups and cast assignments.';
const SITE_AUTHOR = 'Scott Blinch';
const OG_IMAGE_ALT = 'Drama masks app icon';
const OG_IMAGE_WIDTH = 512;
const OG_IMAGE_HEIGHT = 512;
const OG_LOCALE = 'en_US';

const DEFAULT_SITE_URL =
  'https://scottblinch.github.io/improv-running-order-tool';

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
      return html.replace('<!--vite-social-meta-->', tags);
    },
  };
}

export const socialMetaConstants = {
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_AUTHOR,
  OG_IMAGE_ALT,
} as const;
