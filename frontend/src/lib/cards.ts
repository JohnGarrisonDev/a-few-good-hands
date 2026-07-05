// Card representation: integer 0..51. rank = card % 13 (0 = deuce ... 12 = ace), suit = Math.floor(card / 13).
export type Card = number;

export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
export const SUITS = ['♠', '♥', '♦', '♣'] as const;
export const SUIT_NAMES = ['spades', 'hearts', 'diamonds', 'clubs'] as const;

export const rankOf = (c: Card): number => c % 13;
export const suitOf = (c: Card): number => Math.floor(c / 13);
export const cardLabel = (c: Card): string => `${RANKS[rankOf(c)]}${SUITS[suitOf(c)]}`;
export const isRed = (c: Card): boolean => suitOf(c) === 1 || suitOf(c) === 2;

export function freshDeck(numDecks = 1): Card[] {
  const deck: Card[] = [];
  for (let d = 0; d < numDecks; d++) {
    for (let c = 0; c < 52; c++) deck.push(c);
  }
  return deck;
}

export function shuffle(deck: Card[]): Card[] {
  const a = deck.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Blackjack value of a rank index (0=deuce..12=ace). Ace counts as 11 here; hand logic handles soft/hard. */
export const bjValue = (c: Card): number => {
  const r = rankOf(c);
  if (r === 12) return 11; // ace
  if (r >= 8) return 10; // 10, J, Q, K
  return r + 2;
};
