// One-shot brand asset generator: favicons + og:image, all derived from the
// same card-fan artwork as components/icons.tsx Logo. Outputs are committed to
// public/ — rerun only when the brand art changes:
//   node scripts/generate-assets.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const pub = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// -------------------------------------------------- shared artwork
const CREAM = '#f2ecdc';
const GOLD = '#d9ab4a';
const GOLD_DIM = '#9c7a2e';
const FELT = '#0f3d2e';
const INK = '#22281f';
const TEXT = '#ece7da';
const TEXT_DIM = '#99a396';

/** the Logo card fan from components/icons.tsx, in its native 48x48 box */
const CARD_FAN = `
  <g transform="rotate(-16 24 40)">
    <rect x="10" y="10" width="20" height="28" rx="3" fill="${CREAM}" stroke="${GOLD_DIM}" stroke-width="1.4" />
  </g>
  <g>
    <rect x="14" y="8" width="20" height="28" rx="3" fill="${CREAM}" stroke="${GOLD_DIM}" stroke-width="1.4" />
  </g>
  <g transform="rotate(16 24 40)">
    <rect x="18" y="10" width="20" height="28" rx="3" fill="${CREAM}" stroke="${GOLD_DIM}" stroke-width="1.4" />
    <path d="M28 16c-2.6 3-4.4 4.7-4.4 6.8 0 1.5 1.2 2.6 2.6 2.6.6 0 1.2-.2 1.6-.6-.2 1.2-.7 2.2-1.6 3h3.6c-.9-.8-1.4-1.8-1.6-3 .4.4 1 .6 1.6.6 1.4 0 2.6-1.1 2.6-2.6 0-2.1-1.8-3.8-4.4-6.8z" fill="${INK}" />
  </g>`;

// -------------------------------------------------- favicon
// felt-green rounded tile behind the fan so it reads on any tab bar
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="9" fill="${FELT}" />
  <rect x="1" y="1" width="46" height="46" rx="8" fill="none" stroke="${GOLD_DIM}" stroke-width="1" opacity="0.55" />
  <g transform="translate(24 23) scale(0.92) translate(-24 -23)">${CARD_FAN}</g>
</svg>`;

// -------------------------------------------------- og:image (1200x630)
// Georgia stands in for Fraunces: the generator runs offline and Georgia ships
// with Windows; keep any real-font upgrade out of the build path.
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${FELT}" />
  <rect width="1200" height="630" fill="url(#vig)" />
  <radialGradient id="vig" cx="0.5" cy="0.42" r="0.85">
    <stop offset="0.55" stop-color="#000" stop-opacity="0" />
    <stop offset="1" stop-color="#000" stop-opacity="0.42" />
  </radialGradient>
  <rect x="26" y="26" width="1148" height="578" fill="none" stroke="${GOLD_DIM}" stroke-width="2" opacity="0.7" />
  <rect x="34" y="34" width="1132" height="562" fill="none" stroke="${GOLD_DIM}" stroke-width="1" opacity="0.4" />

  <g transform="translate(88 108) scale(8.6)">${CARD_FAN}</g>

  <g font-family="Georgia, serif">
    <text x="505" y="256" font-size="62" font-weight="bold" fill="${TEXT}">A Few Good <tspan font-style="italic" fill="${GOLD}">Hands</tspan></text>
    <text x="508" y="316" font-size="24" fill="${GOLD}" letter-spacing="8" font-family="Arial, sans-serif">CASINO STRATEGY TRAINER</text>
    <text x="508" y="392" font-size="28" fill="${TEXT_DIM}" font-family="Arial, sans-serif">Every decision graded against the real math.</text>
    <text x="508" y="436" font-size="28" fill="${TEXT_DIM}" font-family="Arial, sans-serif">Free, play-money only — blackjack, video poker,</text>
    <text x="508" y="480" font-size="28" fill="${TEXT_DIM}" font-family="Arial, sans-serif">Ultimate Texas Hold${"’"}em, Three Card Poker.</text>
    <text x="508" y="548" font-size="23" fill="${GOLD_DIM}" font-family="Arial, sans-serif">www.afewgoodhands.com</text>
  </g>
</svg>`;

// -------------------------------------------------- render
await mkdir(pub, { recursive: true });
await writeFile(join(pub, 'favicon.svg'), faviconSvg, 'utf8');

const fav = Buffer.from(faviconSvg);
const sizes = [16, 32, 48, 180, 192, 512];
const pngs = {};
for (const s of sizes) {
  pngs[s] = await sharp(fav, { density: (72 * s) / 48 }).resize(s, s).png().toBuffer();
}
await writeFile(join(pub, 'favicon-32.png'), pngs[32]);
await writeFile(join(pub, 'favicon-192.png'), pngs[192]);
await writeFile(join(pub, 'favicon-512.png'), pngs[512]);
await writeFile(join(pub, 'apple-touch-icon.png'), pngs[180]);
await writeFile(join(pub, 'favicon.ico'), await pngToIco([pngs[16], pngs[32], pngs[48]]));

await sharp(Buffer.from(ogSvg)).png().toFile(join(pub, 'og-image.png'));

console.log('wrote favicon.svg/.ico, PNG icons and og-image.png to public/');
