// Build-time prerender entry. `scripts/prerender.mjs` imports the SSR bundle of
// this module and writes one static index.html per route so crawlers (and the
// AdSense review process) see full content without executing JavaScript.
import { renderToString } from 'react-dom/server';
import App, { GAMES } from './App';
import { TOPICS } from './pages/LearnPage';
import { SITE_NAME, SITE_URL } from './config';
import { STATIC_PAGES } from './seoMeta';

export interface RouteMeta {
  /** path without leading slash; '' is the lobby */
  path: string;
  title: string;
  description: string;
}

export function routes(): RouteMeta[] {
  return [
    ...STATIC_PAGES,
    ...GAMES.map((g) => ({ path: g.path, title: `${g.seoTitle} | ${SITE_NAME}`, description: g.description })),
    ...Object.entries(TOPICS).map(([key, t]) => ({
      path: key ? `learn/${key}` : 'learn',
      title: t.title,
      description: t.description,
    })),
  ];
}

export function render(path: string): string {
  return renderToString(<App ssrPath={path} />);
}

export { SITE_URL };
