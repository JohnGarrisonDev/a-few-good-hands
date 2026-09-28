// Build-time prerender entry. `scripts/prerender.mjs` imports the SSR bundle of
// this module and writes one static index.html per route (plus sitemap.xml) so
// crawlers (and the AdSense review process) see full content without JavaScript.
import { renderToString } from 'react-dom/server';
import App, { GAMES } from './App';
import { ARTICLES_INDEX, LESSON_DATES, TOPICS } from './pages/LearnPage';
import { ARTICLES } from './content/articles';
import { SITE_NAME, SITE_URL } from './config';
import { STATIC_PAGES } from './seoMeta';
import { articleLd, breadcrumbLd, faqLd, gameAppLd, graph, webPageLd, WEB_APPLICATION, type JsonLd } from './seo/jsonLd';

export interface RouteMeta {
  /** path without leading slash; '' is the lobby */
  path: string;
  title: string;
  description: string;
  /** Open Graph object type */
  ogType: 'website' | 'article';
  /** schema.org graph for this route, injected as application/ld+json */
  jsonLd: JsonLd;
  /** sitemap fields */
  lastmod?: string;
  changefreq: 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

const STATIC_TYPES: Record<string, string> = { about: 'AboutPage', contact: 'ContactPage', legal: 'WebPage', privacy: 'WebPage', card: 'WebPage' };
const LEARN_CRUMB = { name: 'Strategy School', path: 'learn' };

export function routes(): RouteMeta[] {
  const statics: RouteMeta[] = STATIC_PAGES.map((p) => ({
    path: p.path,
    title: p.title,
    description: p.description,
    ogType: 'website',
    jsonLd: p.path
      ? graph(webPageLd({ path: p.path, type: STATIC_TYPES[p.path], name: p.title, description: p.description }))
      : graph(WEB_APPLICATION),
    changefreq: p.path === '' ? 'weekly' : p.path === 'card' ? 'monthly' : 'yearly',
    priority: p.path === '' ? 1.0 : p.path === 'card' ? 0.7 : p.path === 'about' ? 0.5 : 0.3,
  }));

  const games: RouteMeta[] = GAMES.map((g) => ({
    path: g.path,
    title: `${g.seoTitle} | ${SITE_NAME}`,
    description: g.description,
    ogType: 'website',
    jsonLd: graph(
      gameAppLd({ path: g.path, name: g.seoTitle, description: g.description }),
      breadcrumbLd([{ name: SITE_NAME, path: '' }, { name: g.title, path: g.path }]),
    ),
    changefreq: 'monthly',
    priority: 0.9,
  }));

  const lessons: RouteMeta[] = Object.entries(TOPICS).map(([key, t]) => {
    const path = key ? `learn/${key}` : 'learn';
    const dates = LESSON_DATES[key];
    return {
      path,
      title: t.title,
      description: t.description,
      ogType: key ? 'article' : 'website',
      jsonLd: graph(
        key
          ? articleLd({ path, headline: t.title.replace(` | ${SITE_NAME}`, ''), description: t.description, ...dates })
          : webPageLd({ path, type: 'CollectionPage', name: t.title, description: t.description }),
        breadcrumbLd(key ? [{ name: SITE_NAME, path: '' }, LEARN_CRUMB, { name: t.nav, path }] : [{ name: SITE_NAME, path: '' }, LEARN_CRUMB]),
      ),
      lastmod: dates.updated,
      changefreq: 'monthly',
      priority: key === 'glossary' ? 0.7 : 0.8,
    };
  });

  const articlesIndex: RouteMeta = {
    path: 'learn/articles',
    title: ARTICLES_INDEX.title,
    description: ARTICLES_INDEX.description,
    ogType: 'website',
    jsonLd: graph(
      webPageLd({ path: 'learn/articles', type: 'CollectionPage', name: ARTICLES_INDEX.title, description: ARTICLES_INDEX.description }),
      breadcrumbLd([{ name: SITE_NAME, path: '' }, LEARN_CRUMB, { name: 'Articles', path: 'learn/articles' }]),
    ),
    lastmod: ARTICLES.reduce((m, a) => (a.updated > m ? a.updated : m), ARTICLES_INDEX.published),
    changefreq: 'weekly',
    priority: 0.8,
  };

  const articles: RouteMeta[] = ARTICLES.map((a) => {
    const path = `learn/${a.slug}`;
    const nodes: JsonLd[] = [
      articleLd({ path, headline: a.title, description: a.description, published: a.published, updated: a.updated }),
      breadcrumbLd([{ name: SITE_NAME, path: '' }, LEARN_CRUMB, { name: 'Articles', path: 'learn/articles' }, { name: a.nav, path }]),
    ];
    if (a.faq) nodes.push(faqLd(a.faq));
    return {
      path,
      title: `${a.title} | ${SITE_NAME}`,
      description: a.description,
      ogType: 'article',
      jsonLd: graph(...nodes),
      lastmod: a.updated,
      changefreq: 'monthly',
      priority: 0.8,
    };
  });

  return [...statics, ...games, ...lessons, articlesIndex, ...articles];
}

export function render(path: string): string {
  return renderToString(<App ssrPath={path} />);
}

export { SITE_URL };
