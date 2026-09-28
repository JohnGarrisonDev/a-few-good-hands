// Post-build prerendering: renders every route of the SPA to its own static
// index.html (with unique title/meta/canonical/JSON-LD and full body content)
// and writes sitemap.xml from the same route list, so the site is fully
// crawlable without JavaScript.
//
// Run after both client and SSR builds:
//   vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const { render, routes, SITE_URL } = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href);

const template = await readFile(join(dist, 'index.html'), 'utf8');

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// JSON inside <script> must not be able to close the tag
const jsonForScript = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');

function pageHtml(route) {
  const canonical = route.path ? `${SITE_URL}/${route.path}` : `${SITE_URL}/`;
  const body = render(route.path);
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escAttr(route.title)}</title>`);
  html = html.replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escAttr(route.description)}" />`);
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/<meta property="og:type"[^>]*\/>/, `<meta property="og:type" content="${route.ogType}" />`);
  html = html.replace(/<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${escAttr(route.title)}" />`);
  html = html.replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escAttr(route.description)}" />`);
  html = html.replace(/<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${escAttr(route.title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${escAttr(route.description)}" />`);
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${jsonForScript(route.jsonLd)}</script>`,
  );
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

function sitemapXml(list) {
  const urls = list
    .map((r) => {
      const loc = r.path ? `${SITE_URL}/${r.path}` : `${SITE_URL}/`;
      const lastmod = r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : '';
      return `  <url><loc>${loc}</loc>${lastmod}<changefreq>${r.changefreq}</changefreq><priority>${r.priority.toFixed(1)}</priority></url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const list = routes();
let count = 0;
for (const route of list) {
  const outDir = route.path ? join(dist, ...route.path.split('/')) : dist;
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'index.html'), pageHtml(route), 'utf8');
  count++;
}
await writeFile(join(dist, 'sitemap.xml'), sitemapXml(list), 'utf8');

// the SSR bundle is a build intermediate — don't ship it
await rm(join(root, 'dist-ssr'), { recursive: true, force: true });

console.log(`prerendered ${count} routes + sitemap.xml into dist/`);
