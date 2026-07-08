// Site-wide configuration.

export const SITE_NAME = 'A Few Good Hands';
export const SITE_TAGLINE = 'You can’t handle the truth about your play. Or can you?';
export const SITE_URL = 'https://www.afewgoodhands.com';
export const COPYRIGHT_OWNER = 'John Garrison';
export const COPYRIGHT_YEAR = 2026;

/**
 * Google AdSense publisher ID. The verification script tag lives in index.html;
 * this constant gates the ad units themselves. Ad units also need slot ids
 * below (created in the AdSense dashboard after approval) before they render.
 */
export const ADSENSE_CLIENT = 'ca-pub-5008239172006905';

/** default ad slot ids by placement — create these in the AdSense dashboard */
export const ADSENSE_SLOTS: Record<string, string> = {
  lobby: '',
  sidebar: '',
};
