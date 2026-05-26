import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import toIco from 'to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const svgPath = path.join(root, 'public/favicon.svg');
const icoPath = path.join(root, 'public/favicon.ico');

const sizes = [16, 32, 48];
const svg = readFileSync(svgPath, 'utf8');

const pngBuffers = await Promise.all(
  sizes.map(async (size) => {
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: size * 2,
      },
    });
    const rendered = resvg.render().asPng();

    return sharp(rendered)
      .resize(size, size, { kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 9 })
      .toBuffer();
  }),
);

writeFileSync(icoPath, await toIco(pngBuffers));
console.log(`Wrote ${icoPath} (${sizes.join(', ')}px) from favicon.svg`);
