import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const svgPath = path.join(root, 'public/favicon.svg');
const pngPath = path.join(root, 'public/og-image.png');

const OUTPUT_SIZE = 512;
const RENDER_SCALE = 2;

const svg = readFileSync(svgPath, 'utf8');
const resvg = new Resvg(svg, {
  fitTo: {
    mode: 'width',
    value: OUTPUT_SIZE * RENDER_SCALE,
  },
});
const rendered = resvg.render().asPng();

const png = await sharp(rendered)
  .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
    kernel: sharp.kernel.lanczos3,
  })
  .png({
    compressionLevel: 9,
    palette: false,
  })
  .toBuffer();

writeFileSync(pngPath, png);
console.log(
  `Wrote ${pngPath} (${OUTPUT_SIZE}x${OUTPUT_SIZE}) from favicon.svg`,
);
