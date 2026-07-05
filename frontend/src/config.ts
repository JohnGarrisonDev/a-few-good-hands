// Site-wide configuration.

export const SITE_NAME = 'A Few Good Hands';
export const SITE_TAGLINE = 'You can’t handle the truth about your play. Or can you?';
export const SITE_URL = 'https://afewgoodhands.com';
export const COPYRIGHT_OWNER = 'John Garrison';
export const COPYRIGHT_YEAR = 2026;

/**
 * Google AdSense publisher ID, e.g. 'ca-pub-1234567890123456'.
 * Leave empty until the AdSense account is approved — ad units render nothing
 * (and the AdSense script is not loaded) while this is blank.
 * After approval: 1) paste the ID here, 2) update public/ads.txt with the same
 * numeric ID, 3) rebuild and redeploy.
 */
export const ADSENSE_CLIENT = '';

/** default ad slot ids by placement — create these in the AdSense dashboard */
export const ADSENSE_SLOTS: Record<string, string> = {
  lobby: '',
  sidebar: '',
};
