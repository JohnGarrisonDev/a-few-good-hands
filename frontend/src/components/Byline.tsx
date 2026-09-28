import { COPYRIGHT_OWNER } from '../config';

/** "Sep 28, 2026" from an ISO date — rendered identically on server and client */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${d}, ${y}`;
}

/**
 * Author + dates line under a lesson or article headline. Dates are ISO
 * strings (YYYY-MM-DD) so they can double as JSON-LD datePublished/dateModified.
 */
export function Byline({ published, updated, minutes }: { published: string; updated: string; minutes?: number }) {
  return (
    <p className="byline">
      By <a href="/about">{COPYRIGHT_OWNER}</a>
      <span className="byline-sep">·</span>
      <time dateTime={published}>Published {formatDate(published)}</time>
      {updated !== published && (
        <>
          <span className="byline-sep">·</span>
          <time dateTime={updated}>Updated {formatDate(updated)}</time>
        </>
      )}
      {minutes ? (
        <>
          <span className="byline-sep">·</span>
          <span>{minutes} min read</span>
        </>
      ) : null}
    </p>
  );
}
