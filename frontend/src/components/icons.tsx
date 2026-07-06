// Inline SVG iconography — drawn for this site, monochrome, inherits currentColor.

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {/* fanned trio of cards */}
      <g transform="rotate(-16 24 40)">
        <rect x="10" y="10" width="20" height="28" rx="3" fill="#f2ecdc" stroke="#9c7a2e" strokeWidth="1.4" />
      </g>
      <g transform="rotate(0 24 40)">
        <rect x="14" y="8" width="20" height="28" rx="3" fill="#f2ecdc" stroke="#9c7a2e" strokeWidth="1.4" />
      </g>
      <g transform="rotate(16 24 40)">
        <rect x="18" y="10" width="20" height="28" rx="3" fill="#f2ecdc" stroke="#9c7a2e" strokeWidth="1.4" />
        {/* spade on the top card */}
        <path
          d="M28 16c-2.6 3-4.4 4.7-4.4 6.8 0 1.5 1.2 2.6 2.6 2.6.6 0 1.2-.2 1.6-.6-.2 1.2-.7 2.2-1.6 3h3.6c-.9-.8-1.4-1.8-1.6-3 .4.4 1 .6 1.6.6 1.4 0 2.6-1.1 2.6-2.6 0-2.1-1.8-3.8-4.4-6.8z"
          fill="#22281f"
        />
      </g>
    </svg>
  );
}

export function IconBlackjack() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="7" width="14" height="20" rx="2" transform="rotate(-8 11 17)" />
      <rect x="14" y="5" width="14" height="20" rx="2" transform="rotate(8 21 15)" />
      <text x="20" y="16" fontSize="8" fill="currentColor" stroke="none" fontFamily="Georgia, serif" fontWeight="bold" transform="rotate(8 21 15)">
        21
      </text>
    </svg>
  );
}

export function IconVideoPoker() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="26" height="18" rx="2" />
      <rect x="6.5" y="12" width="4" height="7" rx="1" fill="currentColor" stroke="none" opacity="0.85" />
      <rect x="12" y="10" width="4" height="9" rx="1" fill="currentColor" stroke="none" opacity="0.55" />
      <rect x="17.5" y="12" width="4" height="7" rx="1" fill="currentColor" stroke="none" opacity="0.85" />
      <rect x="23" y="10" width="4" height="9" rx="1" fill="currentColor" stroke="none" opacity="0.55" />
      <path d="M12 27h8M16 23v4" />
    </svg>
  );
}

export function IconSpade() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 3C10.5 9.4 6.5 13 6.5 17.6c0 3.2 2.5 5.6 5.5 5.6 1.3 0 2.5-.4 3.4-1.2-.4 2.5-1.5 4.6-3.4 6.4h8c-1.9-1.8-3-3.9-3.4-6.4.9.8 2.1 1.2 3.4 1.2 3 0 5.5-2.4 5.5-5.6C25.5 13 21.5 9.4 16 3z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconTripleCards() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="2.5" y="8" width="11" height="16" rx="2" transform="rotate(-14 8 16)" />
      <rect x="10.5" y="6" width="11" height="16" rx="2" />
      <rect x="18.5" y="8" width="11" height="16" rx="2" transform="rotate(14 24 16)" />
    </svg>
  );
}

export function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12.5l5.5 5.5L20 6.5" />
    </svg>
  );
}

export function IconX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

export function IconHamburger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconThumbUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 10h4v11H2zM8 21h9.2c1 0 1.9-.7 2.1-1.7l1.6-7A2 2 0 0 0 19 10h-5.4l.9-4.2A1.8 1.8 0 0 0 12.7 4c-.5 0-1 .3-1.3.7L8 10z" />
    </svg>
  );
}

export function IconThumbDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 14h-4V3h4zM16 3H6.8c-1 0-1.9.7-2.1 1.7l-1.6 7A2 2 0 0 0 5 14h5.4l-.9 4.2a1.8 1.8 0 0 0 1.8 2.1c.5 0 1-.3 1.3-.7L16 14z" />
    </svg>
  );
}
