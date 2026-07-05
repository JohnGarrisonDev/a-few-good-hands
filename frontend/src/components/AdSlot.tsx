import { useEffect } from 'react';
import { ADSENSE_CLIENT, ADSENSE_SLOTS } from '../config';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

let scriptInjected = false;
function ensureAdsenseScript() {
  if (scriptInjected || !ADSENSE_CLIENT) return;
  scriptInjected = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
}

/**
 * Responsive AdSense display unit. Renders nothing until ADSENSE_CLIENT
 * (and the slot id for this placement) are configured in src/config.ts.
 */
export function AdSlot({ placement }: { placement: keyof typeof ADSENSE_SLOTS }) {
  const slot = ADSENSE_SLOTS[placement];
  const enabled = Boolean(ADSENSE_CLIENT && slot);

  useEffect(() => {
    if (!enabled) return;
    ensureAdsenseScript();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* blocked or not yet loaded — fine */
    }
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="ad-slot">
      <span className="ad-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
