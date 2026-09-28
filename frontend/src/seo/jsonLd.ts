import { COPYRIGHT_OWNER, SITE_NAME, SITE_URL } from '../config';
import type { FaqItem } from '../content/articles/types';

// Per-route schema.org JSON-LD. The prerenderer swaps the template's
// site-wide block for the route's own graph, so every page carries data
// that matches its content (Article for lessons, FAQPage for the FAQ, …).

export type JsonLd = Record<string, unknown>;

const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const PERSON: JsonLd = {
  '@type': 'Person',
  '@id': `${SITE_URL}/about#author`,
  name: COPYRIGHT_OWNER,
  url: `${SITE_URL}/about`,
};

export const ORGANIZATION: JsonLd = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon-512.png`, width: 512, height: 512 },
};

export const WEBSITE: JsonLd = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  publisher: { '@id': `${SITE_URL}/#organization` },
};

/** the lobby's app description, kept from the original template */
export const WEB_APPLICATION: JsonLd = {
  '@type': 'WebApplication',
  '@id': `${SITE_URL}/#app`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  applicationCategory: 'GameApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    "Free casino strategy trainer: blackjack, video poker, Ultimate Texas Hold'em and Three Card Poker with every decision graded against exact expected-value math. No real-money gambling.",
  audience: { '@type': 'PeopleAudience', suggestedMinAge: 21 },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export function breadcrumbLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.path ? `${SITE_URL}/${it.path}` : `${SITE_URL}/`,
    })),
  };
}

export function articleLd(a: {
  path: string;
  headline: string;
  description: string;
  published: string;
  updated: string;
}): JsonLd {
  const url = `${SITE_URL}/${a.path}`;
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: a.headline,
    description: a.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: OG_IMAGE,
    datePublished: a.published,
    dateModified: a.updated,
    author: { '@id': `${SITE_URL}/about#author` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
    isAccessibleForFree: true,
  };
}

export function faqLd(items: FaqItem[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function webPageLd(p: { path: string; type?: string; name: string; description: string }): JsonLd {
  const url = p.path ? `${SITE_URL}/${p.path}` : `${SITE_URL}/`;
  return {
    '@type': p.type ?? 'WebPage',
    '@id': url,
    url,
    name: p.name,
    description: p.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en',
  };
}

/** one game trainer page: the app itself, scoped to that game */
export function gameAppLd(g: { path: string; name: string; description: string }): JsonLd {
  const url = `${SITE_URL}/${g.path}`;
  return {
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name: g.name,
    url,
    description: g.description,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isPartOf: { '@id': `${SITE_URL}/#app` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** wrap a route's nodes in one @graph document */
export function graph(...nodes: JsonLd[]): JsonLd {
  return { '@context': 'https://schema.org', '@graph': [ORGANIZATION, PERSON, WEBSITE, ...nodes] };
}
