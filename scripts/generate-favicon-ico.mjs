import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const svgPath = path.join(root, 'public/favicon.svg');
const icoPath = path.join(root, 'public/favicon.ico');

const sizes = [16, 32, 48];
const svg = readFileSync(svgPath, 'utf8');

/** Build a multi-size ICO from PNG buffers (Vista+ PNG-in-ICO format). */
function encodePngIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  const dataOffset = headerSize + entrySize * count;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = Buffer.alloc(entrySize * count);
  let offset = dataOffset;

  for (let index = 0; index < count; index += 1) {
    const png = pngBuffers[index];
    const size = pngBuffers[index].length;
    const { width, height } = pngDimensions(png);
    const entryOffset = index * entrySize;

    entries.writeUInt8(width >= 256 ? 0 : width, entryOffset);
    entries.writeUInt8(height >= 256 ? 0 : height, entryOffset + 1);
    entries.writeUInt8(0, entryOffset + 2);
    entries.writeUInt8(0, entryOffset + 3);
    entries.writeUInt16LE(1, entryOffset + 4);
    entries.writeUInt16LE(32, entryOffset + 6);
    entries.writeUInt32LE(size, entryOffset + 8);
    entries.writeUInt32LE(offset, entryOffset + 12);

    offset += size;
  }

  return Buffer.concat([header, entries, ...pngBuffers]);
}

function pngDimensions(png) {
  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  };
}

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

writeFileSync(icoPath, encodePngIco(pngBuffers));
console.log(`Wrote ${icoPath} (${sizes.join(', ')}px) from favicon.svg`);
