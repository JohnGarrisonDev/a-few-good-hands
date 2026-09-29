import type { Article } from './types';
import { article as firstCasinoTrip } from './first-casino-trip';
import { article as sixFiveBlackjack } from './six-five-blackjack';
import { article as doubleElevenVsSix } from './double-eleven-vs-six';
import { article as blackjackInsurance } from './blackjack-insurance-even-money';
import { article as uthPreflopChart } from './uth-preflop-chart';
import { article as deucesWildFullPay } from './deuces-wild-full-pay';
import { article as videoPokerVsSlots } from './video-poker-vs-slots';
import { article as faq } from './faq';

// Registry of standalone Strategy School articles (served at /learn/<slug>).
// Order here is the order on the /learn/articles index: beginner-first.
export const ARTICLES: Article[] = [
  firstCasinoTrip,
  faq,
  sixFiveBlackjack,
  doubleElevenVsSix,
  blackjackInsurance,
  videoPokerVsSlots,
  deucesWildFullPay,
  uthPreflopChart,
];

export type { Article, FaqItem } from './types';
