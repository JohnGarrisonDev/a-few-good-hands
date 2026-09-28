import type { JSX } from 'react';

/** one FAQ entry; also emitted as FAQPage structured data when present */
export interface FaqItem {
  q: string;
  /** plain text — no JSX — because it is reused verbatim in JSON-LD */
  a: string;
}

/**
 * A standalone Strategy School article, served at /learn/<slug>.
 * Articles are body-only components: the page wrapper renders the <h1>,
 * the byline and (for FAQ articles) the structured data.
 */
export interface Article {
  slug: string;
  /** page <h1> and <title> (site name is appended automatically) */
  title: string;
  /** meta description, 140–160 chars */
  description: string;
  /** short label for the articles index */
  nav: string;
  /** ISO dates, YYYY-MM-DD */
  published: string;
  updated: string;
  readingMinutes: number;
  /** optional — present only on the FAQ article */
  faq?: FaqItem[];
  component: () => JSX.Element;
}
